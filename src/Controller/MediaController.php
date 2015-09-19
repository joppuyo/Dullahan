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
        if ($size !== null) {
            $size = intval($size);
            if ($size <= 0 || $size > 5000) {
                $this->app->halt(500, 'Invalid size parameter');
            }

            $aspect = $this->app->request->get('aspect');
            if ($aspect === 'square') {
                $image->fit($size);
            } else {
                $image->widen($size);
            }
        }

        $this->app->response()->header('Content-Type', $image->mime());
        echo $image->encode($image->mime(), 90);
    }
}
