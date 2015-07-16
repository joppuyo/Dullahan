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

$app->map('/admin/write/:contentType/', '\Dullahan\Controller\ContentController:write')->via('GET','POST');
$app->get('/api/content/:contentType/', '\Dullahan\Controller\ContentController:listContentJson');

$app->run();