<?php

namespace ws\Posta;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;


/** @controller */
class PostaController extends BaseController
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
    public function getAliasTable($tabquery=null)
    {
        
        dibi::connect($this->config['posta']);

        $table = "(SELECT a.id, coalesce((select name from virtual_domains u where u.id = a.domain_id), '') as domena, a.source, 
                    case when length(a.destination) > 80 then concat(SUBSTRING(a.destination, 1, 60), '...') else a.destination end as destination, 
                    a.zmeneno, a.zmenil
                    FROM virtual_aliases a) X";
       
       return TableHelper::query($tabquery, "X.*", $table);
    }
    

    /** @callable  */
    public function AddAlias($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        dibi::connect($this->config['posta']);


        $id = intval($rec['id']);
        $source = sanitize($rec['source']);
        $destination = sanitize($rec['destination']);
        
        
        if(empty($source) || empty($source)){
            $r['kod'] = 1;
            $r['nazev'] = 'Alias nebo e-mailové adresy nejsou zadány!';
        }
        else{

            $a =  [ 'source'=> $source, 
                    'destination'=> $destination, 
                    'domain_id'=> intval($rec['domain_id']),                  
                    'zmeneno'=>$this->getNow(), 
                    'zmenil'=> $this->getPrijmeniJmeno()
                ]; 

            if($id < 0){                
                dibi::query('insert into [virtual_aliases]', $a);
                $id = dibi:: getInsertId();
            }
            else{
                dibi::query('UPDATE [virtual_aliases] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->GetAlias($id);                  
        }

        return $r;
    }

    /** @callable  */
    public function getDomainList(){

        dibi::connect($this->config['posta']);
        $dt = dibi::query("SELECT id, name FROM  virtual_domains ORDER BY name ASC");
    
        $lst = [];
        foreach($dt as $d){
            $lst[] = (object) ['value'=> $d['id'], 'label'=> $d['name']];
        }

        return $lst;
    }


    
    /** @callable  */
    public function DropAlias($id)
    {
        dibi::connect($this->config['posta']);

        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [virtual_aliases] where id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function GetAlias($id=-1){
        
        
        if($id > -1){

            dibi::connect($this->config['posta']);

            $dt = dibi::query("SELECT id, source, destination, domain_id, zmenil, DATE_FORMAT(zmeneno, '%d.%m.%Y %H:%i:%s') zmeneno  
                                FROM [virtual_aliases] 
                                WHERE id=%i", $id);

            $p = $dt->fetch();
            
            $r = (object) ['id'=>$p['id'], 
                    'domain_id'=>$p['domain_id'], 
                    'source'=>$p['source'], 
                    'destination'=>$p['destination'], 
                    'zmeneno'=>$p['zmeneno'], 
                    'zmenil'=>$p['zmenil']
            ]; 

        }
        else{            
            $r = (object) ['id'=> -1, 
                        'domain_id'=> -1,
                        'source'=> '', 
                        'destination'=>'',                      
                        'zmeneno'=> '', 
                        'zmenil'=> ''
                    ]; 
        }
        
        
        return $r;
    }



    /**
     * Domény poštovního serveru
     */


    /** @callable  */
    public function getDomainTable($tabquery=null)
    {
        
        dibi::connect($this->config['posta']);
        $table = "(SELECT a.id, a.name, a.zmeneno, a.zmenil FROM virtual_domains a) X";           
        return TableHelper::query($tabquery, "X.*", $table);
    }
    

    /** @callable  */
    public function AddDomain($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        dibi::connect($this->config['posta']);

        $id = intval($rec['id']);
        $name = sanitize($rec['name']);
        
        
        if(empty($name)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název domény není zadán!';
        }
        else{

            $a =  [ 'name'=> $name, 
                    'zmeneno'=>$this->getNow(), 
                    'zmenil'=> $this->getPrijmeniJmeno()
                ]; 

            if($id < 0){                
                dibi::query('insert into [virtual_domains]', $a);
                $id = dibi:: getInsertId();
            }
            else{
                dibi::query('UPDATE [virtual_domains] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->GetDomain($id);                  
        }

        return $r;
    }


    /** @callable  */
    public function DropDomain($id)
    {
        dibi::connect($this->config['posta']);

        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [virtual_domains] where id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function GetDomain($id=-1){
        
        
        if($id > -1){

            dibi::connect($this->config['posta']);

            $dt = dibi::query("SELECT id, name, zmenil, DATE_FORMAT(zmeneno, '%d.%m.%Y %H:%i:%s') zmeneno  
                                FROM [virtual_domains] 
                                WHERE id=%i", $id);

            $p = $dt->fetch();
            
            $r = (object) ['id'=>$p['id'], 
                    'name'=>$p['name'], 
                    'zmeneno'=>$p['zmeneno'], 
                    'zmenil'=>$p['zmenil']
            ]; 

        }
        else{            
            $r = (object) ['id'=> -1, 
                        'name'=> '', 
                        'zmeneno'=> '', 
                        'zmenil'=> ''
                    ]; 
        }
        
        
        return $r;
    }


    /**
     * Uživatelské účty poštovního serveru
     */


    /** @callable  */
    public function getEmailTable($tabquery=null)
    {
        
        dibi::connect($this->config['posta']);
        $table = "(SELECT a.id, a.email, coalesce((select name from virtual_domains u where u.id = a.domain_id), '') as domena, a.zmeneno, a.zmenil 
                    FROM virtual_users a) X";           
        return TableHelper::query($tabquery, "X.*", $table);
    }
    

    /** @callable  */
    public function AddEmail($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        dibi::connect($this->config['posta']);

        $id = intval($rec['id']);
        $email = sanitize($rec['email']);
        $password = sanitize($rec['password']);
        
        if(empty($email)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název domény není zadán!';
        }
        else{

            $a =  [ 'email'=> $email, 
                    'domain_id' => intval($rec['domain_id']),
                    'zmeneno'=>$this->getNow(), 
                    'zmenil'=> $this->getPrijmeniJmeno()
                ]; 

            $password = trim($password);
            if(!empty($password)){

                $a['hash'] = hash("sha256", time());
                $a['password'] = crypt($password, "$6$".$a['hash']);

            }
            

            if($id < 0){                
                dibi::query('insert into [virtual_users]', $a);
                $id = dibi:: getInsertId();
            }
            else{
                dibi::query('UPDATE [virtual_users] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->GetEmail($id);                  
        }

        return $r;
    }


    /** @callable  */
    public function DropEmail($id)
    {
        dibi::connect($this->config['posta']);

        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [virtual_users] where id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function GetEmail($id=-1){
        
        
        if($id > -1){

            dibi::connect($this->config['posta']);

            $dt = dibi::query("SELECT id, domain_id, email, zmenil, DATE_FORMAT(zmeneno, '%d.%m.%Y %H:%i:%s') zmeneno  
                                FROM [virtual_users] 
                                WHERE id=%i", $id);

            $p = $dt->fetch();
            
            $r = (object) ['id'=>$p['id'], 
                        'domain_id'=>$p['domain_id'],         
                        'password'=> '',                      
                        'email'=>$p['email'],                         
                        'zmeneno'=>$p['zmeneno'], 
                        'zmenil'=>$p['zmenil']
            ]; 

        }
        else{            
            $r = (object) ['id'=> -1, 
                        'domain_id'=> -1,
                        'email'=> '',  
                        'password'=> '', 
                        'zmeneno'=> '', 
                        'zmenil'=> '',
                    ]; 
        }
        
        
        return $r;
    }
    
}