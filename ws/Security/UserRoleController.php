<?php

namespace ws\Security;
use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;

/** @controller */
class UserRoleController {

    /**
     * @var User
     * @inject
     */
    public $user;

    public function checkRequirements()
    {
        return true;
    }

    
     /** @callable  */
    function getRoleGroupTable($tabquery=null){
       
       $cols = "id, name, note, 
                coalesce((select prijmeni || ' ' || jmeno from security_user where id = g.zmenil), '') as zmenil, 
                to_char(zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno";
       
       $resp = TableHelper::query($tabquery, $cols, "security_roles_group g");
       return $resp;
    }
    
    
    /** @callable  */
    public function getRoleGroup($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     from security_roles_group a where id=%i", $id);
            
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'name'=>$p['name'], 'note'=>$p['note'], 
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'name'=> '',
                    'note'=> '',
                    'zmeneno'=> '', 
                    'zmenil'=> ''
            ]; 
        }
        
        return $r;
    }
    

    
    /** @callable  */
    public function addRoleGroup($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $name = sanitize($rec['name']);
        $note = sanitize($rec['note']);
        
        if(empty($name)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else{

            $a = [ 'name' => $name, 'note' => $note, 'zmenil' => $this->user->getId()];

            if($id < 0){
                dibi::query('insert into [security_roles_group]', $a);
                $id = dibi::query("select currval('security_roles_group_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [security_roles_group] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getRoleGroup($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function dropRoleGroup($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $ids = intval($id);

        if($ids > -1){
            dibi::query("delete from [security_roles_group] where id=%i", $ids);
        }
        return $r;
    }
    
    /** @callable  */
    public function getSecurityRoleGroupList(){
        
        $dt = dibi::query("select id, name from security_roles_group order by name asc");
        $r = [];
        
        foreach($dt->fetchAll() as $f){
            $r[] = (object) ['value'=> $f['id'], 'label'=>$f['name']];
        }

        
        return $r;        
    }
    

    /** @callable  */
    public function getSecurityRoleList($groupid=-1){
        
        $dt = dibi::query("select id, tag from security_roles where group_id=%i order by tag asc", intval($groupid));
        
        $r = [];
        foreach($dt->fetchAll() as $f){
            $r[] = (object) ['value'=> $f['id'], 'label'=>$f['tag']];
        }

        return $r;        
    }
    
    
    
    
    /** @callable  */
    function getRoleTable($tabquery=null){
       
       $cols = "id, tag, note, group_id, ts_class, (select name from security_roles_group g where g.id = a.group_id) skupina,
                coalesce((select prijmeni || ' ' || jmeno from security_user where id = a.zmenil), '') as zmenil, 
                to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno";
       
       $resp = TableHelper::query($tabquery, $cols, "security_roles a");
       return $resp;
    }
    
    /** @callable  */
    public function addRole($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $tag = sanitize($rec['tag']);
        $note = sanitize($rec['note']);
        $params = $rec['params'];
        $tsclass = sanitize($rec['ts_class']);
        $tsclass = empty($tsclass) ? null : $tsclass;
        $groupid = intval($rec['group_id']);
        $groupid = $groupid == 0 ? -1 : $groupid;
        
        if(empty($tag)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else{

            $a = [ 'tag' => $tag, 'note' => $note, 'group_id' => $groupid, 'params'=> json_encode($params), 'ts_class'=> $tsclass, 'zmenil' => $this->user->getId()];

            if($id < 0){
                dibi::query('insert into [security_roles]', $a);
                $id = dibi::query("select currval('security_roles_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [security_roles] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }

            $r['data'] = (object) $this->getRole($id);                  
        }

        return $r;
    }

    
    /** @callable  */
    public function getRole($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                     coalesce(ts_class, '') ts_class
                     from security_roles a where id=%i", $id);
            
            $p = $dt->fetch();
            $param =  [];

            if(!empty($p['params'])){

                try
                {
                    $param = json_decode($p['params']);
                    $param = $param == null ? [] : $param;
                }catch(Exception $e){
                    $param = [];
                }

            }

            $r = (object) ['id'=>$p['id'], 'tag'=>$p['tag'], 'group_id'=>$p['group_id'], 'note'=>$p['note'], 
                            'params' => $param, 'ts_class'=> $p['ts_class'], 'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'tag'=> '',
                    'note'=> '',
                    'params' => [],
                    'ts_class' => '',
                    'group_id'=> -1,
                    'zmeneno'=> '', 
                    'zmenil'=> ''
            ]; 
        }
        
        return $r;
    }
    
    
    /** @callable  */
    public function dropRole($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $ids = intval($id);

        if($ids > -1){
            dibi::query("delete from [security_roles] where id=%i", $ids);
        }
        return $r;
    }

}