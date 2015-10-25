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

class MediaController extends Controller
{
    function __construct()
    {
        parent::__construct();
        $this->manager = new ImageManager(['driver' => 'imagick']);
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
            $imageData = $image->encode($image->mime(), 90);
            $this->app->cache->forever($cacheKey, $imageData);
            $this->app->response()->header('Content-Type', $image->mime());
            echo $imageData;
        } else {
            $this->app->response()->header('Content-Type', $image->mime());
            echo $cached;
        }
    }
}
