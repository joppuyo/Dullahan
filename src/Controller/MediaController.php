<?php

namespace Dullahan\Controller;

use Illuminate\Cache\Repository;
use Intervention\Image\Image;
use League\Flysystem\FileNotFoundException;
use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;
use Intervention\Image\ImageManager;
use League\Flysystem\Plugin\GetWithMetadata;
use Slim\Http\Request;
use Slim\Http\Response;
use function Stringy\create as s;

/**
 * Class MediaController
 * @package Dullahan\Controller
 * @property Filesystem $filesystem
 * @property ImageManager $manager
 * @property Repository $cache
 */
class MediaController extends Controller
{
    public function __construct($containerInterface)
    {
        parent::__construct($containerInterface);
        $this->manager = new ImageManager(['driver' => IMAGE_LIBRARY]);
        $adapter = new Local('uploads/');
        $this->filesystem = new Filesystem($adapter);
        $this->filesystem->addPlugin(new GetWithMetadata());
        $this->cache = $containerInterface->cache;
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
        if (is_null($cached)) {
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

    public function listMedia(Request $request, Response $response, $arguments)
    {
        $media = $this->container->MediaService->getAllMedia();
        $media = collect($media)->values();
        $baseUrl = $request->getUri()->getBaseUrl();
        $media = $media->map(function ($item) use ($baseUrl) {
            $item['is_image'] = false;
            if ($this->isImage($item)) {
                $imagick = $this->manager->make($item['full_name_with_path']);
                $item['height'] = $imagick->height();
                $item['width'] = $imagick->width();
                $item['is_image'] = true;
            }
            $item['url'] = $baseUrl . '/uploads/' . $item['full_name'];
            if ($this->isPdf($item)) {
                $item['thumbnail'] = $baseUrl . '/api/media/thumbnail/' . $item['full_name'];
            } elseif ($this->isImage($item)) {
                $item['thumbnail'] = $item['url'];
            } else {
                $item['thumbnail'] = null;
            }
            $item['downloadUrl'] = $baseUrl . '/api/media/download/' . $item['full_name'];
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

    public function isImage($file)
    {
        $mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return in_array($file['mime'], $mimeTypes);
    }

    public function isPdf($file)
    {
        return $file['mime'] === 'application/pdf';
    }

    public function getMediaThumbnail(Request $request, Response $response, $arguments)
    {
        try {
            $imagick = new \Imagick();
            $imagick->setResolution(144, 144);
            $imagick->setBackgroundColor('#ffffff');
            $imagick->readImage('uploads/' . $arguments['filename'] . '[0]');
            $imagick->scaleImage(640, 0);
            $imagick->cropImage(640, 480, 0, 0);
            $imagick->setImagePage(0, 0, 0, 0);
            $imagick = $imagick->flattenImages();
            $imagick->setImageFormat('jpeg');
            $imageData = $imagick->getImageBlob();
            return $response->withHeader('Content-Type', 'image/jpeg')->write($imageData);
        } catch (\Exception $e) {
            return $response->withStatus(404);
        }

    }

    public function deleteMediaItem(Request $request, Response $response, $arguments)
    {
        $filename = $arguments['filename'];
        $this->filesystem->delete($filename);
    }

    public function downloadMedia(Request $request, Response $response, $arguments)
    {
        $filename = $arguments['filename'];
        try {
            $file = $this->filesystem->read($filename);
            $mime = $this->filesystem->getWithMetadata($filename, ['mimetype'])['mimetype'];
            return $response
                ->withHeader('Content-Disposition', "attachment; filename=$filename")
                ->withHeader('Content-Type', $mime)
                ->write($file);
        } catch (FileNotFoundException $e) {
            return $response->withStatus(404);
        }
    }
}
