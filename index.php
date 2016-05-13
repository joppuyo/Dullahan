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
$container['MediaService'] = new \Dullahan\Service\MediaService();

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

$app->add(new RKA\Middleware\IpAddress());

$app->get('/', function(\Slim\Http\Request $request, \Slim\Http\Response $response, $arguments){
   echo 'works';
});

$throttleMiddleware = function($throttleName) {
    return function(\Slim\Http\Request $request, \Slim\Http\Response $response, $next) use ($throttleName){
        $cache = new Doctrine\Common\Cache\FilesystemCache('cache/doctrine');
        $storage = new \BehEh\Flaps\Storage\DoctrineCacheAdapter($cache);
        $flaps = new \BehEh\Flaps\Flaps($storage);
        $flap = $flaps->__get($throttleName);
        $flap->pushThrottlingStrategy(new \BehEh\Flaps\Throttling\LeakyBucketStrategy(5, '20s'));
        $flap->setViolationHandler(new \BehEh\Flaps\Violation\PassiveViolationHandler());
        if (!$flap->limit($request->getAttribute('ip_address'))) {
            return $response->withJson(['message' => 'Too many requests'], 429);
        }
        $response = $next($request, $response);
        return $response;
    };
};

$app->group('/api', function() use ($throttleMiddleware){
    $this->post('/register', '\Dullahan\Controller\UserController:register');
    $this->post('/login', '\Dullahan\Controller\UserController:login')->add($throttleMiddleware('login'));
    $this->get('/media', '\Dullahan\Controller\MediaController:listMedia');
    $this->post('/media', '\Dullahan\Controller\MediaController:uploadMedia');
});

$app->get('/test', '\Dullahan\Controller\ContentController:listContent');

$app->run();