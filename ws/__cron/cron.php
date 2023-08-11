<?php


/***
 * Nacte konfiguracni soubory a vraci je k dispozici ostatnim skriptum. 
 * 
 * Jednotlive php skripty se musi pridavat do crontabulku
 * 
 *  sudo -u www-data crontab -l 
 */

require_once __DIR__.'/../library.php';
require_once __DIR__.'/../../vendor/autoload.php';

\ws\Bootstrap\ProxyContainer::$neons = [ __DIR__ . '/../config.neon'];
\ws\Bootstrap\ProxyContainer::$temp =  __DIR__ . '/../temp' ;

$container = new \ws\Bootstrap\ProxyContainer();
return  $container->getParameters();


