<?php
namespace ws\Bootstrap;

use Nette;
use Tracy;

use ws\Responses\ResponseExtension;

class Configurator extends \Nette\Configurator
{
    /** @var array */
    public $defaultExtensions = [
        'php' => Nette\DI\Extensions\PhpExtension::class,
        'constants' => Nette\DI\Extensions\ConstantsExtension::class,
        'extensions' => Nette\DI\Extensions\ExtensionsExtension::class,
        'decorator' => Nette\DI\Extensions\DecoratorExtension::class,
        'di' => [Nette\DI\Extensions\DIExtension::class, ['%debugMode%']],
        'http' => [Nette\Bridges\HttpDI\HttpExtension::class, ['%consoleMode%']],
        'tracy' => [Tracy\Bridges\Nette\TracyExtension::class, ['%debugMode%', '%consoleMode%']],
        'security' => [Nette\Bridges\SecurityDI\SecurityExtension::class, ['%debugMode%']],
        'session' => [Nette\Bridges\HttpDI\SessionExtension::class, ['%debugMode%', '%consoleMode%']],
        'controllers'=> ControllerExtension::class,
        'responses'=> ResponseExtension::class,
        'inject' => Nette\DI\Extensions\InjectExtension::class
    ];
}
