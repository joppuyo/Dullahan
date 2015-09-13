<?php

namespace Dullahan\Controller;

use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Dullahan\Model\Content;
use Exception;
use Symfony\Component\Yaml\Parser;

class ContentController extends Controller
{

    public function listContent()
    {
        $content = Content::all()->sortByDesc('updated_at');
        $this->app->render('contentList.twig', ['content' => $content]);
    }

    public function addContentSelect()
    {
        $contentTypes = $this->app->contentService->enumerateContentTypes();
        $this->app->render('contentAddSelect.twig', ['contentTypes' => $contentTypes]);
    }

    public function addContent($contentTypeSlug)
    {
        $yaml = new Parser();
        try {
            $contentType = $yaml->parse(file_get_contents("content-types/$contentTypeSlug.yaml"));
        } catch (Exception $e) {
            echo "could not open configuration: " . $e->getMessage();
        }

        $media = $this->app->mediaService->getAllMedia();
        $this->app->render('contentAdd.twig', ['contentType' => $contentType, 'media' => $media]);

        if ($this->app->request->isPost()) {
            $content = new Content();
            $content->title = $this->app->request->post('d-title');
            $content->slug = $this->app->request->post('d-slug');
            $content->is_published = true;
            $content->user_id = Sentinel::getUser()->id;
            $content->content_type = $contentTypeSlug;
            $fields = [];
            foreach ($contentType['fields'] as $currentField) {
                $field = [];
                $field['name'] = $currentField['name'];
                $field['slug'] = $currentField['slug'];
                $field['value'] = $this->app->request->post($currentField['slug']);
                array_push($fields, $field);
            }
            $content->fields = $fields;
            $content->save();
            $this->app->flash('success', 'New content added succesfully!');
            $this->app->redirectTo('contentList');
        }
    }

    public function editContent($contentId){
        $content = Content::find($contentId);
        $yaml = new Parser();
        try {
            $contentType = $yaml->parse(file_get_contents("content-types/$content->content_type.yaml"));

            $customFields = [];

            foreach ($content['fields'] as $field) {
                $customFields[$field['slug']] = $field['value'];
            }

            $media = $this->app->mediaService->getAllMedia();

            if ($this->app->request->isPost()) {
                if($this->app->request->post('delete') !== null) {
                    $content = Content::find($this->app->request->post('delete'));
                    $this->app->flash('success', "Content $content->title deleted successfully.");
                    $content->delete();
                    $this->app->redirectTo('contentList');
                }

                $content->title = $this->app->request->post('d-title');
                $content->slug = $this->app->request->post('d-slug');

                $fields = [];
                foreach ($contentType['fields'] as $currentField) {
                    $field = [];
                    $field['name'] = $currentField['name'];
                    $field['slug'] = $currentField['slug'];
                    $field['value'] = $this->app->request->post($currentField['slug']);
                    array_push($fields, $field);
                }
                $content->fields = $fields;

                $content->save();
                $this->app->flash('success', 'Content saved successfully');
                $this->app->redirectTo('contentList');
            }

            $this->app->render('contentEdit.twig', ['contentType' => $contentType, 'content' => $content, 'customFields' => $customFields, 'media' => $media]);
        } catch (Exception $e) {
            echo "Exception: " . $e->getMessage();
        }
    }

    public function getContentJson($contentType, $contentSlug)
    {
        $content = Content::where('content_type', $contentType)
          ->where('slug', $contentSlug)
          ->get();
        if ($content->isEmpty()){
            $this->app->notFound();
        }
        $content = $this->app->contentService->convertFields($content);
        $this->app->halt(200, $content[0]->toJson(JSON_PRETTY_PRINT));
    }

    public function listContentJson($contentTypeSlug)
    {
        $content = Content::where('content_type', $contentTypeSlug)
          ->where('is_published', true)
          ->get();
        $content = $this->app->contentService->convertFields($content);
        $this->app->contentType('application/json');
        $this->app->halt(200, $content->toJson(JSON_PRETTY_PRINT));
    }
}