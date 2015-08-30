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
                    if ($field['name'] = $fieldName) {
                        return $field;
                    }
                }
            }
        }
    }
}