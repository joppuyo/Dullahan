<?php

namespace Dullahan\Controller;

use Carbon\Carbon;
use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Dullahan\Model\Content;
use Exception;
use Illuminate\Support\Collection;
use Slim\Http\Request;
use Slim\Http\Response;
use Symfony\Component\Yaml\Parser;

class ContentController extends Controller
{
    public function listContentTypes(Request $request, Response $response, $arguments)
    {
        $list = new Collection();
        $contentTypes = collect($this->container->ContentService->getContentTypes());
        $contentTypes->each(function ($type) use ($list) {
            $new = new \stdClass();
            $new->name = $type->name;
            $new->slug = $type->slug;
            $list->push($new);
        });
        return $response->withJson($list, 200, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function listContent(Request $request, Response $response, $arguments)
    {
        $content = Content::where('content_type', $arguments['contentTypeSlug'])
            ->orderBy('updated_at', true)
            ->get();
        $contentTypeDefinition = $this->container->ContentService
            ->getContentTypeDefinition($arguments['contentTypeSlug']);

        if ($request->getQueryParam('show-unpublished') !== 'true') {
            $content = $content->filter(function ($value) {
                return $value->is_published === true;
            })->values();
        }

        $content = $content->map(function ($item) use ($request, $contentTypeDefinition) {
            return $this->container->ContentService->convertFields($item, $contentTypeDefinition, $request);
        });

        return $response->withJson($content, 200, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function getSingleContent(Request $request, Response $response, $arguments)
    {
        $content = Content::find($arguments['contentId']);
        if (!$content) {
            return $response->withJson(['message' => 'Content not found'], 404);
        }
        $contentTypeDefinition = $this->container->ContentService
            ->getContentTypeDefinition($content['content_type']);
        $content = $this->container->ContentService->convertFields($content, $contentTypeDefinition, $request);
        return $response->withJson($content);
    }

    public function getContentType(Request $request, Response $response, $arguments)
    {
        $contentType = $this->container->ContentService->getContentTypeDefinition(($arguments['contentTypeSlug']));
        return $response->withJson($contentType, 200, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function getComponentType(Request $request, Response $response, $arguments)
    {
        $contentType = $this->container->ContentService->getComponentTypeDefinition(($arguments['componentTypeSlug']));
        return $response->withJson($contentType, 200, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }


    public function createContent(Request $request, Response $response, $arguments)
    {
        $data = $request->getParsedBody();
        if (!$data) {
            return $response->withJson(['message' => 'Could not parse JSON', 'errorCode' => 'JSON_PARSE_ERROR'], 400);
        }
        $contentType = $this->container->ContentService->getContentTypeDefinition(($arguments['contentTypeSlug']));
        $content = new Content();
        $content->is_published = false;
        $content->user_id = $this->container->user->id;
        $content->content_type = $arguments['contentTypeSlug'];
        $fields = new \stdClass();
        foreach ($contentType->fields as $currentField) {
            if (array_key_exists($currentField->slug, $data)) {
                $fields->{$currentField->slug} = $data[$currentField->slug];
            }
        }
        $content->fields = $fields;
        $content->save();
        return $response->withJson($this->container->ContentService->convertFields($content, $contentType, $request), 201);
    }

    public function updateContent(Request $request, Response $response, $arguments)
    {
        $data = $request->getParsedBody();
        if (!$data) {
            return $response->withJson(['message' => 'Could not parse JSON', 'errorCode' => 'JSON_PARSE_ERROR'], 400);
        }
        $content = Content::find($arguments['contentId']);
        if (!$content) {
            return $response->withJson(['message' => 'Content not found', 'errorCode' => 'CONTENT_NOT_FOUND'], 404);
        }
        $contentType = $this->container->ContentService->getContentTypeDefinition(($content->content_type));
        $fields = new \stdClass();
        foreach ($contentType->fields as $currentField) {
            if (array_key_exists($currentField->slug, $data)) {
                $fields->{$currentField->slug} = $data[$currentField->slug];
            }
        }
        $content->fields = $fields;
        $content->save();
        // TODO: return modified object
        return $response->withJson($this->container->ContentService->convertFields($content, $contentType, $request), 201);
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
          ->where('is_published', true)
          ->get();
        if ($content->isEmpty()){
            $this->app->notFound();
        }
        $lastModified = $content->first()->updated_at;
        $timestamp = Carbon::createFromFormat('Y-m-d H:i:s',$lastModified)->timestamp;
        $this->app->lastModified($timestamp);
        $content = $this->app->contentService->convertFields($content);
        $this->app->contentType('application/json');
        $this->app->halt(200, $content->first()->toJson(JSON_PRETTY_PRINT));
    }

    public function listContentJson($contentTypeSlug)
    {
        $lastModified = Content::where('content_type', $contentTypeSlug)->max('updated_at');
        $timestamp = Carbon::createFromFormat('Y-m-d H:i:s',$lastModified)->timestamp;
        $this->app->lastModified($timestamp);
        $content = Content::where('content_type', $contentTypeSlug)
          ->where('is_published', true)
          ->orderBy('created_at', 'desc')
          ->get();
        $content = $this->app->contentService->convertFields($content);
        $this->app->contentType('application/json');
        $this->app->halt(200, $content->toJson(JSON_PRETTY_PRINT));
    }
}
