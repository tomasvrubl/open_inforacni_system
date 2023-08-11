<?php

namespace ws\Person;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;


/** @controller */
class OdmenaController extends BaseController
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
        
        $table = "( select o.id, to_char(o.datum, 'DD.MM.YYYY') datum, 
        coalesce(os.oscislo, '') oscislo, coalesce( os.prijmeni || ' ' || os.jmeno  , '') osoba, o.castka, 
        coalesce((select kod from cis_pracoviste u where u.id = os.cis_pracoviste_id), '') as pracoviste_kod, o.poznamka, o.vyplaceno, 
         coalesce( v.prijmeni || ' ' || v.jmeno  , '') vyplatil, o.zmeneno, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = o.zmenil), '') as zmenil
         from pers_odmeny o left join osoba os on o.osoba_id = os.id left join osoba v on o.vyplatil = v.id) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $osid = intval($rec['osoba_id']);
        $castka = intval($rec['castka']);
        $poznamka = sanitize($rec['poznamka']);
        $datum = $this->sanitizeDate($rec['datum']);

        
        if($osid < 1){
            $r['kod'] = 1;
            $r['nazev'] = 'Není zadána osoba';
        }        
        else{

            $a = [ 'osoba_id' => $osid, 'castka' => $castka,              
                 'zmenil' => $this->getUserID(), 
                 'zmeneno'=> $this->getNow(), 'datum'=>$datum];

            if($id < 0){
                dibi::query('insert into [pers_odmeny]', $a);
                $id = dibi::query("select currval('pers_odmeny_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [pers_odmeny] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->Get($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [pers_odmeny] where id=%i", $id);
        }
        return $r;
    }

    /** @callable  */
    public function Vyplatit($rec){

        $r = ['kod'=> 0, 'nazev' => 'Záznam aktualizován', 'data'=> null];

        $id = intval($rec['id']);

        $userid= $this->user->getId();

        dibi::query("update [pers_odmeny] set vyplatil=%i, vyplaceno=now() where id=%i", $userid, $id);

        $r['data'] = $this->Get($id);

        return $r;
    }

    /** @callable  */
    public function Get($id){
        
        
        if($id > -1){
            $dt = dibi::query("select a.id, a.poznamka, a.osoba_id, a.castka, os.oscislo, os.prijmeni || os.jmeno as osoba_osoba,
                    to_char(a.datum, 'YYYY-MM-DD') || 'T00:00:00.000Z' s_datum, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.vyplatil), '') as s_vyplatil, 
                     coalesce(to_char(a.vyplaceno, 'DD.MM.YYYY HH24:MI:SS'), '') s_vyplaceno 
                     from [pers_odmeny] a left join [osoba] os on a.osoba_id = os.id where a.id=%i", $id);      
                     
                     
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'datum'=>$p['s_datum'], 'osoba_id'=>$p['osoba_id'], 
                            'osoba_osoba' => $p['osoba_osoba'], 'osoba_oscislo'=> $p['oscislo'],
                            'castka'=>$p['castka'],'poznamka'=>$p['poznamka'], 'vyplaceno'=>$p['s_vyplaceno'], 
                            'vyplatil'=>$p['s_vyplatil'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{

            $r = (object) [
                'id'=> -1,
                'datum' => $this->getToday(),
                'osoba_id'=> -1, 
                'osoba_osoba'=> '', 
                'osoba_oscislo'=> '', 
                'castka'=> 0,
                'poznamka'=> '',
                'zmeneno'=> '', 
                'zmenil'=> '',
                'vyplaceno'=> '',
                'vyplatil'=> ''
            ]; 
        }
        
        
        return $r;
    }
}