<?php

require_once __DIR__ . '/library.php';

$container = require_once __DIR__ . '/bootstrap.php';
$controllers = $container->getControllers();
$controllers->run();
