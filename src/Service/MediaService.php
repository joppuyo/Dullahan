<?php

namespace Dullahan\Service;

use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;

class MediaService extends Service
{
    function __construct(){
        $adapter = new Local('uploads/');
        $this->filesystem = new Filesystem($adapter);
    }
    public function getAllMedia()
    {
        $media = $this->filesystem->listContents();
        $media = array_filter($media, function($file){
            $fileTypes = ['jpg', 'jpeg', 'png', 'gif'];
            return in_array($file['extension'], $fileTypes);
        });
        return $media;
    }
    public function getPathForMedia($fileName)
    {
        return $this->app->request()->getHost();
    }
}