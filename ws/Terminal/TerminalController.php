<?php

namespace ws\Terminal;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class TerminalController extends BaseController
{

  

    public function checkRequirements($method)
    {
        return true;
    }


    /** @callable */
    public function login($oscislo='')
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

    

    /** @callable  */
    public function getTerminalUser($oscislo=''){

        $r = false;
        $oscislo = sanitize($oscislo);

        if(!empty($oscislo)){
            $dt = dibi::query("SELECT oscislo, cip, prijmeni || ' ' || jmeno as osoba FROM osoba WHERE oscislo=%s", $oscislo);      
                     
            $p = $dt->fetch();
            if($p){
                $r = (object) ['oscislo'=>$p['oscislo'], 'osoba'=>$p['osoba'], 'cip'=>$p['cip']]; 
            }
        }
        
        return $r;
    }


}