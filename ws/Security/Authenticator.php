<?php

namespace ws\Security;

use Dibi\Connection;
use Nette\Security\AuthenticationException;
use Nette\Security\IAuthenticator;
use Nette\Security\Identity;
use Nette\Security\IIdentity;
use dibi;
use Nette\Security\Passwords;

class Authenticator implements  IAuthenticator
{
    /**
     * @var Connection
     * @inject
     */
    public $dibi;

    /**
     * Performs an authentication against e.g. database.
     * and returns IIdentity on success or throws AuthenticationException
     * @return IIdentity
     * @throws AuthenticationException
     */
    function authenticate(array $credentials)
    {
        list($user, $password) = $credentials;

        $founded = dibi::fetch('select *, platnost::int as platnost, isadmin::int as isadmin from security_user where username = %s', $user);

        if ($founded)
        {
            
            if($founded->platnost == 0){
                throw new AuthenticationException("Uživatelský účet je zablokován. Kontaktuj správce.");
            }
            
            $Passwords = new Passwords();

            if($Passwords->verify($password,$founded->heslo)){
               return $this->getUserIdentity($founded->id);
            }
            
        }
        throw new AuthenticationException("Neplatné uživatelské jméno nebo heslo");
    }



    function getUserIdentity($userid=-1){

        $founded = dibi::fetch("SELECT u.*, (select o.oscislo from osoba o where o.id = u.osoba_id) oscislo, 
                                    u.platnost::int as platnost, u.isadmin::int as isadmin 
                                FROM security_user u WHERE u.id = %i", $userid);

        $role[] = 'logged';
        $roles[] = 'logged';

        $dt = dibi::fetchAll("SELECT u.params, r.tag, g.name, r.ts_class
                            FROM security_user_roles u 
                                LEFT JOIN security_roles r ON u.role_id = r.id 
                                LEFT JOIN security_roles_group g ON u.role_group_id=g.id 
                            WHERE u.user_id=%i", $founded->id);

        if($dt){
            foreach($dt as $f){
                $roles[] = $f['name'].":".$f['tag'];                        
                $role[$f['name'].":".$f['tag']] = (object) ['params'=> json_decode($f['params']), 'role'=>$f['tag'], 
                                                                                'group'=>$f['name'], 'ts'=>$f['ts_class']];
            }    
        }

        return new Identity($founded->id, $roles,
                        ['username' => $founded->username, 
                         'id' => $founded->id, 
                         'osoba_id'=> $founded->osoba_id, 
                         'oscislo'=>$founded->oscislo,
                         'prijmeni' =>$founded->prijmeni,
                         'jmeno' =>$founded->jmeno,
                         'email'=>$founded->email,
                         'isadmin'=>$founded->isadmin,
                         'editokno'=>$founded->editokno,
                         'role'=>$role]
                ); 
    }
}