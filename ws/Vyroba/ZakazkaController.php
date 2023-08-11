<?php

namespace ws\Vyroba;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;

/** @controller */
class ZakazkaController
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
       
       $qsort = "";
       $page=0;
       $limit=20;
       $qwhere = "";
       
        dibi::disconnect();
        dibi::connect($sett['karat'], 'karat');
        $query = $tabquery;
                      
        if($query != null){     
           
            if(isset($query['clmn'])){
                
                foreach($query['clmn'] as $h){
                    
                    $clmn = sanitize($h['clmn']);
                    $qsubwhere = "";
                    
                    foreach($h['filter'] as $f){
                        
                        $type = !isset($h['type']) ? 0 : intval($h['type']);
                        
                        if(!isset($f['operator']) || intval($f['operator']) < 0){
                            continue;
                        }
                            
                        if($type == 0){
                            $qsubwhere .= "lower(".$clmn.")".TableHelper::operator($f['operator'], strtolower($f['value']), 0);                                
                        }
                        else if($type == 3){
                            $qsubwhere .= $clmn.TableHelper::operator($f['operator'], strtolower($f['value']), 0);                                
                        }
                        else{
                            $qsubwhere .=  $clmn."".TableHelper::operator($f['operator'], strtolower($f['value']), 1);    
                        }
                        
                        $qsubwhere .= " OR ";
                    }
                    
                    if(strlen($qsubwhere) > 0){                        
                        $qsubwhere = rtrim($qsubwhere, "OR ");                        
                        $qwhere .=  " AND (".$qsubwhere.")";
                    }
                    
                    if(isset($h['sort'])){
                        switch(intval($h['sort'])){
                            case 1:
                                $qsort .= " ".$clmn." ASC,";
                                break;
                            case 2:
                                $qsort .= " ".$clmn." DESC,";
                                break;
                        }
                    }
                }
                
            }
            
            $qsort = rtrim($qsort, ",");
            
            if(isset($query['page'])){
                $page = intval($query['page']);
            }
            
            if(isset($query['limit'])){
                $limit = intval($query['limit']);
                $limit = $limit < 1 ? 30 : $limit;
            }
       }
    
       $qsort = !empty($qsort) ? $qsort : "v.popis ASC, v.da_pl_zah ASC, v.da_pl_uk ASC";
        
        $q = "SELECT count(id) total  FROM (SELECT -1 id FROM dba.v_opvvyrza v WHERE v.xukonceno = 0 and v.storno = 0 and v.xpozastaveno = 0  and opv <> '') X WHERE 1=1 ".$qwhere;   
        
       $total = dibi::query($q)->fetchSingle();
       
       $off = $page * $limit;       
       $q = "WITH CTE AS (SELECT ROW_NUMBER() OVER (ORDER BY $qsort) as num, -1 id, sklad kod, opv extern_kod, nomenklatura tp_vyrobek, popis nazev, 
                da_po_uk, da_pl_zah, poznamka, planvyroba0 plan_ks, odvedeno odvedeno_ks, ( planvyroba0 -  odvedeno)zbyva_ks 
                FROM dba.v_opvvyrza v WHERE v.xukonceno = 0 and v.storno = 0 and v.xpozastaveno = 0  and opv <> '' $qwhere)
                SELECT *,  CONVERT(VARCHAR(20), da_po_uk, 104) datum_do, CONVERT(VARCHAR(20), da_pl_zah, 104) datum_od
                FROM CTE WHERE num > ".$off." and num <= ".($limit+$off); 
        /*
        $table = "( SELECT a.id, a.kod, a.extern_kod, a.tp_vyrobek, a.nazev, to_char(a.datum_od, 'DD.MM.YYYY HH24:MI') datum_od,
                    to_char(a.datum_od, 'DD.MM.YYYY HH24:MI') datum_do, a.ukoncen, a.plan_ks, a.odvedeno_ks, (a.plan_ks - a.odvedeno_ks) zbyva_ks,
                    a.poznamka, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM [vyr_zakazka] a) X ";*/
       
       //$resp = TableHelper::query($tabquery, "X.*", $table);
        
       $resp = ['total'=>$total, 'list'=> [], 'page'=>$page, 'limit'=>$limit];             
       $data = dibi::query($q)->fetchAll();
      
       foreach($data as $d){
           
           $obj = [];
           foreach($d as $prop=>$val){
                $obj[$prop] = $val;    
           }
           
           if(count($obj) > 0){
                $resp['list'][] = (object)$obj;
           }
       }
       
       dibi::disconnect(); 
       return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $nazev = sanitize($rec['nazev']);
        $kod = sanitize($rec['kod']);
        $platnost = $rec['platnost'] == 1 ? true : false;
        
        if(empty($nazev)){
            $r['kod'] = 1;
            $r['nazev'] = 'Název je prázdný!';
        }
        else if(empty($kod)){
            $r['kod'] = 1;
            $r['nazev'] = 'Kód je prázdný';
        }
        else{

            $a = [ 'nazev' => $nazev, 'kod' => $kod, 'zmenil' => $this->user->getId(),'platnost'=>$platnost];

            if($id < 0){
                dibi::query('insert into [cis_merne_jednotky]', $a);
                $id = dibi::query("select currval('merne_jednotky_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [cis_merne_jednotky] SET ', $a, ' WHERE id=%i', $id);
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
            dibi::query("delete from [cis_merne_jednotky] where id=%i", $id);
        }
        return $r;
    }

    

    /** @callable  */
    public function Get($id){
        
        
        if($id > -1){
            $dt = dibi::query("select a.*, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     from [cis_merne_jednotky] a where id=%i", $id);            
            $p = $dt->fetch();
            $r = (object) ['id'=>$p['id'], 'kod'=>$p['kod'], 'nazev'=>$p['nazev'], 'platnost'=>$p['platnost'],
                           'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'kod'=> '', 
                    'nazev'=> '',
                    'platnost'=> true, 
                    'zmeneno'=> '', 
                    'zmenil'=> '',
            ]; 
        }
        
        
        return $r;
    }
}