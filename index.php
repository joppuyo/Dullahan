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

function checkLogin(){
    return function () {
        $app = \Slim\Slim::getInstance();
        $user = Sentinel::check();
        if (!$user) {
            $app->flash('error', 'Please log in first.');
            $app->redirectTo('login');
        }
    };
}

$app->map('/admin/login/', '\Dullahan\Controller\UserController:login')->via('GET', 'POST')->name('login');

$app->map('/admin/register/', '\Dullahan\Controller\UserController:register')->via('GET', 'POST');

$app->group('/admin', checkLogin(), function () use ($app) {
    $app->get('/content', '\Dullahan\Controller\ContentController:listContent')->name('listContent')->name('contentList');
    $app->map('/content/write/:contentType/', '\Dullahan\Controller\ContentController:write')->via('GET', 'POST')->name('writeContent');
    $app->map('/content/edit/:contentId/', '\Dullahan\Controller\ContentController:edit')->via('GET', 'POST')->name('contentEdit');
    $app->get('/media', '\Dullahan\Controller\MediaController:listContent')->name('mediaList.twig');
});
$app->get('/api/content/:contentType/', '\Dullahan\Controller\ContentController:listContentJson');
$app->get('/media/:fileName(/:size)', '\Dullahan\Controller\MediaController:getFile');

$app->run();