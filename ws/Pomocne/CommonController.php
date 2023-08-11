<?php

namespace ws\Pomocne;

use dibi;
use Nette\Security\User;

/** @controller */
class CommonController 
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
    public function getSettingTable($tabquery=null)
    {        
        $table = "(SELECT a.*, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil FROM settings a ) X";
        
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function updateSettingParam($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
        
        $id = intval($rec['id']);
        $kod = strtoupper($rec['kod']);
        
        if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód parametru je prázdný!';
            return $r;
        }
       
        $is = dibi::query("select id from [settings] where kod=%s", $kod)->fetch();
        
        $a = [ 'param'=> $rec['param'], 
                'param2'=> $rec['param2'], 
                'param3'=> $rec['param3'], 
                'poznamka'=> $rec['poznamka'], 
                'zmenil' => $this->user->getId()];

        if(!$is){
            $a['kod'] = $kod;
            dibi::query('insert into [settings]', $a);
            $id = dibi::query("select currval('settings_id_seq')")->fetchSingle();
        }
        else{
            $id = $is['id'];
            dibi::query('UPDATE [settings] SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
        }

        $r['data'] = (object) $this->getSettingParam($id);     
        return $r;
    }
    
    /** @callable  */
    public function dropSettingParam($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > 0){
            dibi::query("delete from [settings] where id=%i", $id);
        }
        return $r;
    }
    
    /** @callable  */
    public function getSettingParamByCode($kod=null){
        
        
        if($kod == null){            
            return '';
        }
        
        $kod = strtoupper(sanitize($kod));        
        $r = dibi::query("select param from [settings] s where kod=%s", $kod)->fetchSingle();        
        return $r==null ? '' : $r;
    }
    

     /** @callable  */
     public function setSettingParamByCode($rec){
        
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        if($rec == null || !isset($rec['kod']) || $rec['kod'] == null){            
            $r['nazev'] = 'Kód je neplatný! Zkontroluj vstupní data.';
            return $r;
        }
        
        $kod = strtoupper(sanitize($rec['kod']));        
        $dt = dibi::query("select id from [settings] s where kod=%s", $kod)->fetch();        

        $a = ['param' => $rec['param']];
        if($dt){
            dibi::query('UPDATE [settings] SET ', $a, ' WHERE id=%i', $dt['id']);
            $r['nazev'] = 'Záznam aktualizován';            
        }
        else{
            $a = ['kod'=> $kod];
            dibi::query('insert into [settings]', $a);            
        }

        return $r==null ? '' : $r;
    }


    
    
    /** @callable  */
    public function getSettingParam($id=-1){
        
        $id = intval($id);
        $r = (object) ['id'=>-1, 'kod'=>'', 'param'=>'', 'param2'=>'', 'param3'=>'','poznamka'=>'', 'zmeneno'=>'', 'zmenil'=>-1]; 
        
        if($id < 0){            
            return $r;
        }
        
        $p = dibi::query("select s.*, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = s.zmenil), '') as zmenil,
                           to_char(s.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno from [settings] s where id=%i", $id)->fetch();
        
        if($p){            
            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'param'=>$p['param'], 'param2' => $p['param2'], 'param3' => $p['param3'], 'poznamka'=>$p['poznamka'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        
        return $r;
    }
    
    
    /** @callable  */
    public function getMenuItem($id=-1){
        
        $id = intval($id);
        $r = (object) ['id'=>-1, 
                       'name'=>'', 'icon'=>'', 'url'=>'', 'note'=> '', 'parent_id'=> -1,
                       'role_id'=> -1, 'role_group_id'=> -1, 'sortorder'=> 0, 'zmeneno'=>'', 'zmenil'=>-1]; 
        
        if($id < 0){            
            return $r;
        }
        
        $p = dibi::query("select s.*, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = s.zmenil), '') as zmenil,
                           to_char(s.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno from [framework_menu] s where id=%i", $id)->fetch();
        
        if($p){            
            $r = (object) ['id'=>$p['id'],  'name'=>$p['name'], 'icon'=>$p['icon'], 'url'=>$p['url'], 
                        'note'=>$p['note'],  'parent_id'=>$p['parent_id'], 'role_id'=>$p['role_id'], 'role_group_id'=>$p['role_group_id'],
                        'sortorder'=>$p['sortorder'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        
        return $r;
    }
    
    /** @callable  */
    public function getMenuItemList($parentid=-1){
        
        $r = [];
        
        $d = dibi::query("select s.*, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = s.zmenil), '') as zmenil,
                           to_char(s.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno from [framework_menu] s where parent_id=%i", $parentid)->fetchAll();
        
        foreach($d as $p){
         $r[] = (object) ['id'=>$p['id'],  'name'=>$p['name'], 'icon'=>$p['icon'], 'url'=>$p['url'], 
                        'note'=>$p['note'],  'parent_id'=>$p['parent_id'], 'role_id'=>$p['role_id'], 'role_group_id'=>$p['role_group_id'],
                        'sortorder'=>$p['sortorder'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']];  
        }
        
        return $r;
        
    }
    
    /** @callable  */
    public function updateMenuItem($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
        
        $id = intval($rec['id']);
        $label = sanitize($rec['name']);
        
        if(empty($label)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název položky je prázdný!';

        } else{

            $a  = [ 'name'=> $label, 'icon'=> sanitize($rec['icon']), 'url'=> sanitize($rec['url']), 
                        'note'=> sanitize($rec['note']),  'parent_id'=>intval($rec['parent_id']), 
                        'role_id'=>intval($rec['role_id']), 'role_group_id'=>intval($rec['role_group_id']),
                        'sortorder'=>intval($rec['sortorder']), 'zmenil' => $this->user->getId()]; 
                
            if($id < 0){
                dibi::query('insert into [framework_menu]', $a);
                $id = dibi::query("select currval('framework_menu_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [framework_menu] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getMenuItem($id);                  
        }              
     

        return $r;
    }
    
    /** @callable  */
    public function dropMenuItem($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        dibi::query("delete from [framework_menu] where id=%i", $id);
        return $r;
    }
    
    
    /** @callable  */
    public function getMenuItemTable($tabquery=null)
    {        
        $table = "(SELECT a.*, 
                    coalesce((select name from framework_menu u where u.id = a.parent_id), '') as parent,
                    coalesce((select name from security_roles_group u where u.id = a.role_group_id), '') as role_group,
                    coalesce((select tag from security_roles u where u.id = a.role_id), '') as role,
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                  FROM framework_menu a ) X";
        
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }
    

}