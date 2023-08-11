<?php

/****************************************************
 * 
 * Stara se o synchronizaci stredisek mezi KARATem a GIS 
 * */

$sett = require_once __DIR__ .'/cron.php';


dibi::connect($sett['dibi'], 'gis');
dibi::connect($sett['karat'], 'karat');

$ck = dibi::getConnection("karat");


$fiskalni_rok = date("y") % 2000;
$dt = $ck->query("SELECT stredisko, nazev, platnost, ts, CONVERT(varchar, ts, 126) as zmeneno 
                    FROM dba.strcis s WHERE fiskalni_rok=%s and stredisko <>''", $fiskalni_rok)->fetchAll();


$cg = dibi::getConnection("gis");

$cg->query("UPDATE [cis_pracoviste] SET sync=1"); // oznac vsechny zaznamy na probihajici synchronizaci

foreach($dt as $d){

    try{

        $r = $cg->query("SELECT * FROM [cis_pracoviste] WHERE kod=%s", trim($d['stredisko']))->fetch();

    $a = [
        'kod' => trim($d['stredisko']),
        'nazev' => trim($d['nazev']),           
        'platnost' => $d['platnost'] == 1,
        'zmeneno'=> $d['zmeneno'],
        'sync'=> 0,
        'zmenil'=>-1
    ];

    if($r){

        if($d['zmeneno'] > $r['zmeneno']){ //v karatu jsou novejsi data
            $cg->query('UPDATE [cis_pracoviste] SET ', $a, ' WHERE id=%i', $r['id']);
            continue;
        }        
        else if($d['zmeneno'] < $r['zmeneno']) { //aktualizuj KARAT            
            
            
            $b = [
                'nazev'=>$r['nazev'],
                'platnost'=> $r['platnost'],
                'ts'=>$r['zmeneno']
            ];

            try{
                $ck->query("UPDATE dba.strcis SET", $b, "WHERE stredisko=%s and fiskalni_rok=%s", trim($d['stredisko']), $fiskalni_rok); 
                // echo "aktualizuj : ".$r['kod']." - ".$r['nazev']." [ts]: ".$d['ts']." [zmeneno]". $r['zmeneno']."\r\n";
            }catch(Exception $ex){}
            
        }
        
        $cg->query('UPDATE [cis_pracoviste] SET sync=0 WHERE id=%i', $r['id']);

    }
    else{
        $cg->query("INSERT INTO [cis_pracoviste]", $a);
    }

    
    }catch(Exception $ex){}

}

$cg->query("UPDATE [cis_pracoviste] SET sync=0"); 
