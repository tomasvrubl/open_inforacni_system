<?php

namespace ws\Ciselnik;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class ZdrojController extends BaseController
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
        
        $table = "( SELECT a.id, a.kod, a.nazev, a.platnost, a.poznamka, a.kalendar_id, a.pracoviste_id, a.zmeneno, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     coalesce((select nazev from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste,
                     coalesce((select nazev from kalendar k where k.id = a.kalendar_id), '') as kalendar
                     FROM cis_zdroj a) X ";
       
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
        $poznamka = sanitize($rec['poznamka']);        
        $platnost = $rec['platnost'] == 1 ? true : false;
        
        $prac_id = intval($rec['pracoviste_id']);
        $vyr_cal = intval($rec['kalendar_id']);

        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný';
        }
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'poznamka'=> $poznamka, 'zmenil' => $this->user->getId(),'platnost'=>$platnost, 
                    'pracoviste_id' => $prac_id, 'kalendar_id' => $vyr_cal, 'zmeneno'=> $this->getNow()];

            if($id < 0){
                dibi::query('insert into [cis_zdroj]', $a);
                $id = dibi::query("select currval('zdroj_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [cis_zdroj] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getZdroj($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [cis_zdroj] where id=%i", $id);
        }
        return $r;
    }

    /** @callable  */
    public function getZdrojList($pid=-1){
        
        $r = [];
        
        if($pid < 0){
            return $r;
        }
        
        $d = dibi::query("select id, kod, nazev, platnost, kalendar_id, pracoviste_id, 
                 coalesce((select kod from cis_pracoviste k where k.id = pracoviste_id), '') as pracoviste_kod 
                 from [cis_zdroj] where platnost=true and pracoviste_id=%i", $pid)
                ->fetchAll();
        
        foreach($d as $p){            
             $r[] = (object) ['id'=> $p['id'], 
                            'kod'=>$p['kod'], 
                            'nazev'=>$p['nazev'], 
                            'platnost'=>$p['platnost'],
                            'pracoviste_kod'=> $p['pracoviste_kod'], 
                            'pracoviste_id'=> $p['pracoviste_id'], 
                            'kalendar_id' => $p['kalendar_id']];               
        }
        
        return $r;
    }
    
    
    /** @callable  */
    public function getZdroj($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                        coalesce((select kod from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste_kod, 
                        coalesce((select nazev from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste, 
                        coalesce(k.nazev, '') as kalendar, 
                        coalesce(k.kod, '') as kalendar_kod, 
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                        to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                        from cis_zdroj a left join kalendar k on a.kalendar_id = k.id where a.id=%i", $id);
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                'pracoviste_kod'=> $p['pracoviste_kod'], 'pracoviste_id'=> $p['pracoviste_id'], 'kalendar_id' => $p['kalendar_id'],
                'kalendar' => $p['kalendar'], 'kalendar_kod' => $p['kalendar_kod'], 'pracoviste'=>$p['pracoviste'],
                'poznamka'=>$p['poznamka'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'nazev'=> '',
                    'poznamka'=> '', 
                    'platnost'=> true, 
                    'pracoviste_kod'=> '',
                    'pracoviste_id'=> -1,
                    'kalendar_id'=> 0,
                    'kalendar_kod'=> '',
                    'kalendar'=> '',
                    'pracoviste'=> '',
                    'kalendar'=> '',  
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }


    /** @callable  */
    public function getZdrojByKod($kod = ''){
        
        
            $dt = dibi::query("select a.*, 
                        coalesce((select kod from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste_kod, 
                        coalesce((select nazev from cis_pracoviste p where p.id = a.pracoviste_id), '') as pracoviste, 
                        coalesce(k.nazev, '') as kalendar, 
                        coalesce(k.kod, '') as kalendar_kod, 
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                        to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                        from cis_zdroj a left join kalendar k on a.kalendar_id = k.id where a.kod=%s", $kod);
            $p = $dt->fetch();
    
        
            if($p){
                $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                    'pracoviste_kod'=> $p['pracoviste_kod'], 'pracoviste_id'=> $p['pracoviste_id'], 'kalendar_id' => $p['kalendar_id'],
                    'kalendar' => $p['kalendar'], 'kalendar_kod' => $p['kalendar_kod'], 'pracoviste'=>$p['pracoviste'],
                    'poznamka'=>$p['poznamka'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
            }
            else{
                
                $r = (object) [
                        'id'=> -1,
                        'kod'=> '', 
                        'nazev'=> '',
                        'poznamka'=> '', 
                        'platnost'=> true, 
                        'pracoviste_kod'=> '',
                        'pracoviste_id'=> -1,
                        'kalendar_id'=> 0,
                        'kalendar_kod'=> '',
                        'kalendar'=> '',
                        'pracoviste'=> '',
                        'kalendar'=> '',  
                        'zmeneno'=> '', 
                        'zmenil'=> '',
                ]; 
            }
            
            
            return $r;
        }
}