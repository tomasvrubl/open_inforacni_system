<?php

namespace ws\Ciselnik;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class PracovisteController extends BaseController
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
        $table = "(SELECT a.id, a.kod, a.nazev, a.platnost, a.poznamka, a.kalendar_id, a.zmeneno, 
                 coalesce((select nazev from kalendar k where k.id = a.kalendar_id), '') as kalendar,
                 coalesce((select kod from kalendar k where k.id = a.kalendar_id), '') as kalendar_kod,
                 coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                 FROM cis_pracoviste a) X";
       
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

        $kalendar_id = intval($rec['kalendar_id']);

        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný';
        }
        else{

            $a = [ 'nazev' => $nazev,                    'kalendar_id' => $kalendar_id,
                   'kod' => $kod, 'poznamka'=> $poznamka, 'zmenil' => $this->user->getId(),'platnost'=>$platnost];

            if($id < 0){
                dibi::query('insert into [cis_pracoviste]', $a);
                $id = dibi::query("select currval('pracoviste_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [cis_pracoviste] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getPracoviste($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [cis_pracoviste] where id=%i", $id);
        }
        return $r;
    }

    /** @callable  */
    public function searchPracoviste($kod, $max=10)
    {
        $kod = sanitize($kod);

        $r = array();
        $dt = dibi::query("select id, kod, nazev from [cis_pracoviste] a WHERE platnost=true and kod like %s ORDER BY nazev asc limit 0, %i", $kod, $max);
        
        foreach($dt as $d){
            
            $r[] = (object) [
                'id'=> $d['id'],
                'kod'=> $d['kod'], 
                'nazev'=> $d['nazev']
            ]; 
        }
        
        return $r;        
        
    }

    
    /** @callable  */
    public function getPracoviste($id){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, "
                    . " coalesce((select nazev from kalendar k where k.id = a.kalendar_id), '') as kalendar, "
                    . " coalesce((select kod from kalendar k where k.id = a.kalendar_id), '') as kalendar_kod, "
                    . " coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, "
                    . " to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno "
                    . " from cis_pracoviste a where id=%i", $id);
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                'kalendar'=> $p['kalendar'], 'kalendar_kod'=> $p['kalendar_kod'], 'kalendar_id'=> $p['kalendar_id'],
                'poznamka'=>$p['poznamka'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'nazev'=> '',
                    'poznamka'=> '', 
                    'platnost'=> true, 
                    'kalendar_id'=> -1,
                    'kalendar' => '',
                    'kalendar_kod' => '',
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }
    
    
    /** @callable  */
    public function unlinkPracovisteZdroj($id=-1){
        
        $r = ['kod'=> 0, 'nazev' => 'Zdroj odpárován od pracoviště.', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("update [cis_zdroj] set pracoviste_id=-1 where id=%i", $id);
        }
        else{
            $r['kod'] = 1;
            $r['nazev'] = 'Nelze odlinkovat zdroj, id zdroje je -1';
        }
        
        return $r;        
    }
    
    /** @callable  */
    public function linkPracovisteZdroj($id=-1, $list=array()){
        
        $r = ['kod'=> 0, 'nazev' => 'Zdroje napárovány k pracovišti', 'data'=> null];
        $id = intval($id);
        
        $lst = "";
        
        foreach($list as $l){            
            $lst .= intval($l['id']).",";            
        }
        
        if(strlen($lst) > 0 && $id > -1){            
            $lst = rtrim($lst, ",");            
            dibi::query("update [cis_zdroj] set pracoviste_id = %i where id in (".$lst.") ", $id);
        }
        else{
            $r['kod'] = 1;
            $r['nazev'] = 'Nelze napárovat zdroje k pracovišti. Zdroj nebo pracoviště není definováno.';
        }
        
        return $r;        
    }
    
    
    /** @callable  */
    public function getPracovistePlanovani(){
        
        $r = array();
        $dt = dibi::query("select a.* from [cis_pracoviste] a WHERE platnost=true and kalendar_id <> -1 ORDER BY nazev asc");
        
        foreach($dt as $d){
            
            $r[] = (object) [
                    'id'=> $d['id'],
                    'kod'=> $d['kod'], 
                    'nazev'=> $d['nazev'],
                    'platnost'=> true, 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        return $r;
    }
}