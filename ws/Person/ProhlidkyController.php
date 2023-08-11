<?php

namespace ws\Person;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;
use ws\Pomocne\UploadFileController;


/** @controller */
class ProhlidkyController extends BaseController
{

    /**
     * @var User
     * @inject
     */
    public $user;

    public function checkRequirements($method)
    {
        return true;
    }

    /** @callable  */
    public function getPracCinnostTable($tabquery=null)
    {
        
        $table = "(SELECT a.*,
                   to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                   coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                 FROM pers_prac_cinnost a WHERE deleted=false ) X";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


    /** @callable  */
    public function updatePracCinnost($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);

        $a = [ 'nazev'=> sanitize($rec['nazev']), 
                'lhuta' => intval($rec['lhuta']), 
                'order' => intval($rec['order']), 
                'zakon_riziko' => sanitize($rec['zakon_riziko']), 
                'zakon_skupina' => sanitize($rec['zakon_skupina']), 
                'platnost' => $rec['platnost'] == 1 ? true : false,                
                'poznamka' => sanitize($rec['poznamka']), 
                'zmenil' => $this->getUserID(), 
                'zmeneno'=> $this->getNow()];

        if($id < 0){
            dibi::query('INSERT INTO pers_prac_cinnost', $a);
            $id = dibi::query("SELECT currval('pers_prac_cinnost_id_seq')")->fetchSingle();
        }
        else{
            dibi::query('UPDATE pers_prac_cinnost SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
        }
        
        $r['data'] = (object) $this->getPracCinnost($id);
        return $r;
    }
    
