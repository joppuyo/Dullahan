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
        $content = Content::all();
        $this->app->render('content.twig', ['content' => $content]);
    }

    public function write($contentTypeSlug)
    {
        $yaml = new Parser();
        try {
            $contentType = $yaml->parse(file_get_contents("content-types/$contentTypeSlug.yaml"));
        } catch (Exception $e) {
            echo "could not open configuration: " . $e->getMessage();
        }

        $media = $this->app->mediaService->getAllMedia();
        $this->app->render('write.twig', ['contentType' => $contentType, 'media' => $media]);

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

    public function edit($contentId){
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

    public function listContentJson($contentTypeSlug)
    {
        $content = Content::where('content_type', $contentTypeSlug)
          ->where('is_published', true)
          ->get();
        $this->app->contentType('application/json');
        $this->app->halt(200, $content->toJson(JSON_PRETTY_PRINT));

    }
}