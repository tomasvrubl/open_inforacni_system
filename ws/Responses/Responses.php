<?php

namespace ws\Responses;


use Nette\DI\Container;

class Responses
{

    /**
     * @var [string]
     */
    protected $names;

    public function __construct($names)
    {
        $this->names = $names;
    }

    /**
     * @var Container
     */
    protected $container;


    public function injectContainer(Container $container)
    {
        $this->container = $container;
    }

    public function create($className)
    {
        if (isset($this->names[$className]))
        {
            $className = $this->names[$className];
        }
        $argv = func_get_args();
        array_shift($argv);
        $object = $this->container->createInstance($className, $argv);
        $this->container->callInjects($object);
        return $object;
    }

}