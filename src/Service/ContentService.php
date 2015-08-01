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
}