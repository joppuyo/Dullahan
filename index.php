<?php
session_cache_limiter(false);
session_start();

require "vendor/autoload.php";
require "config.php";

date_default_timezone_set(TIMEZONE);

use Illuminate\Database\Capsule\Manager as Capsule;

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

$app = new Slim\App;

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$container = new \Slim\Container($configuration);
$app = new \Slim\App($container);

$filestore = new \Illuminate\Cache\FileStore(
  new \Illuminate\Filesystem\Filesystem(),
  'cache'
);
$app->cache = new \Illuminate\Cache\Repository($filestore);

/*function checkLogin(){
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
}*/

$app->get('/', function(\Slim\Http\Request $request, \Slim\Http\Response $response, $arguments){
   echo 'works';
});

$app->group('/api', function(){
    $this->post('/register', '\Dullahan\Controller\UserController:register');
    $this->post('/login', '\Dullahan\Controller\UserController:login');
});

$app->get('/test', '\Dullahan\Controller\ContentController:listContent');

$app->run();