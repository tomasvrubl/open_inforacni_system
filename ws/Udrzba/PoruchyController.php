<?php

namespace ws\Udrzba;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class PoruchyController extends BaseController
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
    public function getTable($tabquery=null)
    {
        $table = "(SELECT a.*, coalesce((select nazev from cis_zdroj z where z.id = a.zdroj_id), '') zdroj,
                    coalesce((select nazev from cis_poruchy p where p.id = a.porucha_id), '') porucha,
                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                                        FROM udr_zapis_poruchy a WHERE id > -1) X ";

        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);

        
        
        $a = [ 'datum' => $this->sanitizeDate($rec['datum']),
                'od' => $this->sanitizeTime($rec['od']),
                'do' => $this->sanitizeTime($rec['do']),
                'porucha_id' => intval($rec['porucha_id']), 
                'zdroj_id'=> intval($rec['zdroj_id']), 
                'poznamka' => $this->sanitize($rec['poznamka']),
                'stav' => intval($rec['stav']),
                'priloha_hash' => $this->sanitize($rec['priloha_hash']),
                'zmeneno' => $this->getNow(),
                'zmenil' => $this->getUserID()];

        if($id < 0){

            $a['vytvoreno'] = $this->getNow();
            $a['vytvoril'] = $this->getPrijmeniJmeno()." / ".$this->getOsobniCislo();

            dibi::query('INSERT INTO udr_zapis_poruchy', $a);
            $id = dibi::query("select currval('udr_zapis_poruchy_id_seq')")->fetchSingle();                
        }
        else{
            dibi::query('UPDATE udr_zapis_poruchy SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
        }

        $r['data'] = $this->Get($id);

        return $r;
    }


    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("DELETE FROM udr_zapis_poruchy where id=%i", $id);
        }
        return $r;
    }


      
    /** @callable  */
    public function Get($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*,
                                to_char(a.od, 'HH24:MI') s_od,  
                                to_char(a.do, 'HH24:MI') s_do,  
                                to_char(a.datum, 'YYYY-MM-DD') || 'T00:00:00.000Z' s_datum, 
                                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                                to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno, 
                                to_char(a.vytvoreno, 'DD.MM.YYYY HH24:MI:SS') vytvoreno,
                                p.kod porucha_kod, 
                                p.nazev porucha,
                                z.kod zdroj_kod,
                                z.nazev zdroj
                                FROM udr_zapis_poruchy a 
                                LEFT JOIN cis_poruchy p ON a.porucha_id = p.id
                                LEFT JOIN cis_zdroj z ON a.zdroj_id = z.id
                                WHERE a.id=%i", $id);

            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 
                           'datum' => $p['s_datum'],
                           'od'=>$p['s_od'], 
                           'do'=>$p['s_do'], 
                           'porucha_id' => $p['porucha_id'],
                           'porucha_kod' => $p['porucha_kod'],
                           'porucha' => $p['porucha'],
                           'zdroj' => $p['zdroj'],
                           'zdroj_kod' => $p['zdroj_kod'],
                           'zdroj_id' => $p['zdroj_id'],
                           'stav'=>$p['stav'], 
                           'priloha_hash' => $p['priloha_hash'],
                           'poznamka'=>$p['poznamka'], 
                           'zmeneno'=>$p['zmeneno'], 
                           'zmenil'=>$p['zmenil'],
                           'vytvoreno'=>$p['vytvoreno'], 
                           'vytvoril'=>$p['vytvoril']
                        ]; 
        }
        else{

            $r = (object) [
                    'id'=> -1,
                    'datum'=>  $this->getToday(),
                    'od'=>'',
                    'do'=>'',
                    'stav'=> 0,
                    'porucha_id'=> -1,
                    'porucha_kod'=> '',
                    'porucha'=> '',
                    'zdroj_id'=> -1,
                    'zdroj_kod'=> '',
                    'zdroj'=> '',
                    'poznamka'=> '', 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
                    'vytvoreno'=> '', 
                    'vytvoril'=> '',
                    'priloha_hash'=> 'udrzba/porucha/'.time().'-'.rand(0, 100)
            ]; 
        }
        
        return $r;
    }


   
    
}