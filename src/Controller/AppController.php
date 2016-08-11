<?php

namespace Dullahan\Controller;

use Dullahan\Model\App;
use Slim\Http\Request;
use Slim\Http\Response;

class AppController extends Controller
{
    public function listApps(Request $request, Response $response, $arguments)
    {
        $apps = App::all();
        return $response->withJson($apps, 200, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
