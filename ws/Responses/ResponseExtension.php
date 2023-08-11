<?php

namespace  ws\Responses;


use Nette\Configurator;
use Nette\DI\Compiler;
use Nette\DI\CompilerExtension;
use Nette\DI\Config\Helpers;
use Nette\DI\ContainerBuilder;
use Nette\Utils\Finder;
use Nette;



class ResponseExtension extends CompilerExtension
{

    public function loadConfiguration()
    {
        $builder = $this->getContainerBuilder();
        $config = $this->getConfig();
        $names = [];


        foreach ($config as $name => $class)
        {
            $names[$name] = $class;
        }
        $builder->addDefinition(trim($this->prefix(''), '.'))->setClass(Responses::class, array($names))->addTag('inject');

        return;

    }

}

