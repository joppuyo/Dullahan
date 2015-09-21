<?php

namespace Dullahan\Controller;

use Cartalyst\Sentinel\Native\Facades\Sentinel;

class AdminController extends Controller
{
    public function adminRoot()
    {
        $this->app->redirectTo('contentList');
    }
    public function firstRun()
    {
        if (!$this->app->helperService->isFirstRun()) {
            $this->app->notFound();
        }

        if ($this->app->request->isPost()) {
            $credentials = [
              'email' => $this->app->request->post('email'),
              'password' => $this->app->request->post('password'),
            ];

            $user = Sentinel::registerAndActivate($credentials);
            Sentinel::loginAndRemember($user);
            $this->app->redirectTo('contentList');
        }

        $this->app->render('register.twig');
    }
}