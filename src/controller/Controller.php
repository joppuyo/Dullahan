<?php
namespace Dullahan\Controller;
class Controller
{
	/**
	 * @property $app \Slim\Slim
	 */
	public $app;
	function __construct()
	{
		$this->app = \Slim\Slim::getInstance();
	}
}