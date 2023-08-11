<?php

namespace ws\Organizace;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;


/** @controller */
class TelefonController extends BaseController
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
        $table = "(SELECT a.id, 0 typ, a.nazev, a.mobil, a.telefon, a.email, NULL as narozeni, a.zmeneno, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                    FROM org_telefoni_seznam a
                UNION ALL 
                    SELECT b.id, 1 typ,b.prijmeni || ' ' || b.jmeno as nazev , b.mobil, b.telefon, b.email, b.datum_narozeni as narozeni, b.zmeneno, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = b.zmenil), '') as zmenil
                    FROM osoba b WHERE b.platnost=true) X";
       
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
                    'mobil'=> sanitize($rec['mobil']), 
                    'telefon'=> sanitize($rec['telefon']),
                    'email'=> sanitize($rec['email']),                    
                    'zmeneno'=>$this->getNow(), 
                    'zmenil'=> $this->getUserID()]; 

            if($id < 0){
                dibi::query('insert into [org_telefoni_seznam]', $a);
                $id = dibi::query("select currval('org_telefoni_seznam_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [org_telefoni_seznam] SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("delete from [org_telefoni_seznam] where id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function Get($id=-1, $typ=0){
        
        
        if($id > -1){

            if($typ == 0){
                $dt = dibi::query("select a.*, 0 typ, null narozeni,
                            coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                            to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                        from [org_telefoni_seznam] a where id=%i", $id);
            }
            else{

                $dt = dibi::query("select id,  prijmeni || ' ' || jmeno nazev, mobil, email, telefon, to_char(datum_narozeni, 'DD.MM.YYYY')  narozeni, 1 typ,
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                        to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                    from [osoba] a where id=%i and platnost=true", $id);
              
            }

            $p = $dt->fetch();
            
            $r = (object) ['id'=>$p['id'], 
                    'nazev'=>$p['nazev'], 
                    'mobil'=>$p['mobil'], 
                    'telefon'=>$p['telefon'], 
                    'email'=>$p['email'], 
                    'narozeni'=>$p['narozeni'],
                    'typ'=> $p['typ'],
                    'zmeneno'=>$p['zmeneno'], 
                    'zmenil'=>$p['zmenil']
            ]; 

        }
        else{            
            $r = (object) ['id'=> -1, 
                        'typ'=> 0,
                        'nazev'=> '', 
                        'narozeni'=>'',
                        'mobil'=> '',
                        'telefon'=> '',                         
                        'email'=> '',                         
                        'zmeneno'=> '', 
                        'zmenil'=> -1
                    ]; 
        }
        
        
        return $r;
    }

    
}