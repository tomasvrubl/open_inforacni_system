<?php

namespace ws\Bootstrap;


use Nette\DI\Container;
use Nette\Http\Request;
use Nette\Security\User;
use ws\Exceptions\ContentException;
use ws\Exceptions\RedirectException;
use ws\Exceptions\SecurityException;

class ProxyController
{


    /**
     * @var User
     */
    protected $user;


    /**
     * @var Request
     */
    protected $request;

    protected $controller;

    protected $method;


    public function getCallable()
    {
        return array($this->controller, $this->method);
    }

    protected function getValues()
    {
        $query = [];

        if ($this->request->getHeader('Content-Type') == 'application/json')
        {
            $rawBody =  $this->request->getRawBody();
            $json = @json_decode($rawBody, true);
            if ($json)
            {
                $query += $json;
            }
        }

        $query += $this->request->getPost() + $this->request->getQuery();
        $class = get_class($this->controller);
        $methodRefl = false;
        while ($class)
        {
            $reflClass = new \ReflectionClass($class);
            if ($reflClass->hasMethod($this->method))
            {
                $methodRefl = $reflClass->getMethod($this->method);
                break;

            }
        }
        if (!$methodRefl)
        {
            throw new SecurityException('No method ' . $this->method . ' for controller ' . $this->name );
        }

        $args = [];

        foreach ($methodRefl->getParameters() as $param)
        {
            $name = $param->getName();
            if (!isset($query[$name]) && !$param->isDefaultValueAvailable())
            {
                throw new SecurityException("Method {$this->method} require param {$name} for controller " . $this->name);
            }

            if (isset($query[$name]))
            {
                $args[$name] = $query[$name];
            }
            else
            {
                $args[$name] = $param->getDefaultValue();
            }
        }
        return $args;

    }



    public function isAllowed($method)
    {
        if (method_exists($this->controller, 'checkRequirements'. ucfirst($method)))
        {
            try {
                $this->controller->{'checkRequirements' . ucfirst($method)}();
            }
            catch (\Exception $ex)
            {
                if (!$this->user->isInRole('logged'))
                {
                    throw new RedirectException('login', 401);
                }
                throw $ex;

            }
        }
        else if (method_exists($this->controller, 'checkRequirements')) {
            try
            {
                $this->controller->checkRequirements($method);
            }
            catch (\Exception $ex)
            {
                if (!$this->user->isInRole('logged'))
                {
                    throw new RedirectException('login', 401);
                }
                throw $ex;

            }
        }
        else if (!$this->user->isInRole('logged'))
        {
            throw new RedirectException('login', 401);
        }

    }



    public function __construct($controller, $method, Container $container)
    {
        $this->controller= $controller;
        $this->method = $method;

        if (!class_exists($this->controller))
        {
            throw new SecurityException('Controller ' . $this->controller . ' do not exist');
        }

        $ref = new \ReflectionClass($this->controller);
        if (stripos($ref->getDocComment(),'@controller') === false)
        {
            throw new SecurityException('Controller ' . $this->controller . ' is not controller');
        }

        if (!$ref->hasMethod($method))
        {
            throw new SecurityException($this->controller . ' have not method '. $method);
        }

        if (stripos($ref->getMethod($method)->getDocComment(), '@callable') === false)
        {
            throw new SecurityException($this->controller . '::'. $method . ' is not callbale');
        }

        $this->user = $container->getByType('Nette\Security\User');
        $this->request = $container->getByType('Nette\Http\Request');
        $this->controller = new $controller();
        $container->callInjects($this->controller);

    }

    public function __invoke()
    {

        $this->isAllowed($this->method);
        $values = $this->getValues();

        return call_user_func_array(array($this->controller,$this->method), $values);

    }
}