    /** @callable  */
    public function dropPracCinnost($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("UPDATE pers_prac_cinnost SET platnost=false, deleted=true WHERE id=%i", $id);
        }
        return $r;
    }


    /** @callable  */
    public function getPracCinnost($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*,
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                        to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno
                     FROM pers_prac_cinnost a WHERE a.id=%i", $id);      
                     
                     
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'nazev'=>$p['nazev'], 'lhuta'=>$p['lhuta'],             
                            'zakon_riziko' => $p['zakon_riziko'], 
                            'zakon_skupina' => $p['zakon_skupina'], 
                            'platnost' => $p['platnost'],                        
                            'order' => $p['order'],           
                            'poznamka'=>$p['poznamka'], 
                            'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{

            $r = (object) [
                'id'=> -1,
                'nazev'=> '',
                'lhuta'=> 0,
                'order'=> 0,
                'zakon_riziko' => '', 
                'zakon_skupina' => '', 
                'platnost' => true,              
                'poznamka'=> '',
                'zmeneno'=> '', 
                'zmenil'=> ''
            ]; 
        }
        
        
        return $r;
    }

    /** @callable  */
    public function  getPracCinnostList($platne=false){


        $q = "";

        if($platne)
        {
            $q = " and platne=true";
        }

        $dt = dibi::query("SELECT *,
                                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                                to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno
                            FROM pers_prac_cinnost a WHERE deleted=false {$q} ORDER BY `order` ASC, zakon_riziko ASC, zakon_skupina ASC, nazev ASC");
        $r = [];
        
        foreach($dt->fetchAll() as $p){
            $r[] = (object) ['id'=>$p['id'], 
                            'nazev'=>$p['nazev'], 
                            'lhuta'=>$p['lhuta'], 
                            'zakon_riziko' => $p['zakon_riziko'], 
                            'zakon_skupina' => $p['zakon_skupina'], 
                            'platnost' => $p['platnost'],                          
                            'order'=>$p['order'], 
                            'poznamka'=>$p['poznamka'], 
                            'zmeneno'=>$p['zmeneno'], 
                            'zmenil'=>$p['zmenil']]; 
        }

        return $r;   
    }


    /*** SKUPINA  */

     /** @callable  */
     public function getPersSkupinaTable($tabquery=null)
     {
         
         $table = "(SELECT a.*,
                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                  FROM pers_skupina a) X";
        
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
     }
 
 
     /** @callable  */
     public function updatePersSkupina($rec)
     {
         $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
 
         $id = intval($rec['id']);
         $nazev = sanitize($rec['nazev']);
 
         $a = ['nazev' => $nazev, 'zmenil' => $this->getUserID(), 'zmeneno'=> $this->getNow()];
 
         if($id < 0){
             dibi::query('INSERT INTO pers_skupina', $a);
             $id = dibi::query("SELECT currval('pers_skupina_id_seq')")->fetchSingle();
         }
         else{
             dibi::query('UPDATE pers_skupina SET ', $a, ' WHERE id=%i', $id);
             $r['nazev'] = 'Záznam aktualizován';
         }
         
         $r['data'] = (object) $this->getPersSkupina($id);
         return $r;
     }
     
     /** @callable  */
     public function dropPersSkupina($id)
     {
         $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
         $id = intval($id);
 
         if($id > -1){
             dibi::query("DELETE FROM pers_skupina where id=%i", $id);
         }
         return $r;
     }
 
 
     /** @callable  */
     public function getPersSkupina($id=-1){
         
         
         if($id > -1){
             $dt = dibi::query("SELECT a.id, a.nazev,
                         coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                         to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno
                      FROM pers_skupina a WHERE a.id=%i", $id);      
                      
                      
             $p = $dt->fetch();
             $r = (object) ['id'=>$p['id'], 'nazev'=>$p['nazev'],
                             'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
         }
         else{
 
             $r = (object) [
                 'id'=> -1,
                 'nazev'=> '',
                 'zmeneno'=> '', 
                 'zmenil'=> ''
             ]; 
         }
         
         
         return $r;
     }
 

    /*** RIZIKOVOST  */

    /** @callable  */
    public function getPersRizikovostTable($tabquery=null)
    {
        
        $table = "(SELECT a.*,
                (select nazev from pers_skupina s where s.id = a.skupina_id) skupina_nazev,
                to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                FROM pers_rizikovost_pracovist a) X";
    
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }
 

    /** @callable  */
    public function  getPersSkupinaList(){
        $dt = dibi::query("SELECT id, nazev FROM pers_skupina ORDER BY nazev ASC");
        $r = [];
        
        foreach($dt->fetchAll() as $f){
            $r[] = ['id'=> $f['id'], 'nazev'=>$f['nazev']];
        }

        return $r;   
    }
 
    /** @callable  */
    public function updatePersRizikovost($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);

        $a = ['druh_prace' => sanitize($rec['druh_prace']), 
                'rezim_prace' => sanitize($rec['rezim_prace']), 
                'kod' => sanitize($rec['kod']),
                'skupina_id' => intval($rec['skupina_id']),
                'popis_prace' => sanitize($rec['popis_prace']),
                'hluk' => intval($rec['hluk']),
                'prach' => intval($rec['prach']),
                'vibrace' => intval($rec['vibrace']),
                'fyzicka_zatez' => intval($rec['fyzicka_zatez']),
                'zatez_teplem' => intval($rec['zatez_teplem']),
                'pracovni_poloha' => intval($rec['pracovni_poloha']),
                'zrakova_zatez' => intval($rec['zrakova_zatez']),
                'chemicke_latky_smesi' => intval($rec['chemicke_latky_smesi']),
                'neionizujici_zareni' => intval($rec['neionizujici_zareni']),                
                'zatez_chladem' => intval($rec['zatez_chladem']),
                'psychicka_zatez' => intval($rec['psychicka_zatez']),                
                'zmenil' => $this->getUserID(),
                'zmeneno' => $this->getNow()
            ];

        if($id < 0){
            dibi::query('INSERT INTO pers_rizikovost_pracovist', $a);
            $id = dibi::query("SELECT currval('rizikovost_pracovist_id_seq')")->fetchSingle();
        }
        else{
            dibi::query('UPDATE pers_rizikovost_pracovist SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
        }

        dibi::query("DELETE FROM pers_rizikovost_cinnost WHERE rizikovost_id=%i", $id);

        if(count($rec['cinnost']) > 0) {            
            foreach($rec['cinnost'] as $c){
                dibi::query('INSERT INTO pers_rizikovost_cinnost', ['rizikovost_id'=>$id, 'cinnost_id'=>intval($c)]);
            }
        }

        
        $r['data'] = (object) $this->getPersRizikovost($id);
        return $r;
    }


     
     /** @callable  */
     public function dropPersRizikovost($id)
     {
         $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
         $id = intval($id);
 
         if($id > -1){
             dibi::query("DELETE FROM pers_rizikovost_pracovist WHERE id=%i", $id);
         }
         return $r;
     }
 
 
     /** @callable  */
     public function getPersRizikovost($id=-1){
         
         
         if($id > -1){
             $dt = dibi::query("SELECT a.*,
                        (select nazev from pers_skupina s where s.id = a.skupina_id) skupina_nazev,
                         coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                         to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno
                      FROM pers_rizikovost_pracovist a WHERE a.id=%i", $id);      
                      
                      
             $p = $dt->fetch();

             if($p){


                $dt = dibi::query("SELECT * FROM pers_rizikovost_cinnost WHERE rizikovost_id=%i", $id)->fetchAll();

                $cin = [];
                foreach($dt as $d){
                    $cin[] = $d['cinnost_id'];
                }


                return (object) ['id'=>$p['id'],
                        'druh_prace' => $p['druh_prace'], 
                        'rezim_prace' => $p['rezim_prace'], 
                        'kod' => $p['kod'],
                        'skupina_id' => $p['skupina_id'],
                        'skupina_nazev' => $p['skupina_nazev'],
                        'popis_prace' => $p['popis_prace'],
                        'hluk' => $p['hluk'],                    
                        'prach' => $p['prach'],
                        'vibrace' => $p['vibrace'],
                        'fyzicka_zatez' => $p['fyzicka_zatez'],
                        'zatez_teplem' => $p['zatez_teplem'],
                        'zrakova_zatez' => $p['zrakova_zatez'],                    
                        'pracovni_poloha' => $p['pracovni_poloha'],
                        'chemicke_latky_smesi' => $p['chemicke_latky_smesi'],
                        'neionizujici_zareni' => $p['neionizujici_zareni'],
                        'zatez_chladem' => $p['zatez_chladem'],
                        'psychicka_zatez' => $p['psychicka_zatez'],
                        'cinnost' => $cin,
                        'zmenil' => $p['zmenil'],
                        'zmeneno' => $p['zmeneno'],                
                    ];
             }
        }
             
 
        return  (object) ['id'=> -1,
                    'druh_prace' => '', 
                    'rezim_prace' => '', 
                    'kod' => '',
                    'skupina_id' => -1,
                    'skupina_nazev' => '',
                    'popis_prace' => '',
                    'hluk' => 0,                    
                    'prach' => 0,
                    'vibrace' => 0,
                    'fyzicka_zatez' => 0,
                    'zatez_teplem' => 0,
                    'zrakova_zatez' => 0,
                    'pracovni_poloha' => 0,
                    'chemicke_latky_smesi' => 0,
                    'neionizujici_zareni' => 0,
                    'zatez_chladem' => 0,
                    'psychicka_zatez' => 0,
                    'cinnost' => [],
                    'zmenil' => -1,
                    'zmeneno' => '',
                ];
     }
 
     
     /**** PROHLIDKY */


    /** @callable  */
    public function getProhlidkaTable($tabquery=null)
    {
    
        $table = "(SELECT a.*,                    
                    EXTRACT(YEAR FROM AGE(now(), os.datum_narozeni)) vek,
                    coalesce(os.oscislo, '') osoba_oscislo,                       
                    coalesce( os.prijmeni || ' ' || os.jmeno  , '') osoba_osoba,
                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                FROM pers_zdrav_prohlidky a LEFT JOIN [osoba] os ON a.osoba_id = os.id) X";
        
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function updateProhlidka($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
      
        $a = [
              'datum_prohlidky' => $this->sanitizeDate($rec['datum_prohlidky']),
              'platnost_prohlidky' => $this->sanitizeDate($rec['platnost_prohlidky']),
              'mimoradna_prohlidka'=> $this->sanitizeDate($rec['mimoradna_prohlidka']),
              'typ' => intval($rec['typ']),
              't0_0' => $rec['t0_0'] == 1 ? true : false,
              't0_1' => $rec['t0_1'] == 1 ? true : false,
              't1_0' => $rec['t1_0'] == 1 ? true : false,
              't2_0' => $rec['t2_0'] == 1 ? true : false,
              't2_1' => $rec['t2_1'] == 1 ? true : false,              
              't2_2' => $rec['t2_2'] == 1 ? true : false,
              't2_3' => $rec['t2_3'] == 1 ? true : false,
              't2_4' => $rec['t2_4'] == 1 ? true : false,
              't2_5' => $rec['t2_5'] == 1 ? true : false,
              't2_6' => $rec['t2_6'] == 1 ? true : false,
              't2_7' => $rec['t2_7'] == 1 ? true : false,
              't2_8' => $rec['t2_8'] == 1 ? true : false,
              't2_9' => $rec['t2_9'] == 1 ? true : false,
              't2_10' => $rec['t2_10'] == 1 ? true : false,
              'prac_zarazeni'=> sanitize($rec['prac_zarazeni']),
              'druh_prace' => sanitize($rec['druh_prace']),
              'rezim_prace' => sanitize($rec['rezim_prace']),
              'f_prach' => intval($rec['f_prach']),
              'f_chem' => intval($rec['f_chem']),
              'f_hluk' => intval($rec['f_hluk']),
              'f_vibrace' => intval($rec['f_vibrace']),
              'f_zareni' => intval($rec['f_zareni']),
              'f_poloha' => intval($rec['f_poloha']),
              'f_teplo' => intval($rec['f_teplo']),
              'f_chlad' => intval($rec['f_chlad']),
              'f_fyz' => intval($rec['f_fyz']),
              'f_zrak' => intval($rec['f_zrak']),
              'f_psychika' => intval($rec['f_psychika']),
              'f_biologicka' => intval($rec['f_biologicka']),
              'f_tlak' => intval($rec['f_tlak']),
              'platnost_prohlidky_roky' => intval($rec['platnost_prohlidky_roky']),
              'is_zpusobily' => $rec['is_zpusobily'] == 1 ? true : false,
              'is_nezpusobily' => $rec['is_nezpusobily'] == 1 ? true : false,
              'is_zpusobilypodm' => $rec['is_zpusobilypodm'] == 1 ? true : false,
              'is_ztrata_zpusobilosti' => $rec['is_ztrata_zpusobilosti'] == 1 ? true : false, 
              'note_podminka' => sanitize($rec['note_podminka']),
              'zadost_vystavena' => $this->sanitizeDate($rec['zadost_vystavena']),
              'zadanky_predany' => $this->sanitizeDate($rec['zadanky_predany']),
              'posudkovy_zaver' => sanitize($rec['posudkovy_zaver']),
              'priloha_hash' => sanitize($rec['priloha_hash']),
              'osoba_id' => intval($rec['osoba_id']),
              'duvod_pravidlo' => sanitize($rec['duvod_pravidlo']),
              'generovano' => false, // zmen prohlidka jiz je editovana uz nepatri mezi vygenerovane
              'zmenil' => $this->getUserID(), 
              'zmeneno'=> $this->getNow()
            ];

        if($id < 0){
            dibi::query('INSERT INTO pers_zdrav_prohlidky', $a);
            $id = dibi::query("SELECT currval('pers_tvorba_zdrav_prohlidky_id_seq')")->fetchSingle();
        }
        else{
            dibi::query('UPDATE pers_zdrav_prohlidky SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
        }

        $this->updateProhlidkaCinnost($id, $rec['prohlidky_cinnost']);
        
        $r['data'] = (object) $this->getProhlidka($id);
        return $r;
    }
    
    /** @callable  */
    public function dropProhlidka($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){

            $v = dibi::query("SELECT priloha_hash FROM pers_zdrav_prohlidky WHERE id=%i", $id)->fetchSingle();

            if($v){
                UploadFileController::DropByUrlRec($v);
            }
            
            dibi::query("DELETE FROM pers_zdrav_prohlidky WHERE id=%i", $id);
        }
        return $r;
    }



    /** @callable  */
    public function generujNasledneProhlidky($tabquery=null){

        


        $table = "(SELECT date_part('year', age(o.datum_narozeni)) vek, zpp.id, o.id osoba_id, o.oscislo, o.prijmeni, o.jmeno, zpp.zadost_vystavena, zpp.datum_prohlidky, zpp.platnost_prohlidky, zpp.mimoradna_prohlidka, o.cis_pracoviste_id, o.rizikovost_id, o.prac_zarazeni_id, o.datum_narozeni,
                            p.nazev, p.kod kod_pracoviste, pp.nazev prac_zarazeni, r.druh_prace, r.kod, coalesce(zbyva_dnu, 0) zbyva_dnu, zpp.generovano
                            FROM osoba o LEFT JOIN cis_pracoviste p ON o.cis_pracoviste_id = p.id LEFT JOIN pers_prac_zarazeni pp ON o.prac_zarazeni_id = pp.id 
                            LEFT JOIN pers_rizikovost_pracovist r ON o.rizikovost_id = r.id LEFT JOIN
                            (SELECT distinct on(osoba_id) zadost_vystavena ,  date_part('day', platnost_prohlidky - now()) zbyva_dnu, pz.id, osoba_id, datum_prohlidky, generovano, platnost_prohlidky, mimoradna_prohlidka  
                            from pers_zdrav_prohlidky pz order by osoba_id, zadost_vystavena asc) zpp on o.id = zpp.osoba_id 
                            WHERE o.platnost = true) X";

        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
        
    }

    /** @callable  */
    public function genVytvorProhlidky($rec=[]){


      /*** priklad definice pravidla pro stanoveni lhuty prohlidky
         * 
         * {"opt":0,"oper":0,"tak":0,"val":50,"roky":2,"lbl":"VĚK > 50 pak "},
         * {"opt":1,"oper":2,"tak":0,"val":3,"roky":2,"lbl":"RIZIKOVOST KATEGORIE = 3 pak "},
         * {"opt":0,"oper":3,"tak":0,"val":50,"roky":4,"lbl":"VĚK <= 50 pak "}
         * 
        */
        $json_pravidla = dibi::query("select param from settings where kod='PERS_GEN_ZDRAV_PROHL'")->fetchSingle();	
        $pravidla = \json_decode($json_pravidla);

        if(!$pravidla){
            $r['kod'] = 1;
            $r['nazev'] = "Neexistují pravidla pro výpočet zdravotní prohlídky. Nejprve je nastav ve Zdravotní prohlídky -> Nastavení";
            return;
        }

        /*** generuj prohlidky */
        $r = ['kod'=> 0, 'nazev' => 'Prohlídky vygenerovány', 'data'=> null];

        $res = true;
        if(!is_array($rec) && isset($rec['osoba_id'])){
            $res = $res && $this->generujProhlidku($rec['osoba_id'], $pravidla);
        }
        else{
            foreach($rec as $rs){
                $res = $res && $this->generujProhlidku($rs['osoba_id'], $pravidla);
            }
        }

        
        if(!$res){
            $r['kod'] = 1;
            $r['nazev'] = 'U jednoho nebo více záznamů nešlo vygenerovat prohlídku. Zkontroluj zda osoby mají nastavené pracovní zařazení.';
        }


        return $r;
    }

    private function _generujProhlidku_addFaktor($arr=[], $faktcis, $fakttyp){

        if(\key_exists($faktcis, $arr)){
            $arr[$faktcis][] = $fakttyp;
        }
        else{
            $arr[$faktcis] = [ $fakttyp ];
        }

        return $arr;
    }


    /***
     * Generuje prohlidku vraci typ 
     * 
     */
    public function generujProhlidku($osobaid=-1, $pravidla=[]){


        $o = dibi::query("SELECT coalesce(z.nazev, '') prac_zarazeni,coalesce(r.druh_prace, '') druh_prace, '' rezim_prace, 
                        coalesce(r.hluk, 0) hluk,
                        coalesce(r.prach, 0) prach, 
                        coalesce(r.vibrace, 0) vibrace,
                        coalesce(r.fyzicka_zatez, 0) f_fyz,
                        coalesce(r.zatez_teplem, 0) teplo,
                        coalesce(r.pracovni_poloha, 0) poloha,
                        coalesce(r.zrakova_zatez, 0) zrak,
                        coalesce(r.chemicke_latky_smesi, 0) chem, 
                        coalesce(r.neionizujici_zareni, 0) zareni,
                        coalesce(r.zatez_chladem, 0) chlad,                        
                        coalesce(r.psychicka_zatez, 0) psychika,
                        0 biolog,
                        0 tlak,
                        EXTRACT(YEAR FROM AGE(now(), o.datum_narozeni)) vek, o.rizikovost_id  
                FROM osoba o LEFT JOIN pers_prac_zarazeni z ON o.prac_zarazeni_id = z.id LEFT JOIN pers_rizikovost_pracovist r ON o.rizikovost_id = r.id 
                WHERE o.id=%i", $osobaid)->fetch();


        if(!$o){
            return false;
        }

     
        
        //odmaz prohlidky ktere byly generovany a nebyly zmeneny uzivatelem
	    dibi::query("DELETE FROM pers_zdrav_prohlidky WHERE osoba_id = %i and generovano=true", $osobaid);

        //pocet prohlidkek historie
        $pocet_prohlidek = dibi::query("SELECT count(id) pocet FROM pers_zdrav_prohlidky WHERE osoba_id = %i", $osobaid)->fetchSingle();

        $priloha_hash = 'personalistika/zdravotni_prohlidka/'.time().'-'.rand(0, 100);

        $a = [
            'zadost_vystavena'=> $this->getToday(),
            'zmenil'=> $this->getUserID(),
            'osoba_id'=> $osobaid,
            'prac_zarazeni' => $o['prac_zarazeni'],
            'druh_prace' => $o['druh_prace'],
            'rezim_prace' => $o['rezim_prace'],
            'f_prach' => $o['prach'],
            'f_chem' => $o['chem'],
            'f_hluk' => $o['hluk'],
            'f_vibrace' => $o['vibrace'],
            'f_zareni' => $o['zareni'],
            'f_fyz' => $o['f_fyz'],
            'f_poloha' => $o['poloha'],
            'f_teplo' => $o['teplo'],
            'f_chlad' => $o['chlad'],
            'f_zrak' => $o['zrak'],
            'f_psychika' => $o['psychika'],
            'f_biologicka' => $o['biolog'],
            'f_tlak' => $o['tlak'],     
            'priloha_hash' => $priloha_hash,
            'generovano'=> true //nastav priznak ze se jedna o vygenerovanou prohlidku
        ];


        $lh = $this->_vypoctiLhutuProhlidky($pravidla, $o['vek'], $o['rizikovost_id'], $o['hluk'], $o['prach'], $o['chem'], $o['vibrace'], $o['f_fyz'], $o['zareni'], 
                                            $o['poloha'], $o['teplo'], $o['chlad'], $o['zrak'], $o['psychika'], $o['biolog'],  $o['tlak']);

        // nema zadnou prohlidku vytvor uvodni prohlidku bude obsahovat nejkratsi platnost, od teto prohlidky se pak dopoctou ostatni prohlidky
        if($pocet_prohlidek < 1){                      
            $a['typ'] = 0; //vstupni prohlidka
            $a['t0_0'] =  true;
        }
        else{ //jiz ma prohlidku vypocti dobu platnosti nove zalozene prohlidky 
            $a['typ'] = 1; //periodická
            $a['t1_0'] =  true;            
        }

        $a['platnost_prohlidky'] = date('Y-m-d', strtotime('+'.$lhuta.' years'));
        $a['platnost_prohlidky_roky'] = $lh->lhuta;
        $a['duvod_pravidlo'] = $lh->duvod;


        dibi::query('INSERT INTO [pers_zdrav_prohlidky]', $a);                                            
        $id = dibi::query("select currval('pers_tvorba_zdrav_prohlidky_id_seq')")->fetchSingle();

        //prirad cinnosti ktere patri k rizikovosti
        dibi::query('INSERT INTO pers_zdrav_prohlidky_cinnost (pers_zdrav_prohlidky_id, pers_prac_cinnost_id)
                    SELECT %i, cinnost_id
                    FROM pers_rizikovost_cinnost r INNER JOIN pers_prac_cinnost c ON r.cinnost_id = c.id WHERE r.rizikovost_id = %i and c.platnost=true', $id, $o['rizikovost_id']);
                

        return true;
    }

    /** @callable  
     * 
     *  vypocte jak dlouho bude platit prohlidka    
     * */    
    public function getProhlidkaLhuta($osobaid=-1){
        
        $r = ['kod'=> 0, 'nazev' => 'Platnost prohlídky přepočtena a nastavena.', 'data'=> ['lhuta'=> 0, 'duvod'=> 'Neplatné vstupní údaje.']];


        $json_pravidla = dibi::query("select param from settings where kod='PERS_GEN_ZDRAV_PROHL'")->fetchSingle();	
        $pravidla = \json_decode($json_pravidla);

        if(!$pravidla){
            $r['kod'] = 1;
            $r['nazev'] = "Neexistují pravidla pro výpočet zdravotní prohlídky. Nejprve je nastav ve Zdravotní prohlídky -> Nastavení";
            return;
        }


        $o = dibi::query("SELECT coalesce(z.nazev, '') prac_zarazeni,coalesce(r.druh_prace, '') druh_prace, '' rezim_prace, 
                        coalesce(r.hluk, 0) hluk,
                        coalesce(r.prach, 0) prach, 
                        coalesce(r.vibrace, 0) vibrace,
                        coalesce(r.fyzicka_zatez, 0) f_fyz,
                        coalesce(r.zatez_teplem, 0) teplo,
                        coalesce(r.pracovni_poloha, 0) poloha,
                        coalesce(r.zrakova_zatez, 0) zrak,
                        coalesce(r.chemicke_latky_smesi, 0) chem, 
                        coalesce(r.neionizujici_zareni, 0) zareni,
                        coalesce(r.zatez_chladem, 0) chlad,                        
                        coalesce(r.psychicka_zatez, 0) psychika,
                        0 biolog,
                        0 tlak,
                        EXTRACT(YEAR FROM AGE(now(), o.datum_narozeni)) vek, o.rizikovost_id  
                FROM osoba o LEFT JOIN pers_prac_zarazeni z ON o.prac_zarazeni_id = z.id LEFT JOIN pers_rizikovost_pracovist r ON o.rizikovost_id = r.id 
                WHERE o.id=%i", $osobaid)->fetch();


        if(!$o){
            $r['kod'] = 1;
            $r['nazev'] = "Osoba nebyla nalezena v systému";
        }


        $lh = $this->_vypoctiLhutuProhlidky($pravidla, $o['vek'], $o['rizikovost_id'], $o['hluk'], $o['prach'], $o['chem'], $o['vibrace'], $o['f_fyz'], $o['zareni'], 
                    $o['poloha'], $o['teplo'], $o['chlad'], $o['zrak'], $o['psychika'], $o['biolog'],  $o['tlak']);


        
        $r['data']['lhuta'] = $lh->lhuta;
        $r['data']['duvod_pravidlo'] = $lh->duvod;


        return $r;
    }
   
    
    /**
     * Vypocte delku lhuty prohlidky na zaklade pravidel, rizikovych faktoru a pracovnich cinnosti
     */
    protected function _vypoctiLhutuProhlidky($pravidla=[], $vekosoby=-1, $rizikovost_id = -1, $hluk=0, $prach=0, $chem=0, $vibrace=0, $ffyz=0, $zareni=0,
                                                $poloha=0, $teplo=0, $chlad=0, $zrak=0, $psychika=0, $biolog=0, $tlak=0 ){


        $vek =  $vekosoby; // vek osoby
        $vek_lhuta = 99;
        $cinn_minlhuta = 99;  //cinnost minimalni lhuta
        $fakt_minlhuta = 99;  // rizikovy 

        $lhuta = 99; // vysledna lhuta platnost prohlidky
        
        $os_faktory = [];
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $hluk, 'hluk');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $prach, 'prach');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $chem, 'chem');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $vibrace, 'vibrace');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $ffyz, 'f_fyz');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $zareni, 'zareni');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $poloha, 'poloha');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $teplo, 'teplo');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $chlad, 'chlad');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $zrak, 'zrak');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $psychika, 'psychika');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $biolog, 'biolog');
        $os_faktory = $this->_generujProhlidku_addFaktor($os_faktory, $tlak, 'tlak');

        $duvod_faktor = $duvod_vek = $duvod_cinnost = "";

        //nacti vsechny cinnosti, ktere maji nastavenou nejakou lhutu pro riziko ktere ma prirazene zamestnanec 
        $dt = dibi::query("SELECT c.lhuta, c.id, c.nazev FROM pers_prac_cinnost c INNER JOIN pers_rizikovost_cinnost r ON c.id = r.cinnost_id
                            WHERE c.platnost=true AND c.deleted=false AND c.lhuta > 0 AND r.rizikovost_id=%i", $rizikovost_id)->fetchAll();
        foreach($dt as $d){
            //$cinnost[$d['id']] = $d['lhuta'];

            //vezmi tu nejkratsi dobu, ktera je prirazena cinnosti
            $cinn_minlhuta =  $d['lhuta'] < $cinn_minlhuta  ? $d['lhuta'] : $cinn_minlhuta;
            $duvod_cinnost = $d['nazev']." - ".$d['lhuta']." roky";
        }


        /*** priklad definice pravidla pro stanoveni lhuty prohlidky
         * 
         * {"opt":0,"oper":0,"tak":0,"val":50,"roky":2,"lbl":"VĚK > 50 pak "},
         * {"opt":1,"oper":2,"tak":0,"val":3,"roky":2,"lbl":"RIZIKOVOST KATEGORIE = 3 pak "},
         * {"opt":0,"oper":3,"tak":0,"val":50,"roky":4,"lbl":"VĚK <= 50 pak "}
         * 
         * oper
         * {value: 0, label: '>'}, {value: 1, label: '>='}, {value: 2, label: '<'} , {value: 3, label: '<='}, {value: 4, label: '='} 
        */


        //nacti pravidla pro rizikove faktory 
        //$fakt= [];
        foreach($pravidla as $p){

            //rizikovost faktor kontrola faktoru na faktory prirazene zamestnanci
            if($p->opt == 1){            
                // $fakt[$p->val] = $p->roky; // faktor roky

                if(\key_exists($p->val, $os_faktory)){
                    $fakt_minlhuta = $p->roky < $fakt_minlhuta ? $p->roky : $fakt_minlhuta;
                    $duvod_faktor = $p->lbl." ".$p->roky." roky";
                }
                
            }            
            else if($p->opt == 0){ // pravidlo veku vezmi vek zamestnance a zkontroluj je s pravidly veku
                
                if($p->oper == 0 &&  $vek > $p->val){ // >
                    $vek_lhuta = $p->roky;
                    $duvod_faktor = $p->lbl." ".$p->roky." roky";
                }
                else if($p->oper == 1 &&  $vek >= $p->val){ // >=
                    $vek_lhuta = $p->roky;
                    $duvod_faktor = $p->lbl." ".$p->roky." roky";
                }
                else if($p->oper == 2 &&  $vek < $p->val){  // <
                    $vek_lhuta = $p->roky; 
                    $duvod_faktor = $p->lbl." ".$p->roky." roky";
                }
                else if($p->oper == 3 &&  $vek <= $p->val){ // <=
                    $vek_lhuta = $p->roky;
                    $duvod_faktor = $p->lbl." ".$p->roky." roky";
                }
                else if($p->oper == 4 &&  $vek = $p->val){  // =
                    $vek_lhuta = $p->roky;
                    $duvod_faktor = $p->lbl." ".$p->roky." roky";
                }
            }
        }
        

        $duvod = "Věk ".$vek_lhuta;
        $lhuta = $vek_lhuta;
        if($cinn_minlhuta < $lhuta){
            $duvod = $duvod_cinnost;
            $lhuta = $cinn_minlhuta;
        }
        
        if($fakt_minlhuta < $lhuta){
            $lhuta = $fakt_minlhuta;
            $duvod = $duvod_faktor;
        }

        
        return (object) ['lhuta'=> $lhuta, 'duvod'=>$duvod];

    }




    /** @callable  */
    public function getProhlidka($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*,
                            to_char(a.datum_prohlidky, 'YYYY-MM-DD') || 'T00:00:00.000Z' datum_prohlidky,
                            to_char(a.platnost_prohlidky, 'YYYY-MM-DD') || 'T00:00:00.000Z' platnost_prohlidky,
                            to_char(a.mimoradna_prohlidka, 'YYYY-MM-DD') || 'T00:00:00.000Z' mimoradna_prohlidka,
                            to_char(a.zadost_vystavena, 'YYYY-MM-DD') || 'T00:00:00.000Z' zadost_vystavena, 
                            to_char(a.zadanky_predany, 'YYYY-MM-DD') || 'T00:00:00.000Z' zadanky_predany,                            
                            os.oscislo, os.prijmeni, os.jmeno,
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                        to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno
                    FROM pers_zdrav_prohlidky a LEFT JOIN osoba os ON a.osoba_id = os.id where a.id=%i", $id);      
                    
                    
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 
                            'datum_prohlidky'=> $p['datum_prohlidky'],
                            'platnost_prohlidky'=> $p['platnost_prohlidky'],
                            'mimoradna_prohlidka'=> $p['mimoradna_prohlidka'],
                            'posudkovy_zaver'=> $p['posudkovy_zaver'],
                            'zadost_vystavena'=> $p['zadost_vystavena'],
                            'zadanky_predany'=> $p['zadanky_predany'],
                            'typ'=> $p['typ'],
                            't0_0' => $p['t0_0'],
                            't0_1' => $p['t0_1'],
                            't1_0' => $p['t1_0'],
                            't2_0' => $p['t2_0'],
                            't2_1' => $p['t2_1'],              
                            't2_2' => $p['t2_2'],
                            't2_3' => $p['t2_3'],
                            't2_4' => $p['t2_4'],
                            't2_5' => $p['t2_5'],
                            't2_6' => $p['t2_6'],
                            't2_7' => $p['t2_7'],
                            't2_8' => $p['t2_8'],
                            't2_9' => $p['t2_9'],
                            't2_10' => $p['t2_10'],
                            'prac_zarazeni'=> $p['prac_zarazeni'],
                            'druh_prace' => $p['druh_prace'],
                            'rezim_prace' => $p['rezim_prace'],
                            'f_prach' => $p['f_prach'],
                            'f_chem' => $p['f_chem'],
                            'f_hluk' => $p['f_hluk'],
                            'f_vibrace' => $p['f_vibrace'],
                            'f_zareni' => $p['f_zareni'],
                            'f_fyz' => $p['f_fyz'],
                            'f_poloha' => $p['f_poloha'],
                            'f_teplo' => $p['f_teplo'],
                            'f_chlad' => $p['f_chlad'],
                            'f_zrak' => $p['f_zrak'],
                            'f_psychika' => $p['f_psychika'],
                            'f_biologicka' => $p['f_biologicka'],
                            'f_tlak' => $p['f_tlak'],
                            'platnost_prohlidky_roky' => $p['platnost_prohlidky_roky'],
                            'is_zpusobily' => $p['is_zpusobily'],
                            'is_nezpusobily' => $p['is_nezpusobily'],
                            'is_zpusobilypodm' => $p['is_zpusobilypodm'],
                            'is_ztrata_zpusobilosti' => $p['is_ztrata_zpusobilosti'],
                            'note_podminka' => $p['note_podminka'],
                            'osoba_id'=> $p['osoba_id'],                            
                            'osoba_oscislo'=> $p['oscislo'],
                            'osoba_osoba'=> $p['prijmeni']." ".$p['jmeno'],
                            'prohlidky_cinnost' => [],
                            'duvod_pravidlo' => $p['duvod_pravidlo'],
                            'priloha_hash' => $p['priloha_hash'],
                            'generovano' => $p['generovano'],
                            'zmeneno'=>$p['zmeneno'], 
                            'zmenil'=>$p['zmenil']]; 

            $r->prohlidky_cinnost = $this->getProhlidkaCinnost($p->id);   //docti prohlidky cinnosti                    
        }
        else{

            $r = (object) [
                'id'=> -1,
                'zadost_vystavena'=> $this->getToday(),
                'zadanky_predany'=> null,
                'datum_prohlidky'=> null,
                'platnost_prohlidky'=> null,
                'mimoradna_prohlidka'=> null,
                'posudkovy_zaver'=> '',
                'typ'=> 0,
                't0_0' => false,
                't0_1' => false,
                't1_0' => false,
                't2_0' => false,
                't2_1' => false,              
                't2_2' => false,
                't2_3' => false,
                't2_4' => false,
                't2_5' => false,
                't2_6' => false,
                't2_7' => false,
                't2_8' => false,
                't2_9' => false,
                't2_10' =>false,
                'prac_zarazeni'=> '',
                'druh_prace' => '',
                'rezim_prace' => '',
                'f_prach' => 0,
                'f_chem' => 0,
                'f_hluk' => 0,
                'f_vibrace' => 0,
                'f_zareni' => 0,
                'f_fyz' => 0,
                'f_poloha' => 0,
                'f_teplo' => 0,
                'f_chlad' => 0,
                'f_zrak' => 0,
                'f_psychika' => 0,
                'f_biologicka' => 0,
                'f_tlak' => 0,
                'platnost_prohlidky_roky' => 0,
                'is_zpusobily' => false,
                'is_nezpusobily' => false,
                'is_zpusobilypodm' => false,
                'is_ztrata_zpusobilosti' => false, 
                'note_podminka' => '',
                'osoba_osoba'=> '',
                'osoba_oscislo'=>'',
                'osoba_id'=> -1,
                'generovano' => false,
                'priloha_hash' => 'personalistika/zdravotni_prohlidka/'.time().'-'.rand(0, 100),
                'prohlidky_cinnost' => [],
                'zmeneno'=> '', 
                'zmenil'=> ''
            ]; 
        }
        
        
        return $r;
    }


    public function getProhlidkaCinnost($prohlidkaid = -1){


        $dt = dibi::query("SELECT pers_prac_cinnost_id FROM pers_zdrav_prohlidky_cinnost WHERE pers_zdrav_prohlidky_id = %i", $prohlidkaid)->fetchAll();

        $r = [];
        foreach($dt as $d){
            $r[] = $d['pers_prac_cinnost_id'];
        }

        return $r;
    }


    public function updateProhlidkaCinnost($prohlidkaid, $lst = []){

        dibi::query("DELETE FROM pers_zdrav_prohlidky_cinnost WHERE pers_zdrav_prohlidky_id = %i", $prohlidkaid);

        foreach($lst as $l){
            dibi::query('INSERT INTO pers_zdrav_prohlidky_cinnost', ['pers_prac_cinnost_id' => intval($l), 'pers_zdrav_prohlidky_id' => $prohlidkaid]);
        }

    }


    /** @callable  */
    public function fillProhlidkaRizikyOsoby($rec){

        $oid = intval($rec['osoba_id']);

        if($oid  < 0){
            return $rec;
        }


        $d = dibi::query("SELECT coalesce(z.nazev, '') prac_zarazeni, coalesce(r.druh_prace, '') druh_prace, coalesce(r.rezim_prace, '') rezim_prace, 
                coalesce(r.hluk, 0) f_hluk, 
                coalesce(r.prach, 0) f_prach, 
                coalesce(r.vibrace, 0) f_vibrace,                
                coalesce(r.fyzicka_zatez, 0) f_fyz,
                coalesce(r.zatez_teplem, 0) f_teplo,
                coalesce(r.pracovni_poloha, 0) f_poloha,
                coalesce(r.zrakova_zatez, 0) f_zrak,
                coalesce(r.chemicke_latky_smesi, 0) f_chem,                
                coalesce(r.neionizujici_zareni, 0) f_zareni,
                coalesce(r.zatez_chladem, 0) f_chlad,
                coalesce(r.psychicka_zatez, 0) f_psychika,                
                0 f_biologicka,
                0 f_tlak,
                o.rizikovost_id
                FROM osoba o LEFT JOIN pers_prac_zarazeni z ON o.prac_zarazeni_id = z.id LEFT JOIN pers_rizikovost_pracovist r ON o.rizikovost_id = r.id WHERE o.id=%i", $oid)->fetch();

        if($d){
            $rec['prac_zarazeni'] = $d['prac_zarazeni'];
            $rec['druh_prace'] = $d['druh_prace'];
            $rec['rezim_prace'] = $d['rezim_prace'];
            $rec['f_prach'] = $d['f_prach'];
            $rec['f_chem'] = $d['f_chem'];
            $rec['f_hluk'] = $d['f_hluk'];
            $rec['f_fyz'] = $d['f_fyz'];
            $rec['f_vibrace'] = $d['f_vibrace'];
            $rec['f_zareni'] = $d['f_zareni'];
            $rec['f_poloha'] = $d['f_poloha'];
            $rec['f_teplo'] = $d['f_teplo'];
            $rec['f_chlad'] = $d['f_chlad'];
            $rec['f_zrak'] = $d['f_zrak'];
            $rec['f_psychika'] = $d['f_psychika'];
            $rec['f_biologicka'] = $d['f_biologicka'];
            $rec['f_tlak'] = $d['f_tlak'];


            $dt = dibi::query("SELECT cinnost_id FROM pers_rizikovost_cinnost WHERE rizikovost_id=%i", $d['rizikovost_id'])->fetchAll();
            $lst = [];
            foreach($dt as $r){ 
                $lst[] = $r['cinnost_id'];
            }
            
            
            $rec['prohlidky_cinnost'] = $lst;
        }

        return $rec;
    }

}