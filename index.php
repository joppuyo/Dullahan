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
    'cache/illuminate'
);
$container['cache'] = new \Illuminate\Cache\Repository($filestore);
$container['MediaService'] = new \Dullahan\Service\MediaService();
$container['ContentService'] = new \Dullahan\Service\ContentService();
$container['user'] = null;

$app->add(new RKA\Middleware\IpAddress());

/**
 * This middleware validates access token sent by client.
 *
 * Token must be a valid user token or app token. If the user token is valid, the middleware will set user object in
 * the container so that it's available in other parts of the application.
 */
$authMiddleware = function () {
    return function (\Slim\Http\Request $request, \Slim\Http\Response $response, $next) {

        $token = null;
        $tokenObject = null;

        if ($request->hasHeader('X-User-Token')) {
            $token = $request->getHeader('X-User-Token');
            $tokenObject = \Dullahan\Model\UserToken::where('value', $token)->first();
        }

        if ($request->hasHeader('X-App-Token')) {
            $token = $request->getHeader('X-App-Token');
            $tokenObject = \Dullahan\Model\App::where('token', $token)->first();
        }

        // Allow access token as URL parameter in case custom headers are not supported by the client platform

        if ($request->getParam('app_token')) {
            $token = $request->getParam('app_token');
            $tokenObject = \Dullahan\Model\App::where('token', $token)->first();
        }

        if (!$token) {
            $error = [
                'message' => 'Access token missing',
                'errorCode' => 'ACCESS_TOKEN_MISSING'
            ];
            return $response->withJson($error, 401, JSON_PRETTY_PRINT);
        }

        if (!$tokenObject) {
            $error = [
                'message' => 'Access token invalid',
                'errorCode' => 'ACCESS_TOKEN_INVALID'
            ];
            return $response->withJson($error, 401, JSON_PRETTY_PRINT);
        }

        // If we are using user token, make the user object globally available to the application in the container

        if ($request->hasHeader('X-User-Token')) {
            $container = $this;
            $container->user = $tokenObject->user;
        }

        $response = $next($request, $response);
        return $response;
    };
};

$throttleMiddleware = function ($throttleName) {
    return function (\Slim\Http\Request $request, \Slim\Http\Response $response, $next) use ($throttleName) {
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

// Throw Slim exception also in case of PHP notice or warning
set_error_handler(function ($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return;
    }
    throw new \ErrorException($message, 0, $severity, $file, $line);
});

$app->group('/api', function () use ($throttleMiddleware, $authMiddleware) {
    $this->post('/register', '\Dullahan\Controller\UserController:register');
    $this->post('/login', '\Dullahan\Controller\UserController:login')->add($throttleMiddleware('login'));
    $this->get('/login', '\Dullahan\Controller\UserController:getUserDetails')->add($authMiddleware());
    $this->get('/media', '\Dullahan\Controller\MediaController:listMedia')->add($authMiddleware());
    $this->delete('/media/{filename}', '\Dullahan\Controller\MediaController:deleteMediaItem')->add($authMiddleware());
    $this->get('/media/thumbnail/{filename}', '\Dullahan\Controller\MediaController:getMediaThumbnail');
    $this->get('/media/download/{filename}', '\Dullahan\Controller\MediaController:downloadMedia');
    $this->post('/media', '\Dullahan\Controller\MediaController:uploadMedia')->add($authMiddleware());
    $this->get('/content', '\Dullahan\Controller\ContentController:listContentTypes')->add($authMiddleware());
    $this->get('/content/{contentTypeSlug}', '\Dullahan\Controller\ContentController:listContent')->add($authMiddleware());
    $this->post('/content/{contentTypeSlug}', '\Dullahan\Controller\ContentController:createContent')->add($authMiddleware());
    $this->get('/content/all/{contentId}', '\Dullahan\Controller\ContentController:getSingleContent')->add($authMiddleware());
    $this->put('/content/all/{contentId}', '\Dullahan\Controller\ContentController:updateContent')->add($authMiddleware());
    $this->get('/content-types/{contentTypeSlug}', '\Dullahan\Controller\ContentController:getContentType')->add($authMiddleware());
    $this->get('/users', '\Dullahan\Controller\UserController:listUsers')->add($authMiddleware());
    $this->get('/apps', '\Dullahan\Controller\AppController:listApps')->add($authMiddleware());
});

$app->run();
