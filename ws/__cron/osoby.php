<?php

/****************************************************
 * 
 * Stara se o synchronizaci osob mezi KARATem a GIS 
 * */

$sett = require_once __DIR__ .'/cron.php';


dibi::connect($sett['dibi'], 'gis');
dibi::connect($sett['karat'], 'karat');


$ck = dibi::getConnection("karat");

$dt = $ck->query("select o.oscislo, o.zdr_poj, o.pretitul, o.mobil, o.e_mail, o.e_mail_soukr, o.prijmeni, o.jmeno, format(o.nardatum, 'yyyy-MM-dd') nardatum, o.bydpsc, o.bydobec, o.bydstat, o.bydulice, 
                    o.cislo_popisne, o.ts, DATEDIFF(SECOND, '1970-01-01', o.ts) ad, isnull(p.kod_karty, '') kod_karty, isnull(z.stredisko,'') stredisko, isnull(z.prac_kateg, '') prac_kateg,
                    CONVERT(varchar, o.ts, 126) as zmeneno, o.rodcis
                    from dba.pers o 
                    inner join (select oscislo, max(kod_karty) kod_karty from dba.ppom where pp_do >= GETDATE() and oscislo <> '' group by oscislo ) p on o.oscislo=p.oscislo				               
                    left join (select oscislo, max(poradipp) poradipp, max(poradi) poradi, max(stredisko) stredisko, max(prac_kateg) prac_kateg  from dba.zarazeni z where do_data >= GETDATE() and oscislo  <> ''
                    group by oscislo ) z on o.oscislo = z.oscislo 				
                    where o.oscislo  = p.oscislo and o.oscislo <> '' and o.ts > '1901-01-01'")->fetchAll();


$cg = dibi::getConnection("gis");


$cg->query("UPDATE [osoba] SET sync=1");

foreach($dt as $d){

    $o = $cg->query("SELECT o.*, coalesce((select kod from pers_prac_zarazeni where id = o.prac_zarazeni_id), '') pracovni_zarazeni FROM [osoba] o WHERE o.oscislo=%s", trim($d['oscislo']))->fetch();

    if($o){ // osoba existuje v systemu 

        $titul = trim($d['pretitul']);
        $prijmeni = trim($d['prijmeni']);
        $jmeno = trim($d['jmeno']);
        $narozeni = $d['nardatum'];
        $ulice = trim($d['bydulice']);
        $obec = trim($d['bydobec']);
        $cp = trim($d['cislo_popisne']);
        $psc = trim($d['bydpsc']);
        $stat = trim($d['bydstat']);
        $mobil = trim($d['mobil']);
        $email = rtrim(trim($d['e_mail']).", ".trim($d['e_mail_soukr']), ", ");
        $zdrp = trim($d['zdr_poj']);
        $cip = trim($d['kod_karty']);
        $kategorie = trim($d['prac_kateg']);
        $rodcis = trim($d['rodcis']);

        $m1 = md5($titul.$prijmeni.$jmeno.$narozeni.$ulice.$obec.$cp.$psc.$stat.$mobil.$email.$zdrp.$cip.$kategorie.$rodcis);
        $m2 = md5($o['titul'].$o['prijmeni'].$o['jmeno'].$o['datum_narozeni'].$o['bydliste_ulice'].$o['bydliste_obec']
                        .$o['bydliste_cp'].$o['bydliste_psc'].$o['bydliste_stat'].$o['mobil'].$o['email']
                        .$o['zdravotni_pojistovna'].$o['cip'].$o['pracovni_zarazeni'].$o['rodnecislo']);

         
        if($o['zmeneno'] > $d['zmeneno']){ // gis je novejsi skipni
            continue;
        }   

        if(strcmp($m1, $m2) == 0){ //zaznamy jsou totozne
            continue; 
        }
        

        $a = [
            'titul' => $titul,
            'prijmeni' => $prijmeni,
            'jmeno' => $jmeno,
            'datum_narozeni' => $narozeni,
            'bydliste_ulice' => $ulice,
            'bydliste_obec' => $obec,
            'bydliste_cp' => $cp,
            'bydliste_psc' => $psc,
            'bydliste_stat' => $stat,
            'mobil' => $mobil,
            'email' =>  $email,
            'zdravotni_pojistovna'=> $zdrp,
            'cip'=> $cip,
            'rodnecislo'=>$rodcis,
            'zmeneno'=> $d['zmeneno'],
            'sync' => 0,
            'platnost' => true,
            'zmenil'=>-1
        ];

        $stredisko_id = $cg->query("SELECT id FROM [cis_pracoviste] WHERE kod=%s", trim($d['stredisko']))->fetchSingle();
        if($stredisko_id != null){
            $a['cis_pracoviste_id'] = $stredisko_id;
        }

        $prac_zarazeni_id = $cg->query("SELECT id FROM [pers_prac_zarazeni] WHERE kod=%s", trim($d['prac_kateg']))->fetchSingle();
        if($prac_zarazeni_id != null){
            $a['prac_zarazeni_id'] = $prac_zarazeni_id;
        }
        

        $cg->query('UPDATE [osoba] SET ', $a, ' WHERE id=%i', $o['id']);      

    }
    else {  // vytvor osobu neexistuje s titmo osobnim cislem 

        $a = [
            'oscislo' => trim($d['oscislo']),
            'titul' => trim($d['pretitul']),
            'prijmeni' => trim($d['prijmeni']),
            'jmeno' => trim($d['jmeno']),
            'datum_narozeni' => $d['nardatum'],
            'bydliste_ulice' => trim($d['bydulice']),
            'bydliste_obec' => trim($d['bydobec']),
            'bydliste_cp' => trim($d['cislo_popisne']),
            'bydliste_psc' => trim($d['bydpsc']),
            'bydliste_stat' => trim($d['bydstat']),
            'mobil' => trim($d['mobil']),
            'email' =>  rtrim(trim($d['e_mail']).", ".trim($d['e_mail_soukr']), ", "),            
            'zdravotni_pojistovna'=> trim($d['zdr_poj']),
            'cip'=> trim($d['kod_karty']),
            'zmeneno'=> 'now()',
            'platnost' => true,
            'sync' => 0,
            'zmenil'=>-1
        ];

        $stredisko_id = $cg->query("SELECT id FROM [cis_pracoviste] WHERE kod=%s", trim($d['stredisko']))->fetchSingle();
        if($stredisko_id != null){
            $a['cis_pracoviste_id'] = $stredisko_id;
        }

        $prac_zarazeni_id = $cg->query("SELECT id FROM [pers_prac_zarazeni] WHERE kod=%s", trim($d['prac_kateg']))->fetchSingle();
        if($prac_zarazeni_id != null){
            $a['prac_zarazeni_id'] = $prac_zarazeni_id;
        }


        $cg->query("INSERT INTO [osoba]", $a);

    }

}
