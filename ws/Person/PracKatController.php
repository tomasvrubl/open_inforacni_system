<?php

namespace ws\Person;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class PracKatController extends BaseController
{

    /** @callable  */
    public function getTable($tabquery=null)
    {
        
        $table = "( SELECT a.id, a.kod, a.nazev, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM pers_prac_zarazeni a) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $nazev = sanitize($rec['nazev']);
        $kod = sanitize($rec['kod']);
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný';
        }
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'zmeneno'=>'now()', 'zmenil' => $this->user->getId()];

            if($id < 0){
                dibi::query('INSERT INTO pers_prac_zarazeni', $a);
                $id = dibi::query("SELECT currval('pers_prac_zarazeni_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE pers_prac_zarazeni SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("DELETE FROM pers_prac_zarazeni where id=%i", $id);
        }
        return $r;
    }
    

    /** @callable  */
    public function Get($id){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     FROM pers_prac_zarazeni a WHERE id=%i", $id);            
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'nazev'=> '',
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }

    /** @callable  */
    public function GetCBO(){

        $dt = dibi::query("SELECT kod, nazev, id FROM  pers_prac_zarazeni order by nazev asc");

        $lst = [];
        foreach($dt as $d){
            $lst[] = (object) ['value'=> $d['id'], 'label'=> $d['nazev']];
        }

        return $lst;
    }
        

}