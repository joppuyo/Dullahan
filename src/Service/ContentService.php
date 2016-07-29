<?php

namespace Dullahan\Service;

use Dullahan\Model\Content;
use JsonSchema\Validator;
use Symfony\Component\Yaml\Parser;

class ContentService extends Service
{
    public function getContentTypes()
    {
        $yaml = new Parser();
        $contentTypeDescriptors = glob('content/content-types/*.yaml');
        $contentTypes = [];

        foreach ($contentTypeDescriptors as $descriptor) {
            $contentType = $yaml->parse(file_get_contents($descriptor), false, false, true);
            array_push($contentTypes, $contentType);
        }

        return $contentTypes;
    }

    /**
     * Validate content type
     *
     * This function will validate that the content type definition of the content being accessed is valid and well
     * formed.
     *
     * @param object $definition Content type definition
     * @param string $contentTypeSlug Content type slug
     * @throws \Exception
     */
    public function validateContentType($definition, $contentTypeSlug)
    {
        $validator = new Validator();
        $validator->check($definition, json_decode(file_get_contents('assets/schema/content-type.json')));
        if (!$validator->isValid()) {
            $errorString = collect($validator->getErrors())->map(function ($error) {
                return $error['property'] . ": " . $error['message'];
            })->implode(', ');
            throw new \Exception("Content type \"$contentTypeSlug\" validation failed because of the following errors: $errorString");
        }
    }

    public function getContentTypeDefinition($contentTypeSlug)
    {
        $definition = null;
        $contentTypes = $this->getContentTypes();
        foreach ($contentTypes as $currentContentType) {
            if (isset($currentContentType->slug) && $currentContentType->slug === $contentTypeSlug) {
                $definition = $currentContentType;
            }
        }
        if (!$definition) {
            throw new \Exception("Content type \"$contentTypeSlug\" not found");
        }
        $this->validateContentType($definition, $contentTypeSlug);
        return $definition;
    }

    /**
     * Convert content fields
     *
     * This function will get the content descriptor from YAML file and the data from database and create a valid
     * object representing the data.
     *
     * @param object $contentItem Content item fetched from database
     * @param array $contentTypeDefinition Content type definition parsed from a YAML file
     * @param object $request Slim HTTP request object, needed for getting the paths right
     * @return object
     */
    public function convertFields($contentItem, $contentTypeDefinition, $request)
    {
        //Create new object with all fields set to null, to be filled with actual data
        $convertedObject = new \stdClass();
        $convertedObject->_id = $contentItem['id'];
        $convertedObject->_contentType = $contentItem['content_type'];
        $convertedObject->_title = null;
        $convertedObject->_image = null;

        // This will hold the data for the user who has created the content.
        $convertedObject->_user = null;
        collect($contentTypeDefinition->fields)->map(function ($field) use ($convertedObject) {
            $convertedObject->{$field->slug} = null;
        });

        // Convert fields into object properties

        foreach ($contentItem->fields as $key => $value) {
            $mediaPath = $request->getUri()->getBaseUrl() . '/uploads/';

            $fieldType = collect($contentTypeDefinition->fields)->where('slug', $key)->first();

            if ($fieldType) {
                // Add full URL to image field
                if ($fieldType->type === 'image' && !empty($value)) {
                    $value = $mediaPath . $value;
                }

                // Expand references
                if ($fieldType->type === 'reference' && !empty($value)) {
                    $referenceObject = Content::where('id', $value)->first();
                    if ($referenceObject) {
                        $referenceContentTypeDefinition = $this->getContentTypeDefinition($referenceObject['content_type']);
                        $value = $this->convertFields($referenceObject, $referenceContentTypeDefinition, $request);
                    } else {
                        // If we can't find the reference object, there's no use of returning the id in the response so
                        // let's just return a null.
                        $value = null;
                    }
                }

                $convertedObject->$key = $value;

            }

        }

        // Heuristic to determine the title field. Get the first field marked as text and use that as the title field.
        // TODO: allow setting this explicitly
        $titleField = collect($contentTypeDefinition->fields)->filter(function ($field) {
            return $field->type === 'text';
        })->first();

        if ($titleField) {
            $convertedObject->_title = $convertedObject->{$titleField->slug};
        }

        // Heuristic to determine the image field. Get the first field marked as image and use that as the image field.
        // TODO: allow setting this explicitly
        $titleField = collect($contentTypeDefinition->fields)->filter(function ($field) {
            return $field->type === 'image';
        })->first();

        if ($titleField) {
            $convertedObject->_image = $convertedObject->{$titleField->slug};
        }

        return $convertedObject;
    }
}
