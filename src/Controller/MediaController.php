<?php
/**
 * Created by PhpStorm.
 * User: joppu
 * Date: 06/08/15
 * Time: 21:17
 */

namespace Dullahan\Controller;

use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;
use Intervention\Image\ImageManager;
use Slim\Http\Request;
use Slim\Http\Response;
use function Stringy\create as s;

class MediaController extends Controller
{
    function __construct($ci)
    {
        parent::__construct($ci);
        $this->manager = new ImageManager(['driver' => IMAGE_LIBRARY]);
        $adapter = new Local('uploads/');
        $this->filesystem = new Filesystem($adapter);
    }

    public function addContent()
    {
        $errors = [];
        if ($this->app->request->isPost()) {
            $storage = new \Upload\Storage\FileSystem('uploads');
            $file = new \Upload\File('media', $storage);
            $file->addValidations([
                new \Upload\Validation\Mimetype(['image/png', 'image/gif', 'image/jpeg'])
            ]);
            try {
                $file->upload();
                $this->app->redirectTo('mediaList');
            } catch (\Exception $e) {
                $errors = $file->getErrors();
            }
        }
        $this->app->render('mediaAdd.twig', ['errors' => $errors]);
    }

    public function listContent()
    {
        $media = $this->app->mediaService->getAllMedia();
        $this->app->render('mediaList.twig', ['media' => $media]);
    }

    public function getFile($filename)
    {
        $file = $this->filesystem->read($filename);
        $image = $this->manager->make($file);
        $size = $this->app->request->get('size');
        $aspect = $this->app->request->get('aspect');
        $lastModified = $this->filesystem->getTimestamp($filename);
        $this->app->lastModified($lastModified);
        $cacheKey = "$filename.$lastModified.$size.$aspect";
        $cached = $this->app->cache->get($cacheKey);
        if(is_null($cached)){
            if ($size !== null) {
                $size = intval($size);
                if ($size <= 0 || $size > 5000) {
                    $this->app->halt(500, 'Invalid size parameter');
                }
                if ($aspect === 'square') {
                    $image->fit($size);
                } else {
                    $image->widen($size);
                }
            }
            $imageData = $image->encode($image->mime(), IMAGE_QUALITY);
            $this->app->cache->forever($cacheKey, $imageData);
            $this->app->response()->header('Content-Type', $image->mime());
            echo $imageData;
        } else {
            $this->app->response()->header('Content-Type', $image->mime());
            echo $cached;
        }
    }

    public function listMedia(Request $request, Response $response, $arguments) {
        $media = $this->container->MediaService->getAllMedia();
        $media = collect($media)->values();
        $baseUrl = $request->getUri()->getBaseUrl();
        $media = $media->map(function($item) use ($baseUrl) {
            $item['url'] = $baseUrl . '/uploads/' . $item['path'];
            return $item;
        });
        return $response->withJson($media);
    }
    public function uploadMedia(Request $request, Response $response, $arguments)
    {
        $errors = [];

        foreach ($_FILES as $key => $file) {
            $storage = new \Upload\Storage\FileSystem('uploads');
            $file = new \Upload\File($key, $storage);
            try {
                $file->setName(s($file->getName())->slugify());
                $file->upload();
            } catch (\Exception $e) {
                array_push($errors, 'Failed to upload ' . $file->getNameWithExtension());
            }
        }
        
        return $response->withJson(['errors' => $errors], 200, JSON_PRETTY_PRINT);

    }
}
