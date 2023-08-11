<?php

namespace ws\Vyroba;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;



/** @controller */
class ZarazeniController extends BaseController
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
        
        $table = "( SELECT a.id, a.kod, a.nazev, a.platnost,  
                    coalesce((select nazev from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste,
                    coalesce((select kod from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste_kod,
                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM cis_pracovni_zarazeni a) X ";
       
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
        $pracoviste_id = intval($rec['pracoviste_id']);

        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný';
        }
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'zmenil' => $this->user->getId(), 'platnost'=>$platnost, 'pracoviste_id'=>$pracoviste_id, 'zmeneno'=> $this->getNow()];

            if($id < 0){
                dibi::query('INSERT INTO cis_pracovni_zarazeni', $a);
                $id = dibi::query("SELECT currval('cis_pracovni_zarazeni_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE cis_pracovni_zarazeni SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("UPDATE FROM cis_pracovni_zarazeni SET platnost=0 where id=%i", $id);
        }
        return $r;
    }
 

    /** @callable  */
    public function Get($id=-1){

        /**
          export class VyrZarazeni {
                public id: number = -1;
                public kod: string = '';
                public nazev : string = '';
                public platnost: boolean = true;
                public pracoviste_id: number = -1;
                public pracoviste_kod: string = '';
                public pracoviste: string = '';
                public zmeneno: string = '';
                public zmenil: string = ''; 
            }
         */

        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*, 
                     coalesce((select kod from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste_kod, 
                     coalesce((select nazev from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     FROM cis_pracovni_zarazeni a WHERE id=%i", $id);            
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'pracoviste_id'=>$p['pracoviste_id'], 'pracoviste_kod'=>$p['pracoviste_kod'], 'pracoviste'=>$p['pracoviste'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'nazev'=> '',
                    'platnost'=> true, 
                    'pracoviste_id'=> -1,
                    'pracoviste_kod'=> '',
                    'pracoviste'=> '',
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }

    /** @callable  */
    public function GetZarazeniList($zdrojid=-1, $pracovisteid=-1){

        $r = [];

        if($zdrojid > -1){
            $dt = dibi::query("SELECT id, nazev, kod FROM cis_pracovni_zarazeni WHERE platnost=true and pracoviste_id  in (SELECT pracoviste_id FROM cis_zdroj WHERE id=%i)", $zdrojid);
        }
        else{
            $dt = dibi::query("SELECT id, nazev, kod FROM cis_pracovni_zarazeni WHERE platnost=true and pracoviste_id=%i", $pracovisteid);
        }


        foreach($dt->fetchAll() as $d){
            $r[] = ['id'=> $d['id'], 'nazev'=> $d['nazev'], 'kod'=>$d['kod']];
        }

        return $r;

    }
}