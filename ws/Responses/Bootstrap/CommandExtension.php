<?php

namespace ws\Bootstrap;

use Nette\DI\CompilerExtension;

class CommandExtension extends CompilerExtension
{

    protected $defaults = [
        'commands' => []
    ];


    public function loadConfiguration()
    {

        $builder = $this->getContainerBuilder();

        $config = $this->getConfig();

        $names = [];

        foreach ($config as $key => $classes)
        {



            $builder->addDefinition($this->prefix(''). ($key) )->setClass($classes)->addTag('inject')->addTag('command');
        }
        return;

    }

}

