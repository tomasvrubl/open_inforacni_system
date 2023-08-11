<?php

namespace ws\Cestak;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class AutaController extends BaseController
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
    public function autoTable($tabquery=null)
    {
        
       $cols = "X.*";
       $table = "(SELECT a.*, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, "
                    . " coalesce((select prijmeni || ' ' || jmeno osoba from osoba o where o.id = a.osoba_id), '') as osoba "
                    . " FROM com_auto a ) X";
       
       $resp = TableHelper::query($tabquery, $cols, $table);
       return $resp;
    }

    /** @callable  */
    public function autoOsoba($osobaid = -1)
    {
        
        $oid = intval($osobaid);
        $db = dibi::query("select a.*, coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as szmenil, 
                     coalesce((select prijmeni || ' ' || jmeno  from osoba o where o.id = osoba_id), '') as osoba,
                     coalesce((select oscislo  from  osoba o where o.id = osoba_id), '') as osoba_oscislo,
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') szmeneno 
                     from [com_auto] a where osoba_id=%i order by nazev asc, zmeneno desc", $oid);
        
        $dt = $db->fetchAll();
        $resp = [];
        foreach($dt as $d){
            $resp[] = (object) ['id'=>$d->id,
                                'nazev'=>$d->nazev, 
                                'spz'=>$d->spz,
                                'vs'=>$d->vs, 
                                'ciskarty'=>$d->ciskarty, 
                                'natural'=>$d->natural, 
                                'lpg'=>$d->lpg, 
                                'diesel'=>$d->diesel,
                                'kwh'=>$d->kwh,
                                'kwh_spotreba'=>$d->kwh_spotreba,
                                'kwh_baterie'=>$d->kwh_baterie,
                                'nadrz_l'=>$d->nadrz_l,
                                'osoba'=>$d->osoba, 
                                'osoba_oscislo'=>$d->osoba_oscislo, 
                                'osoba_id'=>$d->osoba_id, 
                                'stavkm'=>$d->stavkm, 
                                'zmeneno'=>$d->szmeneno, 
                                'zmenil'=>$d->szmenil,
                                'def_palivo' => $d->def_palivo,
                                'prum_spotreba' => $d->prum_spotreba];
        }

        return $resp;
    }
            
    /** @callable  */
    public function autoAdd($rec)
    {
                
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
        
        $id = intval($rec['id']);
        $osobaid = intval($rec['osoba_id']);
        $nazev = sanitize($rec['nazev']);
        $spz = sanitize($rec['spz']);
        $vs = sanitize($rec['vs']);
        $ciskarty = sanitize($rec['ciskarty']);
        $diesel = $rec['diesel'] == 1 ? true : false;
        $natural = $rec['natural'] == 1 ? true : false;
        $lpg = $rec['lpg'] == 1 ? true : false;
        $kwh = $rec['kwh'] == 1 ? true : false;

        $platnost = $rec['platnost'] == 1 ? true : false;

        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název auta je prázdný!';
        }
        else if(empty($spz)){
            $r['kod'] = 1;
            $r['nazev'] = 'Není zadána spz!';
        }
        else{

            $a = [ 'nazev' => $nazev, 'spz' => $spz, 'osoba_id'=> $osobaid, 'zmenil' => $this->user->getId(), 'stavkm'=> $rec['stavkm'],
                'vs'=>$vs, 'ciskarty'=>$ciskarty, 'natural'=>$natural, 'lpg'=>$lpg, 'diesel'=>$diesel, 'kwh_spotreba'=> floatval($rec['kwh_spotreba']), 
                'kwh_baterie'=> intval($rec['kwh_baterie']), 'kwh'=> $kwh, 'platnost' => $platnost,
                'def_palivo' => intval($rec['def_palivo']), 'prum_spotreba'=>  floatval($rec['prum_spotreba']), 'nadrz_l'=> intval($rec['nadrz_l'])
            ];

            if($id < 0){
                dibi::query('insert into [com_auto]', $a);
                $id = dibi::query("select currval('com_auto_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [com_auto] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getAuto($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function autoDrop($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query('delete from [com_auto] where id=%i', $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function getAuto($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as szmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') szmeneno, 
                     coalesce((select prijmeni || ' ' || jmeno  from  osoba o where o.id = osoba_id), '') as osoba, 
                     coalesce((select oscislo  from  osoba o where o.id = osoba_id), '') as osoba_oscislo 
                     from com_auto a where id=%i", $id);
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'spz'=>$p['spz'], 'nazev'=>$p['nazev'],
                'vs'=>$p['vs'], 'ciskarty'=>$p['ciskarty'], 'natural'=>$p['natural'], 'lpg'=>$p['lpg'], 'diesel'=>$p['diesel'], 'kwh'=>$p['kwh'],
                'kwh_baterie'=>$p['kwh_baterie'], 'kwh_spotreba'=>$p['kwh_spotreba'], 'platnost'=> $p['platnost'],
                'osoba'=>$p['osoba'], 'osoba_oscislo'=>$p['osoba_oscislo'], 'osoba_id'=>$p['osoba_id'], 'zmeneno'=>$p['szmeneno'], 'stavkm'=>$p['stavkm'], 'zmenil'=>$p['szmenil'],
                'def_palivo' => $p['def_palivo'], 'prum_spotreba'=>$p['prum_spotreba'], 'nadrz_l'=>$p['nadrz_l']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1, 
                    'spz'=> '', 
                    'nazev'=> '',
                    'platnost'=> true,
                    'vs'=>'', 
                    'ciskarty'=> '', 
                    'natural'=> false, 
                    'lpg'=> false, 
                    'diesel'=> false,
                    'kwh'=> false,                    
                    'kwh_baterie'=> 0,
                    'kwh_spotreba'=> 0,
                    'osoba'=>  '',
                    'osoba_id'=> -1, 
                    'osoba_oscislo' => '',
                    'zmeneno'=> '', 
                    'stavkm'=>0, 
                    'zmenil'=> '',
                    'def_palivo' => 0, 
                    'prum_spotreba'=>0, 
                    'nadrz_l'=>0
            ]; 
        }
        
        
        return $r;
    }
}