<?php

namespace Dullahan\Service;
use Illuminate\Database\Capsule\Manager as Capsule;

class HelperService extends Service
{
    public function isFirstRun()
    {
        $users = Capsule::table('users')->count();
        if ($users === 0){
            return true;
        } else {
            return false;
        }
    }
}