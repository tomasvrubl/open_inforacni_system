<?php

namespace ws\Tavirna;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class TavirnaController extends BaseController
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
        $table = "( SELECT a.id, a.nazev, a.platnost, a.externi_kod, a.poznamka, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM tavirna_jakost a WHERE id > -1) X ";

        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $nazev = sanitize($rec['nazev']);
        $kod = sanitize($rec['externi_kod']);
        $poznamka = sanitize($rec['poznamka']);        
        $platnost = $rec['platnost'] == 1 ? true : false;
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else{

            $a = [ 'nazev' => $nazev, 'externi_kod' => $kod, 'poznamka'=> $poznamka, 
                    'priloha_hash' => sanitize($rec['priloha_hash']),
                    'zmeneno' => $this->getNow(),
                    'zmenil' => $this->getUserID(),'platnost'=>$platnost];

            if($id < 0){
                dibi::query('INSERT INTO tavirna_jakost', $a);
                $id = dibi::query("select currval('tavirna_jakost_id_seq')")->fetchSingle();                
            }
            else{
                dibi::query('UPDATE tavirna_jakost SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';

                $this->UpdateSlozeni($rec['slozeni']);
            }

            $r['data'] = (object) $this->GetJakost($id);                  
        }

        return $r;
    }


    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("DELETE FROM tavirna_jakost WHERE id=%i", $id);
        }
        return $r;
    }


      
    /** @callable  */
    public function GetJakost($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*,
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     from tavirna_jakost a where id=%i", $id);

            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'nazev'=>$p['nazev'], 
                           'externi_kod'=>$p['externi_kod'], 'platnost'=>$p['platnost'],
                           'slozeni'=> $this->getSlozeni($p['id']),
                           'priloha_hash' => $p['priloha_hash'],
                           'poznamka'=>$p['poznamka'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{

            $r = (object) [
                    'id'=> -1,
                    'nazev'=> '',
                    'poznamka'=> '',
                    'externi_kod'=> '',
                    'platnost'=> true, 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
                    'slozeni'=> [],
                    'priloha_hash'=> 'tavirna/jakost/'.time().'-'.rand(0, 100)
            ]; 
        }
        
        return $r;
    }



    /** @callable  */
    public function AddKartaSlozeni($jakostid=-1, $lst = [])
    {
        $r = ['kod'=> 0, 'nazev' => 'Karty přidány', 'data'=> null];

        
        foreach($lst as $r){

            try{

                $a = [
                    'jakost_id'=> intval($jakostid),
                    'karta_id' => intval($r['karta_id']),
                    'jednotka_id' => intval($r['jednotka_id']),
                    'zmeneno' => $this->getNow(),
                    'zmenil' => $this->getUserID()
                ];

                dibi::query('INSERT INTO tavirna_jakost_slozeni', $a);

            }catch(Exception $ex){}            
        }

        $r['data'] = $this->getSlozeni($jakostid);

        return $r;
    }



    /** @callable  */
    public function GetSlozeni($jakostid = -1){

        $r = [];

        if($jakostid > 0){
        
            $dt = dibi::query("SELECT a.*, j.kod jednotka_kod, j.nazev jednotka_nazev, k.kod karta_kod, k.nazev karta_nazev,
                                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                                to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                                FROM tavirna_jakost_slozeni a LEFT JOIN sk_karta k ON a.karta_id = k.id LEFT JOIN cis_merne_jednotky j ON a.jednotka_id = j.id
                                WHERE a.jakost_id=%i ORDER BY k.nazev ASC", $jakostid);

            foreach($dt->fetchAll() as $p) {

                $r[] = (object) [
                    'id'=> $p['id'],
                    'jakost_id'=> $p['jakost_id'], 
                    'jednotka_id'=> $p['jednotka_id'], 
                    'jednotka_kod'=> $p['jednotka_kod'], 
                    'jednotka_nazev'=> $p['jednotka_nazev'], 
                    'karta_id'=>  $p['karta_id'],
                    'karta_kod'=>  $p['karta_kod'],
                    'karta_nazev'=>  $p['karta_nazev'],
                    'platnost'=> $p['platnost'],
                    'zmeneno'=> $p['zmeneno'], 
                    'zmenil'=> $p['zmenil']
                ];

            }

        }
            
        return $r;
    }

    protected function UpdateSlozeni($lst=[]){

        foreach($lst as $l){        
            dibi::query('UPDATE tavirna_jakost_slozeni SET ', ['platnost' => $l['platnost'], 
                                                                'zmeneno' => $this->getNow(), 
                                                                'zmenil' => $this->getUserID(),            
                                                                'jednotka_id'=> $l['jednotka_id']], ' WHERE id=%i', $l['id']);
        }

        return $lst;

    }


    /** @callable  */
    public function DropSlozeni($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("DELETE FROM tavirna_jakost_slozeni where id=%i", $id);
        }
        return $r;
    }

   
    
}