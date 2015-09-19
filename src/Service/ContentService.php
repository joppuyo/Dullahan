<?php

namespace Dullahan\Service;

use Symfony\Component\Yaml\Parser;

class ContentService extends Service
{
    public function enumerateContentTypes()
    {
        $yaml = new Parser();
        $contentTypeDescriptors = glob('content-types/*.yaml');
        $contentTypes = [];

        foreach($contentTypeDescriptors as $descriptor) {
            $contentType = $yaml->parse(file_get_contents($descriptor));
            array_push($contentTypes, $contentType);
        }

        return $contentTypes;
    }

    public function getContentTypeField($contentTypeSlug, $fieldName) {
        $contentTypes = $this->enumerateContentTypes();
        foreach ($contentTypes as $currentContentType) {
            if ($currentContentType['slug'] === $contentTypeSlug) {
                foreach ($currentContentType['fields'] as $field) {
                    if ($field['slug'] === $fieldName) {
                        return $field;
                    }
                }
            }
        }
    }

    public function convertFields($content){
        // Convert fields into object properties
        $content->map(function($item) {
            foreach ($item->fields as $field) {
                $name = $field['slug'];
                $value = $field['value'];

                $mediaPath = $this->app->request->getUrl() . $this->app->request->getRootUri() . '/media';

                // Replace %MEDIAPATH% placeholder in all fields
                $value = str_replace('%MEDIAPATH%', $mediaPath, $value);

                // Add full URL to image field
                $fieldType = $this->app->contentService->getContentTypeField($item['content_type'], $field['slug']);
                if ($fieldType['type'] === 'image' && !empty($field['value'])) {
                    $value = $mediaPath . '/' . $field['value'];
                }
                if (!empty($value)) {
                    $item->$name = $value;
                }
            }
            unset($item->fields);
        });
        return $content;
    }
}