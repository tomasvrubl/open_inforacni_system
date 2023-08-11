<?php

namespace ws\Security;

use dibi;
use Nette\Security\User;
use Nette\Security\UserStorage;
use Nette\Security\Passwords;
use Nette\Http\Request;
use Nette\Security\AuthenticationException;
use ws\Bootstrap\ProxyContainer;
use ws\Exceptions\SecurityException;
use ws\Responses\JsonResponse;
use ws\Responses\Responses;
use ws\Pomocne\TableHelper;

use ws\BaseController;

/** @controller */
class UserController extends BaseController {

    /**
     * @var Authorizator
     * @inject
     */
    public $authorizator;

    /**
     * @var Authenticator
     * @inject
     */
    public $authenticator;

    /**
     * @var Responses
     * @inject
     */
    public $responses;


    protected function getJsSecurityUser()
    {
        $securityUser = (object)[];

        $securityUser->id = $this->user->id;
        $securityUser->username = $this->user->getIdentity()->username;
        $securityUser->osoba_id = $this->user->getIdentity()->osoba_id;
        $securityUser->prijmeni = $this->user->getIdentity()->prijmeni;
        $securityUser->jmeno = $this->user->getIdentity()->jmeno;
        $securityUser->email = $this->user->getIdentity()->email;
        $securityUser->role = $this->user->getIdentity()->role;
        $securityUser->isadmin = $this->user->getIdentity()->isadmin;
        $securityUser->editokno = $this->user->getIdentity()->editokno;

        $securityUser->settings = $this->getUserParams();

        return $securityUser;

    }

    /** @callable */
    public function getUserParams(){

        $r = [];

        if(empty($this->user) || $this->getUserID() < 0){
            return $r;
        }

        $dt = dibi::query("select * from [security_user_params] where security_user_id=%i", $this->getUserID())->fetchAll();

        foreach($dt as $d){
            $r[] = ['id'=>$d['id'], 'security_user_id'=> $d['security_user_id'], 'param'=> $d['param'], 'data'=> json_decode($d['json'])];
        }

        return $r;
    }





    /** @callable */
    public function login($username, $password)
    {
        try {
            
            $this->user->login($username, $password);
            return $this->getJsSecurityUser();
        }
        catch (AuthenticationException $ex)
        {
            throw new SecurityException($ex->getMessage());
        }
    }



     /** @callable */
    public function reloadAuthentication(){

        try {
            $id = $this->authenticator->getUserIdentity($this->user->id);

            $storage =$this->user->getStorage();

            
            if ($storage instanceof UserStorage) {
                $storage->saveAuthentication($id);
            } else {
                $storage->setIdentity($id);
                $storage->setAuthenticated(true);
            }

            return $this->getJsSecurityUser();
        }
        catch (AuthenticationException $ex)
        {
            throw new SecurityException($ex->getMessage());
        }

    }


