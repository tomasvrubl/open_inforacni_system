<?php

namespace ws\Ciselnik;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class HlaseniController extends BaseController
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
    public function getTableHlaseniTyp($tabquery=null)
    {
        
        $table = "( SELECT a.id, a.kod, a.nazev, a.platnost, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM [gl_hlaseni_typ] a WHERE id > -1) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


    /** @callable  */
    public function addHlaseniTyp($rec)
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
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'zmenil' => $this->user->getId(),'platnost'=>$platnost];

            if($id < 0){
                dibi::query('insert into [gl_hlaseni_typ]', $a);
                $id = dibi::query("select currval('gl_hlaseni_typ_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [gl_hlaseni_typ] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getHlaseniTyp($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function dropHlaseniTyp($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [gl_hlaseni_typ] where id=%i", $id);
        }
        return $r;
    }
    
    
    /** @callable  */
    public function GetHlaseniTypList(){
        
        $r = [];        
        $dt = dibi::query("select id, nazev from [gl_hlaseni_typ] WHERE platnost=true order by nazev asc")->fetchAll();            
        
        foreach($dt as $d){
            $r[] = ['id'=> $d['id'], 'nazev'=>$d['nazev']];
        }
        
        return $r;
    }
    

    /** @callable  */
    public function getHlaseniTyp($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     from [gl_hlaseni_typ] a where id > -1 and id=%i", $id);            
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
    public function GetHlaseni($stav= []){
        $r = [];        
        
        $q_stav =  "";
        foreach($stav as $s){
            $q_stav = intval($s).",";
        }
        
        $q_stav = rtrim($q_stav, ",");
        
        
        $dt = dibi::query("SELECT v.*, to_char(v.vytvoreno, 'DD.MM.YYYY HH24:MI:SS') s_vytvoreno, 
                            to_char(v.prevzato, 'DD.MM.YYYY HH24:MI:SS') s_prevzato,
                            to_char(v.uzavreno, 'DD.MM.YYYY HH24:MI:SS') s_uzavreno,
                            coalesce((select prijmeni || jmeno from osoba o where o.id = v.prevzal), '') s_prevzal,
                            coalesce((select prijmeni || jmeno from osoba o where o.id = v.vytvoril), '') s_vytvoril,
                            coalesce((select prijmeni || jmeno from osoba o where o.id = v.uzavrel), '') s_uzavrel,
                            coalesce((select nazev from cis_zdroj z where z.id = v.zdroj_id), '') zdroj,
                            coalesce((select nazev from cis_pracoviste z where z.id = v.pacoviste_id), '') pracoviste,
                            coalesce((select nazev from gl_hlaseni_typ t where t.id = v.typ), '') s_typ
                            FROM gl_hlaseni_vyroba v
                            WHERE stav in ({$q_stav}) ORDER BY vytvoreno DESC")->fetchAll();            
        
        foreach($dt as $d){
            $r[] = [
                'id' => $d['id'],
                'stav' => $d['stav'],   // 0 - VYTVORENO, 1 - PREVZATO, 2 - UZVRENO 
                'typ_s' => $d['s_typ'],
                'typ' => $d['typ'],
                'text' => $d['text'],
                'prevzato' => $d['s_prevzato'],
                'prevzal' => $d['s_prevzal'],
                'vytvoreno' => $d['s_vytvoreno'],
                'vytvoril' => $d['s_vytvoril'],
                'uzavreno' => $d['s_uzavreno'],
                'uzavrel' => $d['s_uzavrel'],
                'uzavreno_duvod' => $d['uzavreno_duvod'],
                'zdroj_id' => $d['zdroj_id'],
                'zdroj' => $d['zdroj'],
                'pacoviste_id' => $d['pracoviste_id'],
                'pracoviste' => $d['pracoviste']
            ];
        }
        
        return $r;
    }

     /** @callable  */
     public function Add($rec)
     {
         $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
 
         $id = intval($rec['id']);
         $nazev = sanitize($rec['text']);
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
}