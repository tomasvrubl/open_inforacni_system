<?php

namespace ws\Organizace;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;


/** @controller */
class FirmaController extends BaseController
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
        $table = "(SELECT a.id, a.nazev, a.ico, a.dic, a.ulice, a.obec, a.psc, a.telefon, a.email, a.www, a.zmeneno, 
                   coalesce(a.ulice || ', ' || a.obec || '  ' || a.psc ) as adresa,
                   coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                 FROM [org_firmy] a) X";
       
       return TableHelper::query($tabquery, "X.*", $table);
    }
    

    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $nazev = sanitize($rec['nazev']);
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else{

            $a =  [ 'nazev'=> $nazev, 
                    'ico'=> sanitize($rec['ico']), 
                    'dic'=> sanitize($rec['dic']),
                    'ulice'=> sanitize($rec['ulice']),
                    'obec'=> sanitize($rec['obec']),
                    'psc'=> sanitize($rec['psc']),
                    'stat'=> sanitize($rec['stat']),
                    'telefon'=> sanitize($rec['telefon']),
                    'email'=> sanitize($rec['email']),
                    'www'=> sanitize($rec['www']),
                    'externi_kod'=> sanitize($rec['externi_kod']),
                    'cu'=> sanitize($rec['cu']),
                    'platnost'=>$rec['platnost'] == 1 ? true : false,
                    'zmeneno'=>$this->getNow(), 
                    'zmenil'=> $this->getUserID()]; 

            if($id < 0){
                dibi::query('insert into [org_firmy]', $a);
                $id = dibi::query("select currval('cis_firmy_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [org_firmy] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->Get($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [org_firmy] where id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function Get($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                                 coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                                 to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                             from [org_firmy] a where id=%i", $id);
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 
                            'nazev'=>$p['nazev'], 
                            'ico'=>$p['ico'],
                            'dic'=>$p['dic'], 
                            'ulice'=>$p['ulice'], 
                            'obec'=>$p['obec'], 
                            'psc'=>$p['psc'], 
                            'stat'=>$p['stat'], 
                            'telefon'=>$p['telefon'], 
                            'email'=>$p['email'], 
                            'www'=>$p['www'], 
                            'externi_kod'=>$p['externi_kod'], 
                            'cu'=>$p['cu'], 
                            'platnost'=>$p['platnost'],
                            'zmeneno'=>$p['zmeneno'], 
                            'zmenil'=>$p['zmenil']
                        ]; 
        }
        else{            
            $r = (object) ['id'=> -1, 
                        'nazev'=> '', 
                        'ico'=> '',
                        'dic'=> '', 
                        'ulice'=> '', 
                        'obec'=> '', 
                        'psc'=> '', 
                        'stat'=> '', 
                        'telefon'=> '', 
                        'email'=> '', 
                        'www'=> '', 
                        'externi_kod'=> '', 
                        'cu'=> '', 
                        'platnost'=> true,
                        'zmeneno'=> '', 
                        'zmenil'=> -1
                    ]; 
        }
        
        
        return $r;
    }

    
}