<?php

namespace ws\Ciselnik;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class OperaceController extends BaseController
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
        $table = "(SELECT a.id, a.nazev, a.platnost, a.poznamka, a.zmeneno, 
                 coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                 FROM cis_operace a) X";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }
    
    /** @callable  */
    public function getTableZdroj($tabquery=null)
    {
       $table = "(SELECT z.id, z.kod, z.nazev, z.platnost, o.operace_id, coalesce((select nazev from kalendar k where k.id = z.kalendar_id), '') z_kalendar 
                     FROM cis_operace_zdroj o INNER JOIN cis_zdroj z ON o.zdroj_id = z.id) X";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }
    

    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $nazev = sanitize($rec['nazev']);
        $poznamka = sanitize($rec['poznamka']);                
        $platnost = $rec['platnost'] == 1 ? true : false;

        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else{

            $a = [ 'nazev' => $nazev, 
                   'poznamka'=> $poznamka, 
                   'platnost'=>$platnost,
                   'zmenil' => $this->user->getId()];

            if($id < 0){
                dibi::query('insert into [cis_operace]', $a);
                $id = dibi::query("select currval('cis_operace_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [cis_operace] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getOperace($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [cis_operace] where id=%i", $id);
        }
        return $r;
    }

    
    /** @callable  */
    public function getOperace($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                                 coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                                 to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                             from cis_operace a where id=%i", $id);
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                        'poznamka'=>$p['poznamka'],'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 

        }
        else{            
            $r = (object) [
                'id'=> -1,
                'nazev'=> '',
                'platnost'=> true, 
                'poznamka' => '',
                'zmeneno'=> '', 
                'zmenil'=> ''
            ]; 
        }
        
        
        return $r;
    }

    
    /** @callable  */
    public function unlinkOperaceZdroj($id=-1){
        
        $r = ['kod'=> 0, 'nazev' => 'Zdroj odpárován z operace.', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from  [cis_operace_zdroj] where id=%i", $id);
        }
        else{
            $r['kod'] = 1;
            $r['nazev'] = 'Nelze odlinkovat zdroj, id je -1';
        }
        
        return $r;        
    }
    
    /** @callable  */
    public function linkOperaceZdroj($id=-1, $list=array()){
        
        $r = ['kod'=> 0, 'nazev' => 'Zdroje přidány k operaci', 'data'=> null];
        $id = intval($id);
        
        if(count($list) > 0 && $id > 0){
            
            $a = [ 'zdroj_id' => -1, 
                   'operace_id'=> $id, 
                   'zmenil' => $this->user->getId()];
            
            foreach($list as $l){                        
                $a['zdroj_id'] = intval($l);
                dibi::query('insert into [cis_operace]', $a);
            }
        }
        else{
            $r['kod'] = 1;
            $r['nazev'] = 'Nelze přidat zdroje k operaci.';            
        }
        
        
        return $r;        
    }
    
}