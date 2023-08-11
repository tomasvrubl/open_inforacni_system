<?php

namespace ws\Vyroba;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;

/** @controller */
class OdvadeniController
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
        
        $table = "( SELECT a.id, to_char(a.datum, 'DD.MM.YYYY HH24:MI') datum,
                    a.osoba, a.zakazka_vyrobek, a.zakazka_id, a.shodne_ks, a.neshodne_ks,
                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select kod from cis_vady u where u.id = a.cis_vady_id), '') as vada_kod,
                    coalesce((select nazev from cis_zdroj u where u.id = a.zdroj_id), '') as zdroj,
                    coalesce((select nazev from cis_pracoviste u where u.id = (select pracoviste_id from cis_zdroj z where z.id = a.zdroj_id)), '') as pracoviste,                    
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM [vyr_odvadeni] a) X ";
       
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
        $platnost = $rec['platnost'] == 1 ? true : false;
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný';
        }
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'zmenil' => $this->user->getId(),'platnost'=>$platnost];

            if($id < 0){
                dibi::query('insert into [cis_merne_jednotky]', $a);
                $id = dibi::query("select currval('merne_jednotky_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [cis_merne_jednotky] SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("delete from [cis_merne_jednotky] where id=%i", $id);
        }
        return $r;
    }

    

    /** @callable  */
    public function Get($id){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     from [cis_merne_jednotky] a where id=%i", $id);            
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'nazev'=> '',
                    'platnost'=> true, 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }
}