<?php 


if(count($argv) != 3){;
    echo "\r\n\e[92mNapoveda:\e[39m \r\n php gen.php [tabulka db] [nazev tridy]\r\n\r\n";
    exit();
}

require_once __DIR__ . '/../vendor/autoload.php';

\ws\Bootstrap\ProxyContainer::$neons = [ __DIR__ . '/../ws/config.neon'];
\ws\Bootstrap\ProxyContainer::$temp =  __DIR__ . '/temp' ;

$container = new \ws\Bootstrap\ProxyContainer();
$parameters = $container->getParameters();
\dibi::connect($parameters['dibi']);

$DIR = __DIR__."/out/";


function clean_number($val){
    $defval = str_replace("'",  "", $val);

    $ar = explode("::", $defval);
    return $ar[0];
}

$dt = dibi::query("select * from information_schema.columns where table_name=%s", $argv[1])->fetchAll();

$text = "export class {$argv[2]} { \r\n";

foreach($dt as $d) {

    $text .= " public {$d['column_name']}: ";
    if(strcmp($d['column_name'], "id") == 0){
        $text .= "number = -1; \r\n";
    }
    else if(strcmp($d['data_type'], 'integer') == 0 || strcmp($d['data_type'], 'smallint') == 0){
        $defval = clean_number($d['column_default']);
        $text .= "number = {$defval}; \r\n";
    }
    else if(strcmp($d['data_type'], 'numeric') == 0){
        $defval = clean_number($d['column_default']);
        $text .= "number = {$defval}; \r\n";
    }
    else if(str_starts_with($d['data_type'], 'timestamp') || str_starts_with($d['data_type'], 'date')){
        $text .= "Date = new Date(); \r\n";
    }
    else if(strcmp($d['data_type'], 'boolean') == 0){
        $text .= "boolean = {$d['column_default']}; \r\n";
    }
    else{
        $text .= "string = ''; \r\n";
    }   
}

$text .= "}\r\n";

$filename = $DIR.$argv[2].".ts";

if(file_exists($filename)){
    unlink($filename);
}

file_put_contents($filename, $text);

echo $text;