    /** @callable */
    public function isLoggedIn()
    {
        if (!$this->user->isInRole('logged'))
        {            
            return false;
        }
        return $this->getJsSecurityUser();
    }
    
    
     /** @callable */
    public function getAuthUserMenu()
    {
        $uid = $this->user->id;

        if($this->isAdmin()){
            $dt = dibi::fetchAll("select id, icon, name, url, parent_id, m.sortorder from framework_menu m ORDER BY parent_id ASC, m.sortorder asc");
        }
        else{


            $dt = dibi::fetchAll("SELECT * FROM 
                                (select m.id, m.icon, m.name, m.url, m.parent_id, m.sortorder from framework_menu m 
                                        inner join security_user_roles r on m.role_id = r.role_id and m.role_group_id = r.role_group_id where r.user_id=%i
                                UNION ALL
                                    select m.id, m.icon, m.name, m.url, m.parent_id, m.sortorder from framework_menu m 
                                    where  m.role_id = -1 and m.role_group_id in (select role_group_id from security_user_roles where user_id=%i)
                                ) X 
                                ORDER BY parent_id ASC, X.sortorder ASC", $uid, $uid);
        }
        
        
        $sql = dibi::$sql;
        $r = [];
        
        if($dt){
            
            foreach ($dt as $d){
                
                if($d['parent_id'] == -1){
                    $r[$d['id']] = (object) ['id'=>$d['id'], 'name'=>$d['name'], 'url'=>$d['url'], 
                        'parent_id'=>$d['parent_id'], 'sortorder'=>$d['sortorder'], 'icon'=>$d['icon'], 'mnu'=>[]];
                }
                else{
                    $r[$d['parent_id']]->mnu[] = (object) ['id'=>$d['id'], 'name'=>$d['name'], 'url'=>$d['url'], 
                        'parent_id'=>$d['parent_id'], 'sortorder'=>$d['sortorder'], 'icon'=>$d['icon']];
                }
                
            }
            
        }
            
        return $r;
    }
    
    /** @callable */
    public function updateUserProfile($rec=null){
        
        $r = ['kod'=> 0, 'nazev' => 'Profil aktualizován', 'data'=>null];        
        $arr = ['email'=> $rec['email'],
                'editokno' => intval($rec['editokno'])];
        
        

        if(isset($rec['heslo']) && !empty($rec['heslo'])){

            $Passwords = new Passwords();
            $hashedPassword = $Passwords->hash($rec['heslo']);
            $arr['heslo'] = $hashedPassword;             
           
        }
        $rec['heslo'] = "";
        dibi::query('UPDATE security_user SET ', $arr, 'WHERE `id`=%i', $this->user->id);   
        $r['data'] = $rec;
        return $r;          
    }
            
   
    /** @callable  */     
    public function getUserParam($name=null){
        
        if($name == null){
            return false;
        }
        
        return dibi::query("select json, id, param, security_user_id from security_user_params where param=%s and security_user_id=%i", $name, $this->user->id)->fetch();
    }





    /** @callable  */
    public function updateUserParam($rec=null) {

        $r = ['kod'=> 0, 'nazev' => 'Nastavení aktualizováno', 'data'=> null];    
        $param = sanitize($rec['param']);

        $a = ['security_user_id' => $this->getUserID(), 'param'=>$param, 'json'=> \json_encode($rec['data'])];

        $dt = dibi::query("select * from [security_user_params] where security_user_id=%i and param=%s", $this->getUserID(), $param)->fetch();
    
        if(!$dt){
            dibi::query('INSERT INTO [security_user_params]', $a);
        }
        else {
            dibi::query('UPDATE [security_user_params] SET ', $a, 'WHERE `id`=%i', $dt['id']);    
        }

        $p = $this->getUserParam($param);        
        $r['data'] =  [ 'security_user_id' => $p['security_user_id'], 'param' => $p['param'], 'data' => json_decode($p['json'])];

        return $r;
    }

    /** @callable  */
    public function dropUserParam($kod=null) {

        $r = ['kod'=> 0, 'nazev' => 'Filtr odstraněn', 'data'=> null];

        $name = sanitize($kod);
        dibi::query('DELETE FROM security_user_params WHERE security_user_id=%i and param=%s', $this->getUserID(), $name); 

        return $r;
    }
    

    
    /** @callable  */
    public function setUserParam($name, $json=null){
        
        if($json == null){
            dibi::query('DELETE FROM security_user_params WHERE security_user_id=%i and param=%s', $this->user->id, $name);    
            return;
        }
        
        $param = $this->getUserParam($name);        
        $arr = [ 'security_user_id' => $this->user->id, 'param' => $name, 'json' => $json];
        
        if($param){
            dibi::query('UPDATE security_user_params SET ', $arr, 'WHERE `id`=%i', $param['id']);    
        }
        else{
            dibi::query('INSERT INTO [security_user_params]', $arr);    
        }        
        
    }
    
    
    /** @callable  */
    public function getUser($id=-1){
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*, coalesce(o.oscislo, '') o_oscislo, coalesce(o.prijmeni, '') o_prijmeni, coalesce(o.jmeno, '') o_jmeno,
            coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
            to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
            FROM security_user a LEFT OUTER JOIN osoba o ON a.osoba_id = o.id where a.id=%i", $id);
            
            $usr = $dt->fetch();
            $r = (object) [
                    'id' => $usr['id'],
                    'username' => $usr['username'],
                    'heslo'=> '',
                    'editokno'=>$usr['editokno'],
                    'isadmin'=> $usr['isadmin'],
                    'platnost' => $usr['platnost'],
                    'osoba_id' => $usr['osoba_id'],
                    'osoba_oscislo' => $usr['o_oscislo'],
                    'osoba' => $usr['o_prijmeni']." ".$usr['o_jmeno'],
                    'prijmeni' => $usr['prijmeni'],
                    'jmeno' => $usr['jmeno'],
                    'email' => $usr['email'],
                    'zmeneno' => $usr['zmeneno'],
                    'zmenil' => $usr['zmenil']
                ];

        }
        else{
            
            $r = (object) [
                    'id' => -1,
                    'username' => '',
                    'heslo'=> '',
                    'isadmin' => 0,
                    'editokno'=>0,
                    'platnost' => 1,
                    'osoba_id' => -1,
                    'osoba_oscislo' => '',
                    'osoba' => '',
                    'prijmeni' => '',
                    'jmeno' => '',
                    'email' => '',
                    'zmeneno' => '',
                    'zmenil' => ''];
        }
        
        return $r;
    }
   
