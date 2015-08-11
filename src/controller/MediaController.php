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
    function __construct(){
        parent::__construct();
        $this->manager = new ImageManager(['driver' => 'imagick']);
        $adapter = new Local('uploads/');
        $this->filesystem = new Filesystem($adapter);
    }

    public function listContent(){
        $media = $this->filesystem->listContents();
        $media = array_filter($media, function($file){
            $fileTypes = ['jpg', 'jpeg', 'png', 'gif'];
            return in_array($file['extension'], $fileTypes);
        });

        $this->app->render('mediaList.twig', ['media' => $media]);
    }

    public function getFile($filename, $size = 'default'){
        $file = $this->filesystem->read($filename);
        $image = $this->manager->make($file);
        if ($size !== 'default') {
            $image->widen($size);
        }
        $this->app->response()->header('Content-Type', $image->mime());
        echo $image->encode($image->mime(), 90);
    }
}