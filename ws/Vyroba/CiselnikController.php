<?php

namespace ws\Vyroba;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;

/** @controller */
class CiselnikController
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
    public function getOsobaTable($tabquery=null)
    {
        
        $table = "( SELECT o.id, o.oscislo, o.prijmeni, o.jmeno, o.cis_pracoviste_id, p.kod pracoviste_kod, p.nazev pracoviste 
                    FROM osoba o left join cis_pracoviste p on o.cis_pracoviste_id = p.id) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


}