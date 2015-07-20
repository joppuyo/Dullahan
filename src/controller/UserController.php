<?php

namespace Dullahan\Controller;

use Cartalyst\Sentinel\Native\Facades\Sentinel;

class UserController extends Controller
{
	public function login()
	{
		$this->app->render('login.twig');
		if ($this->app->request->isPost()) {
			$credentials = [
			  'email'    => $this->app->request->post('email'),
			  'password' => $this->app->request->post('password')
			];

			Sentinel::authenticateAndRemember($credentials);
		}
	}
	public function register()
	{
		if ($this->app->request->isPost()) {

			$credentials = [
			  'email'    => $this->app->request->post('email'),
			  'password' => $this->app->request->post('password'),
			];

			Sentinel::registerAndActivate($credentials);

		}

		$this->app->render('register.twig');
	}
}