    /** @callable  */
    public function updateUser($rec){
    
        $login = $rec['username'];
        $password = $rec['heslo'];
        $isadmin = $rec['isadmin'];
        $osoba_id = intval($rec['osoba_id']);
        
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
        
        $id = -1;
       if(!isset($rec['id']) || intval($rec['id']) < 1){
           $usr = \dibi::query('select * from security_user where username = %s', $login)->fetch();   
       }
       else{
           $usr = \dibi::query('select * from security_user where id = %i', $rec['id'])->fetch();   
           $id = $usr['id'];
       }
       

        $platnost = intval($rec['platnost']) == 1 ? true : false;
        
        if (!$usr)
        {
            $Passwords = new Passwords();
            $hashedPassword = $Passwords->hash($password);        

            $arr = ['username'=> $login, 
                'prijmeni'=> $rec['prijmeni'],
                'jmeno'=> $rec['jmeno'],
                'heslo'=>$hashedPassword,
                'platnost'=> $platnost,
                'osoba_id'=> $osoba_id,
                'isadmin'=> $isadmin,
                'email'=>$rec['email'],
                'zmenil'=> $this->user->id
                ];
                    
            dibi::query('INSERT INTO [security_user]', $arr);
            
        }
        else
        {
            $arr = ['platnost'=> $platnost,
                'isadmin'=> $isadmin,
                'username'=>$rec['username'],
                'prijmeni'=> $rec['prijmeni'],
                'osoba_id'=> $osoba_id,
                'jmeno'=> $rec['jmeno'],
                'email'=>$rec['email'],
                'zmenil'=> $this->user->id
                ];
            
            if(!empty($password)){
                $Passwords = new Passwords();
                $hashedPassword = $Passwords->hash($password);        
                $arr['heslo'] = $hashedPassword;
            }
            
            dibi::query('UPDATE [security_user] SET ', $arr,' WHERE id = %i', $id);
            $r['nazev'] = 'Záznam aktualizován';
            $login = $rec['username'];
        }
        
        $usr = \dibi::query("SELECT u.*, coalesce(o.oscislo, '') oscislo, to_char(u.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno, 
                            coalesce((select prijmeni || ' ' || jmeno from security_user where id = u.zmenil), '') as zmenil 
                            FROM security_user u LEFT JOIN osoba o ON u.osoba_id = o.id
                            WHERE u.username = %s", $login)->fetch();
        
        $r['data'] = (object) [
            'id' => $usr['id'],
            'username' => $usr['username'],
            'heslo'=> '',
            'isadmin' => $usr['isadmin'],
            'platnost' => $usr['platnost'],
            'osoba_id' => $usr['osoba_id'],
            'osoba' => $usr['prijmeni']." ".$usr['jmeno'],
            'osoba_oscislo' => $usr['oscislo'],
            'prijmeni' => $usr['prijmeni'],
            'jmeno' => $usr['jmeno'],
            'email' => $usr['email'],
            'zmeneno' => $usr['zmeneno'],
            'zmenil' => $usr['zmenil']
        ];
        
        return $r;
        
    }

    /** @callable  */
    public function resetPassword($rec){
        $r = ['kod'=> 0, 'nazev' => 'Heslo resetováno', 'data'=> null];
        
        $id = intval($rec);
        $h = "ABCDEFGHIJKLMNOPQRSTUVwxyzabcdefghijklmnopqrstuvwxyz0123456789*+-/";
        $strl = strlen($h);

        $newpass = "";
        for($i=0; $i < 12; $i++){
            $newpass .= $h[rand(0, $strl - 1)];
        }

        $Passwords = new Passwords();
        $hashedPassword = $Passwords->hash($newpass);   


        $usr = dibi::query("SELECT * FROM [security_user] WHERE id=%i", $id )->fetch();

        if(empty($usr)){
            $r['kod'] = 1;
            $r['nazev'] = 'Osoba neexistuje.';
            return $r;
        }

        dibi::query('UPDATE [security_user] SET ',  ['heslo' => $hashedPassword ],' WHERE id = %i', $id);

        $st = dibi::query("select * from [settings] where kod='USER_RESET_PASSWORD_MAIL'")->fetch();

        if($st && !empty($usr['email'])){

            $subj =  $st['param2'];
            $body = str_replace("%username%", $usr['username'], $st['param3']);
            $body = str_replace("%password%", $newpass, $body);
            $url = $this->getURL();
            $body = str_replace("%url%", $url, $body);
            
            $this->sendMail($subj, $body, [$usr['email']]);
            $r['nazev'] = 'Heslo resetováno. Uživateli byl zaslán e-mail s přihlašovacími údaji.';
        }

        return $r;
    }
    
    /** @callable  */
    public function dropUser($userid){
        
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($userid);

        if($id > -1){
            dibi::query('delete from security_user where id=%i', $id);
        }
        
        return $r;        
    }
    
   
    
   
    
    /** @callable  */
    function userTable($tabquery=null){
       
       $cols = "id, username, prijmeni, jmeno, email, isadmin, platnost, case when isadmin then 'ano' else 'ne' end _isadmin,
                   case when platnost then 'ano' else 'ne' end _platnost, osoba_id, 
                   coalesce((select prijmeni || ' ' || jmeno from osoba where id = u.id), '') as t_osoba, 
                   coalesce((select prijmeni || ' ' || jmeno from security_user where id = u.zmenil), '') as zmenil, 
                   to_char(zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno";
       
       $resp = TableHelper::query($tabquery, $cols, "security_user u");
       return $resp;
    }
    
    
    /** @callable  */
    function getUserRoleTable($tabquery=null){

        $table = "(select r.id, r.user_id, coalesce((select prijmeni || ' ' || jmeno from security_user where id = r.zmenil), '') as zmenil, 
                    to_char(r.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                        sr.tag as role, sg.name as skupina
                from security_user_roles r left join security_roles sr on r.role_id = sr.id
                    left join security_roles_group sg on r.role_group_id = sg.id) X";
       
        return TableHelper::query($tabquery, "X.*", $table);
    }
    
    /** @callable  */
    public function dropUserRole($id){
        
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query('delete from [security_user_roles] where id=%i', $id);
        }
        
        return $r;        
    }
    
    /** @callable  */
    public function updateUserRole($rec){
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        
        if($id < 0){
            $r['kod'] = 1;
            $r['nazev'] = 'Neplatné id záznamu';
        }
        else{
            
            $param =  "[]";
            if(!empty($rec['params'])){

                try
                {
                    $param = json_encode($rec['params']);
                    $param = $param == null ? "[]" : $param;
                }catch(Exception $e){
                    $param = "[]";
                }

            }


            $a = [ 'params' => $param, 'zmenil' => $this->user->getId()];       
            dibi::query('UPDATE [security_user_roles] SET ', $a, ' WHERE id=%i', $id);
            
            $r['data'] = (object) $this->getUserRole($id);                  
        }
            
        return $r;
    }
    
    
    /** @callable  */
    public function getUserRole($id=-1){
        
        if($id > -1) {
            $dt = dibi::query("SELECT r.id, r.user_id, r.role_id, r.role_group_id, r.params,
                               coalesce((select prijmeni || ' ' || jmeno from security_user where id = r.zmenil), '') as zmenil, to_char(r.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                               sr.tag as role, sg.name as skupina,  sr.params as params_all
                               FROM security_user_roles r 
                                    LEFT JOIN security_roles sr ON r.role_id = sr.id
                                    LEFT JOIN security_roles_group sg ON r.role_group_id = sg.id 
                               WHERE r.id=%i", $id);
            $p = $dt->fetch();

            $param =  [];
            $param_all = [];

            if(!empty($p['params'])){
                try
                {
                    $param = json_decode($p['params']);
                    $param = $param == null ? [] : $param;
                }catch(Exception $e){
                    $param = [];
                }
            }

            if(!empty($p['params_all'])){
                try
                {
                    $param_all = json_decode($p['params_all']);
                    $param_all = $param_all == null ? [] : $param_all;
                }catch(Exception $e){
                    $param_all = [];
                }

            }



            $r = (object) ['id'=>$p['id'], 'user_id'=>$p['user_id'], 'role_id'=>$p['role_id'], 'role_group_id'=>$p['role_group_id'],
                           'role'=>$p['role'], 'skupina'=>$p['skupina'], 'params'=>$param, 'role_params_all'=> $param_all,
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        } else {
            
            $r = (object) [
                    'id'=> -1,
                    'user_id'=> -1,
                    'role_id'=> -1,
                    'role_group_id'=> -1,
                    'role'=> '',
                    'skupina'=> '',
                    'params'=> [],
                    'role_params_all' => [], //seznam vsech ktere obsahuje dana role
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        return $r;
    }
    
    /** @callable  */
    public function addUserRole($userid=-1, $roleid=[]){
        $r = ['kod'=> 0, 'nazev' => 'Menu položky přidány', 'data'=> null];
        $uid = intval($userid);
        
        if($uid < 0){            
            $r['kod'] = 1;
            $r['nazev'] = 'Neplatný uživatel. Položky nelze přidat';
            return $r;
        }
        
        $ilist = implode(",", $roleid);
        
        $q = "INSERT INTO security_user_roles (user_id, zmenil, role_group_id, role_id) 
                SELECT {$uid}, {$this->user->getId()}, m.group_id, m.id 
                FROM [security_roles] m 
               WHERE m.id IN ({$ilist}) AND id NOT IN (SELECT role_id FROM [security_user_roles] r WHERE r.user_id={$uid})";
        
        dibi::query($q);
        return $r;        
    }

     /** @callable  */
     public function lostPassword($eml){

        $r = ['kod'=> 0, 'nazev' => 'E-mail s přihlašovacími údaji odeslán na adresu <span>'.$eml.'</span>', 'data'=> null];
    
        $eml = sanitize($eml);

        if(empty($eml)){
            $r['kod'] = 1;
            $r['nazev'] = 'Neplatná e-mailová adresa.';
        }
        else{

            $dt = dibi::query("SELECT *  FROM security_user  WHERE email=%s", $eml)->fetch();

            if(!$dt){
                $r['kod'] = 1;
                $r['nazev'] = 'Neplatná e-mailová adresa. E-mail není v systému zaveden.';
            }
            else {
                $this->resetPassword($dt['id']);
            }
        }

        return $r;
     }
}