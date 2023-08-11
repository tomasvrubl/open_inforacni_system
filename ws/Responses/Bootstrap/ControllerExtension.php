<?php

namespace  ws\Bootstrap;



use Nette\DI\Compiler;
use Nette\DI\CompilerExtension;
use Nette\DI\Config\Helpers;
use Nette\DI\ContainerBuilder;
use Nette\Utils\Finder;
use Nette;



class ControllerExtension extends CompilerExtension
{

    protected $defaults = [
        'controllers' => [],
        'proxyController' => ProxyController::class
    ];


    public function loadConfiguration()
    {

        $builder = $this->getContainerBuilder();

        $config = $this->getConfig();

        $names = [];


        foreach ($config as $controller => $conf)
        {
            $class = $conf['class'];
            $name = $this->prefix($controller);
            $builder->addDefinition($this->prefix($controller))->setClass($class)->setAutowired(true)->addTag('inject');
            if (isset($conf['methods'])) {
                $methods = $conf['methods'];
                foreach ($methods as $method)
                {
                    $names[] = $this->prefix($controller . '.' . $method);
                    $builder->addDefinition($this->prefix($controller . '.' . $method))
                            ->setClass(ProxyController::class, array($controller . '.' . $method, '@controllers.' .$controller, $method) )
                            ->addTag('inject');
                }
            }
        }





        $builder->addDefinition(trim($this->prefix(''), '.'))->setClass(Controllers::class, array( $names) )->addTag('inject');
        return;

    }

}

