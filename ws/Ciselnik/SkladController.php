<?php

namespace ws\Ciselnik;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class SkladController extends BaseController
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
        
        $table = "( SELECT a.id, a.kod, a.extern_kod, a.nazev, a.platnost,  to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM [sk_sklad] a) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }

    
    /** @callable  */
    public function getKartaTable($tabquery=null)
    {
        
        $table = "( SELECT  a.id, s.nazev as sklad, a.sklad_id, a.kod, a.extern_kod, a.nazev, a.mnozstvi, a.jednotka_id, a.jednotka2_id,
                    coalesce((select nazev from cis_merne_jednotky where id =  a.jednotka_id), '') as jednotka, 
                    coalesce((select nazev from cis_merne_jednotky where id =  a.jednotka2_id), '') as jednotka2, 
                    a.platnost, a.mnozstvi2, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM sk_karta a LEFT JOIN sk_sklad s ON a.sklad_id = s.id) X ";
       
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
        $extern_kod = sanitize($rec['extern_kod']);
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

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'extern_kod'=> $extern_kod, 'zmenil' => $this->user->getId(),'platnost'=>$platnost];

            if($id < 0){
                dibi::query('insert into [sk_sklad]', $a);
                $id = dibi::query("select currval('sk_sklad_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [sk_sklad] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getSklad($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [sk_sklad] where id=%i", $id);
        }
        return $r;
    }

    /** @callable  */
    public function getSkladList(){
        
        $r = [];       
        $dt = dibi::query("select a.*, 
                 coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                 to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                 from sk_sklad a order by nazev asc");            

        foreach($dt->fetchAll() as $p){
            $r[] = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'extern_kod'=>$p['extern_kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']];                 
        }

        return $r;
    }
    
    
    /** @callable  */
    public function getSklad($id){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     from [sk_sklad] a where id=%i", $id);            
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'extern_kod'=>$p['extern_kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'extern_kod'=> '', 
                    'nazev'=> '',
                    'platnost'=> true, 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }
    
        /** @callable  */
    public function getKarta($id){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*, m1.kod jednotka_kod, m1.nazev jednotka_nazev, 
                     m2.kod jednotka2_kod, m2.nazev jednotka2_nazev,
                     coalesce((select nazev from sk_sklad s where s.id = a.sklad_id), '') as sklad_nazev,
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     FROM sk_karta a LEFT JOIN cis_merne_jednotky m1 ON a.jednotka_id = m1.id LEFT JOIN cis_merne_jednotky m2 ON a.jednotka2_id = m2.id
                     WHERE a.id=%i", $id);            
            $p = $dt->fetch();
            

            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'extern_kod'=>$p['extern_kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'mnozstvi'=>$p['mnozstvi'], 'mnozstvi2'=>$p['mnozstvi2'], 'jednotka_id'=>$p['jednotka_id'], 'jednotka2_id'=>$p['jednotka2_id'],
                           'jednotka2_kod'=>$p['jednotka2_kod'],  'jednotka2_nazev'=>$p['jednotka2_nazev'],
                           'jednotka_kod'=>$p['jednotka_kod'],  'jednotka_nazev'=>$p['jednotka_nazev'],
                           'sklad_nazev'=>$p['sklad_nazev'], 'sklad_id'=>$p['sklad_id'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'sklad_id'=> -1,
                    'kod'=> '', 
                    'extern_kod'=> '', 
                    'nazev'=> '',
                    'mnozstvi'=> 0,
                    'jednotka_id'=> -1,
                    'jednotka_kod'=> '',
                    'jednotka_nazev'=> '',
                    'mnozstvi2'=> 0,
                    'jednotka2_id'=> -1,                
                    'jednotka2_kod'=> '',
                    'jednotka2_nazev'=> '',
                    'platnost'=> true,                    
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }
    
    
    /** @callable  */
    public function AddKarta($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $sklad_id = intval($rec['sklad_id']);
        $nazev = sanitize($rec['nazev']);
        $kod = sanitize($rec['kod']);
        $extern_kod = sanitize($rec['extern_kod']);
        $platnost = $rec['platnost'] == 1 ? true : false;
        
        $mnozstvi = intval($rec['mnozstvi']);
        $mnozstvi2 = intval($rec['mnozstvi2']);
        
        $jednotka_id = intval($rec['jednotka_id']);
        $jednotka2_id = intval($rec['jednotka2_id']);
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název skladu je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný!';
        }
        else{
            
            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'extern_kod'=> $extern_kod, 'zmenil' => $this->user->getId(), 'platnost'=>$platnost,
                   'jednotka_id'=>$jednotka_id, 'jednotka2_id'=>$jednotka2_id, 'sklad_id'=>$sklad_id];

            if($id < 0){
                
                if(is_array($rec['_sklad']) && count($rec['_sklad']) > 0){
                    
                    foreach($rec['_sklad'] as $s){
                        
                        $a['sklad_id'] = intval($s['id']);                        
                        dibi::query('insert into [sk_karta]', $a);
                        $id = dibi::query("select currval('sk_sklad_seq')")->fetchSingle();  
                    }
                    
                }
                else if($sklad_id < 0){
                    $r['kod'] = 1;
                    $r['nazev'] = 'Není definovaný sklad, do kterého založit kartu!';
                }
                else{
                    dibi::query('insert into [sk_karta]', $a);
                    $id = dibi::query("select currval('sk_sklad_seq')")->fetchSingle();                    
                }
                
            }
            else{
                dibi::query('UPDATE [sk_karta] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getKarta($id);                  
        }

        return $r;
    }
}