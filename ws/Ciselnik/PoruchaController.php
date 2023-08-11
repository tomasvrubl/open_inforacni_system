<?php

namespace ws\Ciselnik;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class PoruchaController extends BaseController
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
        
        $table = "( SELECT a.id, a.kod, a.nazev, a.platnost,  to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM cis_poruchy a) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


    /** @callable  */
    public function getRelZdrojTable($tabquery=null)
    {
        
        $table = "( SELECT c.id, z.kod, z.nazev, z.platnost, z.poznamka, z.zmeneno,
                        coalesce((select nazev from kalendar k where k.id = z.kalendar_id), '') as kalendar,
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = z.zmenil), '') as zmenil,
                        c.porucha_id porucha_id, z.id zdroj_id
                        FROM cis_zdroj z INNER JOIN cis_poruchy_zdroj c ON z.id = c.zdroj_id) X ";
        
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function getRelPoruchaTable($tabquery=null)
    {
        
        $table = "( SELECT c.id, p.kod, p.nazev, p.platnost, p.poznamka, p.zmeneno,
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = p.zmenil), '') as zmenil,
                        c.porucha_id porucha_id, c.zdroj_id zdroj_id
                        FROM cis_poruchy p INNER JOIN cis_poruchy_zdroj c ON p.id = c.porucha_id) X ";
        
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
                dibi::query('INSERT INTO cis_poruchy', $a);
                $id = dibi::query("SELECT currval('cis_poruchy_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE cis_poruchy SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("DELETE FROM cis_poruchy where id=%i", $id);
        }
        return $r;
    }
    
    
  

    /** @callable  */
    public function Get($id){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     FROM cis_poruchy a WHERE id=%i", $id);            
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


    /** @callable  */
    public function unlinkPoruchaZdroj($id=-1){
    
        $r = ['kod'=> 0, 'nazev' => 'Zdroj odpárován od poruchy.', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("DELETE FROM cis_poruchy_zdroj WHERE id=%i", $id);
        }
        else{
            $r['kod'] = 1;
            $r['nazev'] = 'Nelze odlinkovat zdroj, id je -1';
        }
        
        return $r;        
    }
    
    /** @callable  */
    public function linkPoruchaZdroj($id=-1, $list=array()){
        
        $r = ['kod'=> 0, 'nazev' => 'Zdroje napárovány k poruše', 'data'=> null];
        $id = intval($id);


        if(count($list) > 0 && $id > -1){     
            
            $a = [
                'porucha_id'=> $id, 
                'zmenil' => $this->user->getId(),
                'zdroj_id' => -1
            ];

            foreach($list as $l){
                $a['zdroj_id'] = intval($l['id']);
                dibi::query("INSERT INTO cis_poruchy_zdroj", $a);
            }

        }
        else{
            $r['kod'] = 1;
            $r['nazev'] = 'Nelze napárovat zdroje k prouše. Zdroj nebo porucha není definována.';
        }
        
        return $r;        
    }


        /** @callable  */
        public function linkZdrojPorucha($id=-1, $list=array()){
        
            $r = ['kod'=> 0, 'nazev' => 'Poruchy napárovány ke zdroji', 'data'=> null];
            $id = intval($id);
    
    
            if(count($list) > 0 && $id > -1){     
                
                $a = [
                    'zdroj_id'=> $id, 
                    'zmenil' => $this->user->getId(),
                    'porucha_id' => -1
                ];
    
                foreach($list as $l){
                    $a['porucha_id'] = intval($l['id']);
                    dibi::query("INSERT INTO cis_poruchy_zdroj", $a);
                }
    
            }
            else{
                $r['kod'] = 1;
                $r['nazev'] = 'Nelze napárovat poruchu ke zdroji. Zdroj nebo porucha není definována.';
            }
            
            return $r;        
        }
        
}