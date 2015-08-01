<?php
namespace Dullahan\Service;

class Service
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