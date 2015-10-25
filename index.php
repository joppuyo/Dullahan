<?php
session_cache_limiter(false);
session_start();

require "vendor/autoload.php";
require "config.php";

use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Illuminate\Database\Capsule\Manager as Capsule;

$config = new Cartalyst\Sentinel\Native\ConfigRepository('sentinelconfig.php');

$bootstrapper = new Cartalyst\Sentinel\Native\SentinelBootstrapper($config);

Sentinel::instance($bootstrapper);

$capsule = new Capsule;

$capsule->addConnection([
  'driver' => 'mysql',
  'host' => DB_HOST,
  'port' => DB_PORT,
  'database' => DB_NAME,
  'username' => DB_USER,
  'password' => DB_PASSWORD,
  'charset' => 'utf8',
  'collation' => 'utf8_unicode_ci',
]);

$capsule->bootEloquent();

$capsule->setAsGlobal();

$app = new Slim\Slim;

$app->view(new \Slim\Views\Twig());

$app->view()->parserExtensions = [
  new \Slim\Views\TwigExtension(),
];

$app->contentService = function(){
    return new \Dullahan\Service\ContentService();
};

$app->mediaService = function(){
    return new \Dullahan\Service\MediaService();
};

$app->helperService = function(){
    return new \Dullahan\Service\HelperService();
};

$filestore = new \Illuminate\Cache\FileStore(
  new \Illuminate\Filesystem\Filesystem(),
  'cache'
);
$app->cache = new \Illuminate\Cache\Repository($filestore);

function checkLogin(){
    return function () {
        $app = \Slim\Slim::getInstance();
        if ($app->helperService->isFirstRun()) {
            $app->redirectTo('firstRun');
        }
        $user = Sentinel::check();
        if (!$user) {
            $app->flash('error', 'Please log in first.');
            $app->redirectTo('login');
        }
    };
}

$app->map('/admin/login/', '\Dullahan\Controller\UserController:login')->via('GET', 'POST')->name('login');

$app->map('/admin/register/', '\Dullahan\Controller\UserController:register')->via('GET', 'POST');

$app->map('/admin/firstrun/', '\Dullahan\Controller\AdminController:firstRun')->via('GET', 'POST')->name('firstRun');

$app->group('/admin', checkLogin(), function () use ($app) {
    $app->get('/', '\Dullahan\Controller\AdminController:adminRoot')->name('admin');
    $app->get('/content', '\Dullahan\Controller\ContentController:listContent')->name('contentList');
    $app->map('/content/add/', '\Dullahan\Controller\ContentController:addContentSelect')->via('GET', 'POST')->name('contentAddSelect');
    $app->map('/content/add/:contentType/', '\Dullahan\Controller\ContentController:addContent')->via('GET', 'POST')->name('contentAdd');
    $app->map('/content/edit/:contentId/', '\Dullahan\Controller\ContentController:editContent')->via('GET', 'POST')->name('contentEdit');
    $app->get('/media', '\Dullahan\Controller\MediaController:listContent')->name('mediaList');
    $app->map('/media/add/', '\Dullahan\Controller\MediaController:addContent')->via('GET', 'POST')->name('mediaAdd');
});
$app->get('/api/content/:contentType/', '\Dullahan\Controller\ContentController:listContentJson');
$app->get('/api/content/:contentType/:slug/', '\Dullahan\Controller\ContentController:getContentJson');
$app->get('/media/:fileName', '\Dullahan\Controller\MediaController:getFile');

$app->run();