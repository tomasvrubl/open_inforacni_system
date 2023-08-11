<?php

namespace ws\Tavirna;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class LabController extends BaseController
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
        $table = "( SELECT a.*,
                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM tavirna_lab_vzorky a WHERE id > -1) X ";
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $cislo_tavby = sanitize($rec['cislo_tavby']);
        $id = intval($rec['id']);
        
        if(empty($cislo_tavby)){
            $r['kod'] = 1;
            $r['nazev'] = 'Není zadáno číslo tavby!';
        }
        else{

            $a = [
                'cislo_tavby' => $cislo_tavby,
                'buben' => intval($rec['buben']),
                'poradi' => intval($rec['poradi']),
                'datum' => sanitize($rec['datum']),    
                'material' => sanitize($rec['material']),
                'laborant' => sanitize($rec['laborant']),
                'istvarna' => $rec['istvarna'] == 1 ? true : false,
                'platnost' => $rec['platnost'] == 1 ? true : false,    
                'lab_c' => floatval($rec['lab_c']),
                'lab_si' => floatval($rec['lab_si']),
                'lab_mn' => floatval($rec['lab_mn']),
                'lab_p' => floatval($rec['lab_p']),
                'lab_cr' => floatval($rec['lab_cr']),
                'lab_ni' => floatval($rec['lab_ni']),
                'lab_cu' => floatval($rec['lab_cu']),
                'lab_al' => floatval($rec['lab_al']),
                'lab_mg' => floatval($rec['lab_mg']),
                'lab_zbyt_mg' => floatval($rec['lab_zbyt_mg']),
                'priloha_hash' => sanitize($rec['priloha_hash']),
                'zmeneno' => $this->getNow(),
                'zmenil' => $this->getUserID()
            ];


            if($id < 0){
                dibi::query('INSERT INTO tavirna_lab_vzorky', $a);
                $id = dibi::query("select currval('tavirna_lab_vzorky_id_seq')")->fetchSingle();                
            }
            else{
                dibi::query('UPDATE tavirna_lab_vzorky SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("DELETE FROM tavirna_lab_vzorky WHERE id=%i", $id);
        }
        return $r;
    }


      
    /** @callable  */
    public function Get($id=-1){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*,
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     FROM tavirna_lab_vzorky a WHERE a.id=%i", $id);

            $rec = $dt->fetch();

            $r = (object) [
                'id' => $rec['id'],
                'cislo_tavby' => $rec['cislo_tavby'],
                'buben' => $rec['buben'],
                'poradi' => $rec['poradi'],
                'datum' => $rec['datum'],
                'material' => $rec['material'],
                'norma' => $rec['norma'],
                'eutekt_sc' => $rec['eutekt_sc'],
                'laborant' => $rec['laborant'],
                'istvarna' => $rec['istvarna'] == 1 ? true : false,
                'platnost' => $rec['platnost'] == 1 ? true : false,    
                'lab_c' =>  $rec['lab_c'],
                'lab_si' => $rec['lab_si'],
                'lab_mn' => $rec['lab_mn'],
                'lab_p' =>  $rec['lab_p'],
                'lab_cr' => $rec['lab_cr'],
                'lab_ni' => $rec['lab_ni'],
                'lab_cu' => $rec['lab_cu'],
                'lab_al' => $rec['lab_al'],
                'lab_mg' => $rec['lab_mg'],
                'lab_zbyt_mg' => $rec['lab_zbyt_mg'],
                'priloha_hash' => $rec['priloha_hash'],
                'zmeneno' => $rec['zmeneno'],
                'zmenil' => $rec['zmenil']
            ];

        }
        else{

            $r = (object) [
                    'id' => -1,
                    'cislo_tavby' => '',
                    'buben' => 0,
                    'poradi' => 1,
                    'datum' => $this->getToday(),
                    'material' => '',
                    'norma' => '',
                    'eutekt_sc' => 0,
                    'laborant' => $this->getPrijmeniJmeno(),
                    'istvarna' => true,
                    'platnost' => true,
                    'lab_c' =>  0,
                    'lab_si' => 0,
                    'lab_mn' => 0,
                    'lab_p' =>  0,
                    'lab_cr' => 0,
                    'lab_ni' => 0,
                    'lab_cu' => 0,
                    'lab_al' => 0,
                    'lab_mg' => 0,
                    'lab_zbyt_mg' => 0,
                    'zmeneno'=> '', 
                    'zmenil'=> '',
                    'priloha_hash'=> 'tavirna/laborator/vzorek'.time().'-'.rand(0, 100)
            ]; 
        }
        
        return $r;
    }



}