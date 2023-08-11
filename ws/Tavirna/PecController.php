<?php

namespace ws\Tavirna;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class PecController extends BaseController
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
        $table = "( SELECT a.id, a.kod, a.nazev, a.zdroj_id, a.platnost, a.poznamka, 
                    a.pec, a.kampan, a.tavba, a.rok,
                    coalesce((select kod || ' - ' || nazev  from cis_zdroj u where u.id = a.zdroj_id), '') as zdroj, 
                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM tavirna_pec a WHERE id > -1) X ";

        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $kod = sanitize($rec['kod']);
        $nazev = sanitize($rec['nazev']);
        $zdroj_id = intval($rec['zdroj_id']);   
        $poznamka = sanitize($rec['poznamka']);        
        $pec = sanitize($rec['pec']);
        $rok = sanitize($rec['rok']);
        $kampan = sanitize($rec['kampan']);
        $tavba = sanitize($rec['tavba']);
        $platnost = $rec['platnost'] == 1 ? true : false;
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'poznamka'=> $poznamka, 
                    'zdroj_id' => $zdroj_id, 'pec' => $pec,'rok' => $rok, 'kampan' => $kampan, 'tavba' => $tavba,
                    'priloha_hash' => sanitize($rec['priloha_hash']),
                    'zmeneno' => $this->getNow(),
                    'zmenil' => $this->getUserID(),'platnost'=>$platnost];

            if($id < 0){
                dibi::query('INSERT INTO tavirna_pec', $a);
                $id = dibi::query("select currval('tavirna_pece_id_seq')")->fetchSingle();                
            }
            else{
                dibi::query('UPDATE tavirna_pec SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("DELETE FROM tavirna_pec WHERE id=%i", $id);
        }
        return $r;
    }


      
    /** @callable  */
    public function Get($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*,
                     coalesce(z.kod, '') zdroj_kod, coalesce(z.nazev, '') zdroj_nazev,
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     from tavirna_pec a LEFT JOIN cis_zdroj z ON a.zdroj_id = z.id where a.id=%i", $id);

            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'nazev'=>$p['nazev'], 
                           'kod'=>$p['kod'], 'platnost'=>$p['platnost'],
                           'zdroj_id'=>$p['zdroj_id'], 'zdroj_kod' => $p['zdroj_kod'], 'zdroj_nazev' => $p['zdroj_nazev'],
                           'pec' => $p['pec'], 'rok'=> $p['rok'], 'kampan' => $p['kampan'], 'tavba' => $p['tavba'],
                           'poznamka'=>$p['poznamka'], 
                           'priloha_hash' => $p['priloha_hash'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{

            $r = (object) [
                    'id'=> -1,
                    'kod'=> '',
                    'nazev'=> '',
                    'zdroj_id' => -1,
                    'zdroj_kod' => '',
                    'zdroj_nazev' => '',
                    'pec' => '0',
                    'kampan' => '000',
                    'tavba' => '000',  
                    'rok' => $this->getFiskalniRok(),
                    'poznamka'=> '',                    
                    'platnost'=> true, 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
                    'priloha_hash'=> 'tavirna/pec/'.time().'-'.rand(0, 100)
            ]; 
        }
        
        return $r;
    }


    /** @callable  */
    public function GetHistorieKampane($pecid=-1, $tabquery=null){

        $table = "( SELECT a.id,a.pec, a.kampan, a.tavba, a.rok, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno ,         
        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
        FROM tavirna_kampane_historie a WHERE pec_id = {$pecid}) X ";

        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


}