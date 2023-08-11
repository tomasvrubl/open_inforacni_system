<?php

namespace ws\Terminal;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class LinkaController extends BaseController
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
    public function getPlan($kod='', $datum=null){

        global $parameters;

        $datum = $datum == null ? $this->getToday() : $this->sanitizeDate($datum);

        $r = [
                'datum' => $datum,
                'zdroj_kod' => $kod,
                'zdroj' => 'Neznámý zdroj',
                'poznamka' => '',
                'seznam' => []
        ];


        \dibi::connect($parameters['karat'], 'karat');
        $ck = dibi::getConnection("karat");


        // informace o stroji        
        $dt = $ck->query("SELECT zdroj, nazev FROM dba.zdr_zdr WHERE zdroj=%s and xplan='STD' and platnost=1", $kod)->fetch();
        if(!$dt){
            return $r;
        }


        $r['zdroj_kod'] = $dt['zdroj'];
        $r['zdroj'] = $dt['nazev'];


        $dt = $ck->query("SELECT doklad, isnull(poznamka, '') poznamka FROM dba.user_forma WHERE zdroj=%s and xplan='STD' and datum=%s", $kod, $datum)->fetch();

        //$r['sql']= dibi::$sql;

        if($dt){
            $r['poznamka'] =  trim($dt['poznamka']);



            $dt = $ck->query("select zdroj_id, zdroj, opv, odvedeno, cistahm, seda_tvarna, replace(popis, '- polotovar', '') as popis, poradi_formy, pocet_na_forme,mnozstvi_plan, CEILING(mnozstvi_plan/pocet_na_forme) as formy, prikaz, left(teplota_liti, LEN(teplota_liti)-1) as teplota_liti, jakost
                                    from (
                                    select
                                            z.nazev as zdroj,
                                            z.zdroj zdroj_id,
                                            p.opv, 
                                            p.popis + '  ('+rtrim(ltrim(convert(char(2),p.pocet_na_forme))) + ')' as popis, 
                                            p.poradi_formy, 
                                            p.mnozstvi_plan,
                                            p.pocet_na_forme,
                                            o.cistahm,
                                            p.odvedeno,
                                            left(o.nomenklatura, 1) as seda_tvarna,	 
                                            isnull((select pp.popis from dba.user_forma_pozor pp where pp.nomenklatura = o.nomenklatura), '') as prikaz,
                                            isnull((select user_teplotaliti + ',' 
                                                                    from dba.v_vyrobek vv 
                                                                    where vv.nomenklatura = o.nomenklatura and vv.platnost=1 and vv.user_teplotaliti is not null
                                                                    for xml path('')), ',') as teplota_liti,
                                            (select top 1 popis from dba.v_opvdil d where d.opv = o.opv and nomenklatura like 'POLTK%') jakost                                                
                                    from dba.user_forma f, dba.user_formasl p, dba.zdr_zdr z, dba.v_opvvyrza o
                                    where f.doklad = p.forma_doklad and f.zdroj = z.zdroj and f.xplan = z.xplan
                                    and o.opv= p.opv and f.doklad = %s
                                    ) X
                                    order by cast(poradi_formy as NUMERIC ) asc", $dt['doklad'])->fetchAll();
    
            $r['sql2']= dibi::$sql;

            foreach($dt as $d){


                $r['seznam'][] = [
                                  'vp'=> trim($d['opv']),
                                  'nazev'=> trim($d['popis']),
                                  'poradi'=> trim($d['poradi_formy']),
                                  'plan_ks'=> $d['mnozstvi_plan'],
                                  'pocet_na_forme'=> $d['pocet_na_forme'],
                                  'odvedeno'=> $d['odvedeno'],
                                  'hmotnost'=> number_format($d['cistahm'], 1),
                                  'teplota'=> $d['teplota_liti'],
                                  'jakost'=> trim($d['jakost']),
                                  'pokyn' => trim($d['prikaz']),
                                   '_hodnota' => 0 ];
            }

        }

        return $r;
    }

    function get_smena(){

        //$cas = date('H') * 60 + date('i');
    
        $cas = date('H');
    
        if($cas < 6 || $cas > 22){
            return 3; //nocni smena
        } 
        else if($cas >= 14 && $cas <= 22){
            return 2; //odpoledni smena
        }
    
        return 1; //ranni smena
        
    }


    
    /** @callable  */
    public function odvadeniPlan($oscislo = null, $rec=null){
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> $rec];


        if(empty($oscislo) || empty($rec)){
            return ['kod'=> 1, 'nazev'=> 'Chybná vstupní data. Osoba není přihlášena', 'data'=> $rec];
        }
        
        global $parameters;

        try{

            \dibi::connect($parameters['karat'], 'karat');
            $ck = dibi::getConnection("karat");

            $osoba = $ck->query("select osoba from dba.odb_osoby where oscislo=%s", $oscislo)->fetchSingle();

            $datum = $rec['datum'];
            $zdroj = $rec['zdroj_kod'];
            $smena = $this->get_smena();

            foreach($rec['seznam'] as $d){

                if($d['_hodnota'] < 1){
                    continue;
                }

                $a = [
                    'datum'=>$datum,
                    'smena'=>$smena,
                    'poradi'=>0,
                    'osoba'=>$osoba,
                    'opv'=>$d['vp'],
                    'zdroj'=>$zdroj,
                    'shodne_ks'=>$d['_hodnota'],            
                    'neshodne_ks'=>0,
                    'neshodne_kod'=>0,
                    'autor'=>'term',
                    'xplan'=>'STD',
                    'terminal_kod'=>'linka',
                    'terminal_ip'=>'::'
                ];        
        
                $ck->query('INSERT INTO dbo.user_odvadeni_history', $a);
                $sql = dibi::$sql;

            }

    
        }catch(Exception $ex){
            $r['kod'] = 1;
            $r['nazev'] = $ex->getMessage();
        }


        $r['data'] = $this->getPlan($zdroj, $datum);
        return $r;
    }



    /** @callable  */
    public function getZapisSmeny($id=-1){
        
        global $parameters;

        $datum = $datum == null ? $this->getToday() : $this->sanitizeDate($datum);

        $r = [
                'datum' => $datum,
                'smena' => $smena,
                'zdroj_kod' => $kod,
                'forem'=> 0,
                'utrzeno'=> 0,
                'poznamka' => '',
                'osoby' => []
        ];


        \dibi::connect($parameters['karat'], 'karat');
        $ck = dibi::getConnection("karat");

        return $r;
    }


    /** @callable  */
    public function  getZapisSmenyTable($tabquery=null)
    {
        
        $table = "( SELECT a.id, a.datum, a.kalendar_smena_id, a.zdroj_id, a.odv_mnozstvi, a.utrz_forem, a.termosoba, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select nazev from kalendar_smena s where s.id = a.kalendar_smena_id), '') as smena,
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM vyr_zapis_smeny_dkl a) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;

    }

}