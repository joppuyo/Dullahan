<?php

namespace Dullahan\Controller;

use Dullahan\Model\Content;
use Exception;
use Symfony\Component\Yaml\Parser;

class ContentController extends Controller
{
    public function write($contentTypeSlug)
    {
        $yaml = new Parser();
        try {
            $contentType
              = $yaml->parse(file_get_contents("content-types/$contentTypeSlug.yaml"));
            $this->app->render('write.twig', ['contentType' => $contentType]);
        } catch (Exception $e) {
            echo "could not open configuration: " . $e->getMessage();
        }
        if ($this->app->request->isPost()) {
            $content = new Content();
            $content->title = $this->app->request->post('d-title');
            $content->slug = $this->app->request->post('d-slug');
            $content->is_published = true;
            $content->user_id = 1;
            $content->content_type = $contentTypeSlug;
            $fields = [];
            foreach ($contentType['fields'] as $currentField) {
                $field = [];
                $field['name'] = $currentField['name'];
                $field['slug'] = $currentField['slug'];
                $field['value']
                  = $this->app->request->post($currentField['slug']);
                array_push($fields, $field);
            }
            $content->fields = $fields;
            $content->save();
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