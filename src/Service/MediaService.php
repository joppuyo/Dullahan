<?php

namespace Dullahan\Service;

use Illuminate\Support\Collection;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\Plugin\ListWith;
use Stringy\Stringy;

class MediaService extends Service
{
    function __construct(){
        $adapter = new Local('.');
        $this->filesystem = new Filesystem($adapter);
        $this->filesystem->addPlugin(new ListWith());
    }
    public function getAllMedia()
    {
        $media = collect($this->filesystem->listWith(['mimetype'], 'uploads'));

        $data = new Collection();
        $media->map(function ($file) use ($data) {
            $new = [
              'filename' => $file['filename'],
              'extension' => $file['extension'],
              'mime' => $file['mimetype'],
              'full_name' => $file['filename'] . '.' . $file['extension'],
              'full_name_with_path' => $file['path'],
              'timestamp' => $file['timestamp'],
            ];

            // Don't include hidden files
            if (!Stringy::create($new['full_name'])->startsWith('.')) {
                $data->push($new);
            }
        });

        return $data;
    }
}
