<?php

namespace ws\Ciselnik;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class KalendarController extends BaseController
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
        
        $table = "(SELECT a.id, a.nazev, a.kod, a.platnost, a.platnost_do, a.platnost_od, a.zmeneno, 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                    FROM kalendar a) X";       

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
        
        $platnost_od = $this->sanitizeDate($rec['platnost_od']);
        $platnost_do = $this->sanitizeDate($rec['platnost_do']);
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný';
        }
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'platnost'=>$platnost, 'platnost_od'=>$platnost_od, 'platnost_do'=>$platnost_do, 'zmenil' => $this->user->getId()];

            if($id < 0){
                dibi::query('INSERT INTO kalendar', $a);
                $id = dibi::query("select currval('vyr_kalendar_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE kalendar SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->Get($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("DELETE FROM kalendar where id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function Get($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*, to_char(a.platnost_od, 'YYYY-MM-DD') platnost_od, 
                                coalesce(to_char(platnost_do, 'YYYY-MM-DD'), '') platnost_do,
                                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                                to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                                FROM kalendar a WHERE id=%i", $id);
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'platnost_od'=>$p['platnost_od'],'platnost_do'=>$p['platnost_do'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'nazev'=> '',
                    'platnost'=> true, 
                    'platnost_od'=> $this->getToday(),
                    'platnost_do'=> '',
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        return $r;
    }
    
    
    
    /** @callable  */
    public function AddSmena($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $nazev = sanitize($rec['nazev']);
        $rec['pondeli'] = $rec['pondeli'] == 1 ? true : false;
        $rec['utery'] = $rec['utery'] == 1 ? true : false;
        $rec['streda'] = $rec['streda'] == 1 ? true : false;
        $rec['ctvrtek'] = $rec['ctvrtek'] == 1 ? true : false;
        $rec['patek'] = $rec['patek'] == 1 ? true : false;
        $rec['sobota'] = $rec['sobota'] == 1 ? true : false;
        $rec['nedele'] = $rec['nedele'] == 1 ? true : false;
        
        $rec['smena_konec'] = empty($rec['smena_konec']) ? '00:00' : $rec['smena_konec'];
        
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else{

            $a = [ 'nazev' => $nazev, 'pondeli'=>$rec['pondeli'], 'utery'=>$rec['utery'],
                    'streda'=>$rec['streda'],'ctvrtek'=>$rec['ctvrtek'],'patek'=>$rec['patek'],
                    'sobota'=>$rec['sobota'],'nedele'=>$rec['nedele'], 'smena_zacatek'=>$rec['smena_zacatek'],                   
                    'smena_konec'=>$rec['smena_konec'], 'kalendar_id'=>$rec['kalendar_id'],                   
                    'zmenil' => $this->getUserID(), 'zmeneno'=> $this->getNow()];

            if($id < 0){
                dibi::query('INSERT INTO kalendar_smena', $a);
                $id = dibi::query("select currval('vyr_kalendar_smena_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE kalendar_smena SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->GetSmena($id);                  
        }

        return $r;
    }
    
    /** @callable */
    public function getSmenaTable($id=-1, $tabquery=null)
    {
        
        $cols = "a.id, a.nazev, a.kalendar_id, a.pondeli, a.utery, a.streda, a.ctvrtek, a.patek, a.sobota, a.nedele, 
                 to_char(a.smena_zacatek, 'HH24:MI') smena_zacatek,  
                 to_char(a.smena_konec, 'HH24:MI') smena_konec,  
                 coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                 to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno";
       
       $resp = TableHelper::query($tabquery, $cols, "kalendar_smena a", " kalendar_id=".intval($id));
       return $resp;
    }
    
    /** @callable  */
    public function DropSmena($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("DELETE FROM kalendar_smena WHERE id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function GetSmena($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*,
                             to_char(a.smena_zacatek, 'HH24:MI') smena_zacatek,  
                             to_char(a.smena_konec, 'HH24:MI') smena_konec,  
                             coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                             to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                             FROM kalendar_smena a WHERE id=%i", $id);
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'nazev'=>$p['nazev'], 
                            'pondeli'=>$p['pondeli'],'utery'=>$p['utery'],'streda'=>$p['streda'],'ctvrtek'=>$p['ctvrtek'],'patek'=>$p['patek'],
                            'sobota'=>$p['sobota'],'nedele'=>$p['nedele'],
                            'smena_zacatek'=>$p['smena_zacatek'], 'smena_konec'=>$p['smena_konec'], 'kalendar_id'=>$p['kalendar_id'],
                            'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'nazev'=> '',
                    'pondeli'=> true, 
                    'utery'=> true, 
                    'streda'=> true, 
                    'ctvrtek'=> true, 
                    'patek'=> true, 
                    'sobota'=> false, 
                    'nedele'=> false, 
                    'smena_zacatek'=> '',
                    'smena_konec'=> '',
                    'kalendar_id'=>-1,
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        return $r;
    }
    
    /** @callable  */
    public function getKalendarList(){
        $r = [];
        
        $dt = dibi::query("SELECT a.*, to_char(a.platnost_od, 'DD.MM.YYYY') platnost_od, 
                             coalesce(to_char(platnost_do, 'DD.MM.YYYY'), '') platnost_do,
                             coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                             to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                             FROM kalendar a WHERE a.platnost=true and ( a.platnost_od <= now () and (a.platnost_do is null or a.platnost_do >= now())) ")->fetchAll();

        foreach($dt as $p){

            $obj = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'platnost_od'=>$p['platnost_od'],'platnost_do'=>$p['platnost_do'],
                           'smeny' => [], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']];     

            $dc = dibi::query("SELECT a.*,
                            to_char(a.smena_zacatek, 'HH24:MI') smena_zacatek,  
                            to_char(a.smena_konec, 'HH24:MI') smena_konec,  
                            coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                            to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                            FROM kalendar_smena a WHERE kalendar_id=%i", $p['id'])->fetchAll();

            $s = [];
            foreach($dc as $i){
                $s[] = (object) ['id'=>$i['id'], 'nazev'=>$i['nazev'], 
                                'pondeli'=>$i['pondeli'],'utery'=>$i['utery'],'streda'=>$i['streda'],'ctvrtek'=>$i['ctvrtek'],'patek'=>$i['patek'],
                                'sobota'=>$i['sobota'],'nedele'=>$i['nedele'],
                                'smena_zacatek'=>$i['smena_zacatek'], 'smena_konec'=>$i['smena_konec'], 'kalendar_id'=>$i['kalendar_id'],
                                'zmeneno'=>$i['zmeneno'], 'zmenil'=>$i['zmenil']];                 

            }

            $obj->smeny = $s;
            $r[] = $obj;
        }

        return $r;
        
    }


    /** @callable  */
    public function GetSmenyCBO($zdrojid=-1, $pracovisteid=-1) {

        $lst = [];
        if($zdrojid > 0){
            $dt = dibi::query("SELECT nazev, id FROM kalendar_smena WHERE kalendar_id in (SELECT kalendar_id FROM cis_zdroj WHERE id=%i) ORDER BY nazev ASC", $zdrojid);
        }
        else{
            $dt = dibi::query("SELECT nazev, id FROM kalendar_smena WHERE kalendar_id in (SELECT kalendar_id FROM cis_pracoviste WHERE id=%i) ORDER BY nazev ASC", $pracovisteid);
        }

        foreach($dt as $d){
            $lst[] = (object) ['value'=> $d['id'], 'label'=> $d['nazev']];
        }

        return $lst;

    }



    /** @callable  */    
    public function GetSmenyTerminalCBO($zdrojkod='') {


        //nacti druhy smen pro terminalove odvadeni na zaklade kodu zdroje
        $lst = [];

        $dt = dibi::query("SELECT nazev, id FROM kalendar_smena WHERE kalendar_id in (SELECT kalendar_id FROM cis_zdroj WHERE kod=%s) ORDER BY nazev ASC", $zdrojkod);

        foreach($dt as $d){
            $lst[] = (object) ['value'=> $d['id'], 'label'=> $d['nazev']];
        }

        return $lst;

    }

}