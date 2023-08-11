<?php



require_once __DIR__.'/../library.php';
require_once __DIR__.'/../../vendor/autoload.php';

exec ('rm ' . __DIR__ . '/../temp/cache -R'); //promaz cache

\ws\Bootstrap\ProxyContainer::$neons = [ __DIR__ . '/../config.neon'];
\ws\Bootstrap\ProxyContainer::$temp =  __DIR__ . '/../temp' ;


$container = new \ws\Bootstrap\ProxyContainer();
$sett = $container->getParameters();


dibi::connect($sett['dibi'], 'gis');
dibi::connect($sett['karat'], 'karat');


$ck = dibi::getConnection("karat");

$fiskalni_rok = date("y") % 2000;
$dt = $ck->query("SELECT prac_kateg, popis, CONVERT(varchar, ts, 126) as zmeneno  FROM dba.prac_kategorie WHERE fiskalni_rok=%s AND prac_kateg <> ''", $fiskalni_rok)->fetchAll();


$cg = dibi::getConnection("gis");

$cg->query("UPDATE [pers_prac_zarazeni] SET sync=1"); // oznac vsechny zaznamy na probihajici synchronizaci

foreach($dt as $d){

    $r = $cg->query("SELECT * FROM [pers_prac_zarazeni] WHERE kod=%s", trim($d['prac_kateg']))->fetch();
    
    $a = [
            'kod' => trim($d['prac_kateg']),
            'nazev' => trim($d['popis']),           
            'zmeneno'=> $d['zmeneno'],
            'sync'=> 0,
            'zmenil'=>-1
    ];

    if($r){

        if($d['zmeneno'] > $r['zmeneno']){ //v karatu jsou novejsi data
            $cg->query('UPDATE [pers_prac_zarazeni] SET ', $a, ' WHERE id=%i', $r['id']);
            continue;
        }           
    }
    else{
        $cg->query("INSERT INTO [pers_prac_zarazeni]", $a);
    }

}

$cg->query("UPDATE [pers_prac_zarazeni] SET sync=0");