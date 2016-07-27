<?php

namespace Dullahan\Service;

use Dullahan\Model\Content;
use Symfony\Component\Yaml\Parser;

class ContentService extends Service
{
    public function enumerateContentTypes()
    {
        $yaml = new Parser();
        $contentTypeDescriptors = glob('content/content-types/*.yaml');
        $contentTypes = [];

        foreach ($contentTypeDescriptors as $descriptor) {
            $contentType = $yaml->parse(file_get_contents($descriptor));
            array_push($contentTypes, $contentType);
        }

        return $contentTypes;
    }

    public function validateContentTypes()
    {

    }

    public function getContentTypeDefinition($contentTypeSlug)
    {
        $definition = null;
        $contentTypes = $this->enumerateContentTypes();
        foreach ($contentTypes as $currentContentType) {
            if ($currentContentType['slug'] === $contentTypeSlug) {
                $definition = $currentContentType;
            }
        }
        if (!$definition) {
            throw new \Exception('Content type not found');
        }
        return $definition;
    }

    /**
     * Convert content fields
     *
     * This function will get the content descriptor from YAML file and the data from database and create a valid
     * object representing the data.
     *
     * @param object $contentItem Content item fetched from database
     * @param array $contentTypeDefinition Content item fetched from database
     * @param object $request Slim HTTP request object, needed for getting the paths right
     * @return object
     */
    public function convertFields($contentItem, $contentTypeDefinition, $request)
    {
        //Create new object with all fields set to null, to be filled with actual data
        $convertedObject = new \stdClass();
        $convertedObject->_id = $contentItem['id'];
        $convertedObject->_contentType = $contentItem['content_type'];

        // This will hold the data for the user who has created the content.
        $convertedObject->_user = null;
        collect($contentTypeDefinition['fields'])->map(function ($field) use ($convertedObject) {
            $fieldSlug = $field['slug'];
            $convertedObject->$fieldSlug = null;
        });

        // Convert fields into object properties

        foreach ($contentItem->fields as $field) {
            $name = $field['slug'];
            $value = $field['value'];

            $mediaPath = $request->getUri()->getBaseUrl() . '/uploads/';

            $fieldType = collect($contentTypeDefinition['fields'])->where('slug', $field['slug'])->first();

            // Add full URL to image field
            if ($fieldType['type'] === 'image' && !empty($field['value'])) {
                $value = $mediaPath . $field['value'];
            }

            // Expand references
            if ($fieldType['type'] === 'reference' && !empty($field['value'])) {
                $referenceObject = Content::where('id', $field['value'])->first();
                if ($referenceObject) {
                    $referenceContentTypeDefinition = $this->getContentTypeDefinition($referenceObject['content_type']);
                    $value = $this->convertFields($referenceObject, $referenceContentTypeDefinition, $request);
                } else {
                    // If we can't find the reference object, there's no use of returning the id in the response so
                    // let's just return a null.
                    $value = null;
                }
            }

            $convertedObject->$name = $value;
        }

        return $convertedObject;
    }
}
