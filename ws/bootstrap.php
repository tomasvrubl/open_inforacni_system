<?php

#exec ('rm ' . __DIR__ . '/temp/cache -R'); //promaz cache

define('STORAGE', realpath(__DIR__.'/../storage/')); //umisteni priloh
define('STORAGE_URL', 'storage/');  //je doplneno getURL() + STORAGE_URL


define('STORAGE_REPORT', realpath(__DIR__.'/../storage_report/')); //umisteni priloh
define('STORAGE_REPORT_URL', 'storage_report/');  //je doplneno getURL() + STORAGE_REPORT_URL


require_once __DIR__ . '/../vendor/autoload.php';


\Tracy\Debugger::$strictMode = E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_NOTICE;
\Tracy\Debugger::enable(\Tracy\Debugger::DEVELOPMENT, __DIR__ . '/log');

\ws\Bootstrap\ProxyContainer::$neons = [ __DIR__ . '/config.neon'];
\ws\Bootstrap\ProxyContainer::$temp =  __DIR__ . '/temp' ;

$container = new \ws\Bootstrap\ProxyContainer();

$parameters = $container->getParameters();

\dibi::connect($parameters['dibi']);

return $container;