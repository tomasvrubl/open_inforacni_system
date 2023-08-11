<?php

namespace ws\Bootstrap;
use Nette\Http\Request;
use Nette\Http\Response;
use Nette\Security\User;
use Nette\SmartObject;


/**
 * Class Proxy
 * @package ws\Bootstrap
 * @property Request request
 * @property Response response
 * @property User user
 * @property Controllers controllers
 */
class ProxyContainer
{

    use SmartObject;

    /**
     * @var \Nette\DI\Container
     */
    protected static $container;

    static $temp = false;

    static $neons = [];


    public function __construct()
    {
        if (!self::$container)
        {
            $configurator = new \ws\Bootstrap\Configurator();
            $configurator->setTempDirectory(self::$temp);

            foreach (self::$neons as $neon)
            {
                $configurator->addConfig($neon);
            }

            $container = $configurator->createContainer();
            self::$container = $container;
        }

    }

    /**
     * @return Request
     */
    public function getRequest()
    {
        return self::$container->getService('http.request');
    }

    /**
     * @return Response
     */
    public function getResponse()
    {
        return self::$container->getService('http.response');
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return self::$container->get('user');
    }

    /**
     * @return Controllers
     */
    public function getControllers()
    {
        return self::$container->getService('controllers');
    }

    /**
     * @return \Nette\DI\Container
     */
    public function getContainer()
    {
        return self::$container;
    }

    public function __call($name, $args)
    {
        return call_user_func_array(array(self::$container, $name), $args);
    }
}