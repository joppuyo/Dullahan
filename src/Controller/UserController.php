<?php

namespace Dullahan\Controller;

use Dullahan\Model\UserToken;
use Dullahan\Model\User;
use RandomLib\Factory;
use RandomLib\Generator;
use Slim\Http\Request;
use Slim\Http\Response;

class UserController extends Controller
{
    public function register(Request $request, Response $response, array $arguments)
    {
        $body = $request->getParsedBody();
        $user = new \Dullahan\Model\User();
        $user->email = $body['email'];
        $user->password = password_hash($body['password'], PASSWORD_DEFAULT);
        $user->save();
        return $response->withJson($user, 201);
    }

    public function login(Request $request, Response $response, array $arguments)
    {
        $body = $request->getParsedBody();
        $user = User::where('email', $body['email'])->first();
        if (!$user) {
            return $response->withJson(['message' => 'no_such_email'], 400);
        }
        if (!password_verify($body['password'], $user->password)) {
            return $response->withJson(['message' => 'incorrect_password'], 400);
        }
        $factory = new Factory();
        $generator = $factory->getMediumStrengthGenerator();
        $tokenValue = $generator->generateString(128, Generator::CHAR_ALNUM);
        
        $token = new UserToken();
        $token->value = $tokenValue;
        $user->user_tokens()->save($token);

        $output = [
            'user' => $user,
            'token' => $token->value,
        ];

        return $response->withJson($output, 200);
    }

    public function listUsers(Request $request, Response $response, $arguments)
    {
        return $response->withJson(User::all(), 200, JSON_PRETTY_PRINT);
    }

    public function getUserDetails(Request $request, Response $response, $arguments)
    {
        $user = $this->container->user;
        if ($user) {
            return $response->withJson($user, 200, JSON_PRETTY_PRINT);
        }
    }
}
