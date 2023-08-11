<?php

namespace ws\Udrzba;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class VykazPraceController extends BaseController
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
        $table = "(SELECT a.*, coalesce((select nazev from udr_zapis_poruchy p where p.id = a.zapis_poruchy_id), '') porucha,
                            coalesce((select string_agg(osoba, ', ' ORDER BY osoba) from udr_vykaz_prace_osoba p where p.vykaz_prace_id = a.id), '') osoba,
                            coalesce((select string_agg(zdroj, ', ' ORDER BY zdroj) from udr_vykaz_prace_zdroj p where p.vykaz_prace_id = a.id), '') zdroj,
                        to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                        FROM udr_vykaz_prace a WHERE id > -1) X ";

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
            dibi::query("DELETE FROM udr_vykaz_prace_zdroj where vykaz_prace_id=%i", $id);
            dibi::query("DELETE FROM udr_vykaz_prace_osoba where vykaz_prace_id=%i", $id);
            dibi::query("DELETE FROM udr_vykaz_prace where id=%i", $id);
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
                                to_char(a.vytvoreno, 'DD.MM.YYYY HH24:MI:SS') vytvoreno
                                FROM udr_vykaz_prace a 
                                WHERE a.id=%i", $id);

            $p = $dt->fetch();

            $pid = $p['porucha_id'];

            $poruchyController = new PoruchyController();

            $r = (object) ['id'=>$p['id'], 
                           'datum' => $p['s_datum'],
                           'od'=>$p['s_od'], 
                           'do'=>$p['s_do'], 
                           'porucha_id' => $pid,
                           'porucha' => $pid > 0 ? $poruchyController->Get($pid) : null,
                           'priloha_hash' => $p['priloha_hash'],
                           'poznamka'=>$p['poznamka'], 
                           'zmeneno'=>$p['zmeneno'], 
                           'zmenil'=>$p['zmenil'],
                           'vytvoreno'=>$p['vytvoreno'], 
                           'vytvoril'=>$p['vytvoril'],
                           'zdroj' => $this->getVykazZdroje($p['id']),
                           'osoba' => $this->getVykazOsoby($p['id']),
                        ]; 
        }
        else{

            $r = (object) [
                    'id'=> -1,
                    'datum'=>  $this->getToday(),
                    'od'=>'',
                    'do'=>'',
                    'porucha_id'=> -1,
                    'porucha'=> null,
                    'zdroj' => [],
                    'osoba'=> [ ['id'=> -1, 'vykaz_prace_id'=> -1, 'osoba'=> $this->getPrijmeniJmeno(), 'osoba_oscislo'=> $this->getOsobniCislo()]],
                    'poznamka'=> '', 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
                    'vytvoreno'=> '', 
                    'vytvoril'=> '',
                    'priloha_hash'=> 'udrzba/vykaz/'.time().'-'.rand(0, 100)
            ]; 
        }
        
        return $r;
    }


    function getVykazOsoby($id=-1){

        $r = [];

        return $r;
    }


    function getVykazZdroje($id=-1){

        $r = [];

        return $r;
    }

}