<?php

namespace Dullahan\Controller;

use Cartalyst\Sentinel\Native\Facades\Sentinel;

class UserController extends Controller
{
    public function login()
    {
        if (Sentinel::getUser()) {
            $this->app->redirectTo('contentList');
        }
        $post = $this->app->request()->post();
        if ($this->app->request->isPost()) {
            try {
                $credentials = [
                  'email' => $this->app->request->post('email'),
                  'password' => $this->app->request->post('password')
                ];
                $status = Sentinel::authenticateAndRemember($credentials);
                if (!$status) {
                    $this->app->flashNow('error', 'Check email and password');
                } else {
                    $this->app->redirectTo('contentList');
                }
            } catch (\Exception $e) {
                $this->app->flashNow('error', $e->getMessage());
            }
        }
        $this->app->render('login.twig', ['post' => $post]);
    }

    public function register()
    {
        if ($this->app->request->isPost()) {

            $credentials = [
              'email' => $this->app->request->post('email'),
              'password' => $this->app->request->post('password'),
            ];

            Sentinel::registerAndActivate($credentials);

        }

        $this->app->render('register.twig');
    }
}