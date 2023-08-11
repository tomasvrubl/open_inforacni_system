<?php

namespace ws\Vyroba;

use dibi;
use Nette\Security\User;
use ws\Pomocne\TableHelper;

/** @controller */
class PlanController extends TableHelper
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
    
     /** @callable */
    public function getZaplanovaneDny($zid=-1, $mesic=-1, $rok=-1){
        
        $r = ['kod'=> 0, 'nazev' => 'OK', 'data'=> []];
        
        $dt = dibi::query("SELECT to_char(datum, 'DD.MM.YYYY') den FROM pl_plan 
                     WHERE extract(year from datum)=%i and extract(month from datum)=%i and zdroj_id=%i group by datum", $rok, $mesic, $zid)->fetchAll();
        
        foreach($dt as $d){
            $r['data'][] = $d['den'];
        }
        
        return $r;        
    }
    
    /** @callable 
     *  hledej ve vyrobnich zakazkach 
     **/
    public function findVZ($zdrojid=-1, $query=null){
         
       $zdroj = dibi::query("select kod from [cis_zdroj] where id=%i", intval($zdrojid))->fetch();        
       
       dibi::disconnect();
       dibi::connect($sett['karat'], 'karat');
    
        
       $qsort = "";
       $page=0;
       $limit=20;
       $qwhere = "";
       
       //    type: number = 0; // 0 - string, 1 - number, 2 - boolean
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
       
       $q = "SELECT count(*) total  FROM ("
               . " SELECT v.opv as kod, (select top 1 popis from  dba.user_forma_pozor fp where fp.nomenklatura = v.nomenklatura) pokyn, "
               . "v.odvedeno, 0 zaplanovano, (v.planvyroba0 - v.odvedeno) zbyva, v.nomenklatura , v.popis as nazev, '' as poznamka, "
               . "v.planvyroba0 as mnozstvi, da_pl_zah platnost_od, da_pl_uk platnost_do "
               . " FROM dba.v_opvvyrza v INNER JOIN dba.v_opvoper o ON v.opv = o.opv "
               . "   WHERE o.zdroj='".$zdroj['kod']."' and v.xukonceno=0 and v.xuzavreno=0 and v.opv <> '' and v.storno <> 1 ) X WHERE 1=1 ".$qwhere;   
       
       
       $total = dibi::query($q)->fetchSingle();
       
       $off = $page * $limit;       
       $q = "WITH CTE AS (SELECT ROW_NUMBER() OVER (ORDER BY $qsort) as num, 0 zaplanovano, v.opv kod, (select top 1 popis from  dba.user_forma_pozor fp where fp.nomenklatura = v.nomenklatura) pokyn,
                 v.postup, v.nomenklatura , v.popis nazev, '' poznamka, v.planvyroba0 mnozstvi, v.odvedeno, 
                v.da_pl_uk platnost_do, v.da_pl_zah platnost_od, (v.planvyroba0 - v.odvedeno) zbyva
                FROM dba.v_opvvyrza v INNER JOIN dba.v_opvoper o ON v.opv = o.opv
                WHERE o.zdroj='".$zdroj['kod']."' and v.xukonceno=0 and v.xuzavreno=0 and v.opv <> ''
                and v.storno <> 1  $qwhere)
                SELECT kod, odvedeno, zaplanovano, zbyva, nomenklatura, nazev, poznamka, mnozstvi, platnost_od, platnost_do
                FROM CTE WHERE num > ".$off." and num <= ".($limit+$off);
     
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
    
    /** @callable */
    public function updatePlan($rec=null){
        
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
        
        if($rec == null){
            $r['kod'] = 1;
            $r['nazev'] = 'Neplatné vstupní data';
            return $r;
        }
         
        $id = intval($rec['id']);
        
        $a = [
            'datum' => $rec['datum'],
            'zdroj_id' => $rec['zdroj_id'],
            'kalendar_id' => $rec['kalendar_id'],
            'pracoviste_id' => $rec['pracoviste_id'],
            'zmenil' => $this->user->getId()
        ];
        
        $pid = dibi::query("select id from [pl_plan] where datum=%s and zdroj_id=%i and kalendar_id=%i and pracoviste_id=%i", 
                        $rec['datum'], $rec['zdroj_id'], $rec['kalendar_id'], $rec['pracoviste_id'])->fetchSingle();
        
        $id = !$pid ? $id : $pid;
        
        if($id < 0){
            dibi::query('insert into [pl_plan]', $a);
            $id = dibi::query("select currval('pl_plan_id_seq')")->fetchSingle();
        }
        else{
           dibi::query('UPDATE [pl_plan] SET ', $a, ' WHERE id=%i', $id);
           $r['nazev'] = 'Záznam aktualizován';
        }

        
        if(count($rec['polozky']) > 0){
            $this->updatePolozky($rec['polozky'], $id);            
        }
        
        $r['data'] = $this->getPlan($rec['datum'], $rec['zdroj_id'], $rec['kalendar_id']);        
        return $r;        
    }
    
    /** @callable */
    public function getPlan($datum=null, $zid=-1, $kid=-1){
       
        $p = dibi::query("SELECT p.*,
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = p.zmenil), '') as zmenil, 
                     to_char(p.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno
                 FROM [pl_plan] p WHERE datum=%s and zdroj_id=%i and kalendar_id=%i", $datum, $zid, $kid)->fetch();
        
        
        $datum = $datum == null ?  date('d.m.Y') : $datum;
        if(!$p){
            
            $p = ['id'=> -1,
                  'datum'=> $datum,
                  'zdroj_id'=>$zid,
                  'kalendar_id'=>$kid,
                  'pracoviste_id'=> dibi::query("select pracoviste_id from [cis_zdroj] where id=%i", $zid)->fetchSingle(),
                  'zmeneno'=> $datum,
                  'zmenil'=> $this->user->getId()
                    
            ];
        }
        
        
        $r = [
            'id' => $p['id'],
            'datum' => $p['datum'],
            'zdroj_id' => $p['zdroj_id'],
            'kalendar_id' => $p['kalendar_id'],
            'pracoviste_id' => $p['pracoviste_id'],
            'zmenil' => $p['zmenil'],
            'zmeneno' => $p['zmeneno'],
            'polozky' => $this->getPolozky($p['id'])
        ];
       
        return $r;
    }
    
    /** @callable */
    public function dropPlan($id=-1){
    
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [pl_plan] where id=%i", $id);
        }
        else {
            $r['kod'] = 1;
            $r['nazev'] = 'Plán nelze odstranit. Není v DB';
        }
        
        return $r;
    }
    
    
    
    public function updatePolozky($rec=[], $planid=-1){
        
         $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];        
         $lst = [];
         
         $sv = [];
         foreach($rec as $p){
             
             $id = intval($p['id']);             
             $a = ['plan_id'=> $planid,
                   'poradi' => $p['poradi'],
                   'vyr_zakazka_kod' => trim($p['vyr_zakazka_kod']),
                   'nazev'=> trim($p['nazev']),
                   'pokyn'=> trim($p['pokyn']),
                   'kalendar_id' => $p['kalendar_id'],
                   'kalendar_smena_id'=> $p['kalendar_smena_id'],
                   'mnozstvi'=> $p['mnozstvi'],
                   'skupina' => $p['skupina'],
                   'zmenil' => $this->user->getId(),                 
                   'vyrobek' => trim($p['vyrobek'])];
             
             if($id < 0){
                dibi::query('INSERT INTO [pl_plan_pol]', $a);
                $id = dibi::query("SELECT currval('pl_plan_pol_id_seq')")->fetchSingle();

             }
             else{
                dibi::query('UPDATE [pl_plan_pol] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
             }
             
             $sv[] = $id;                          
             $p['id'] = $id;             
             $lst[] = $p;
         }
         
         
         dibi::query('DELETE FROM [pl_plan_pol] WHERE plan_id=%i and id not in ('.implode(",", $sv).')', $planid);
         
         $r['data'] = $lst;        
         return $r;        
    }
    
    
    public function getPolozky($planid=-1){
        
        $r = [];
        if($planid < 0){
            return $r;
        }
               
        $dt = dibi::query("select p.*, 
                  coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = p.zmenil), '') as zmenil, 
                  to_char(p.zmeneno, 'DD.MM.YYYY HH24:MI:SS') szmeneno
                  from [pl_plan_pol] p where p.plan_id=%i ", $planid)->fetchAll();
       
        
        foreach($dt as $p){
            
            $r[] = (object) [
                   'id'=> $p['id'],
                   'vyr_zakazka_kod' => $p['vyr_zakazka_kod'],
                   'nazev'=> $p['nazev'],
                   'pokyn'=>$p['pokyn'],
                   'kalendar_id' => $p['kalendar_id'],
                   'kalendar_smena_id'=>$p['kalendar_smena_id'],
                   'mnozstvi'=> $p['mnozstvi'],
                   'plan_id'=> $p['plan_id'],
                   'poradi' => $p['poradi'],
                   'skupina' => $p['skupina'],
                   'zmenil' => $p['zmenil'],
                   'zmeneno' => $p['szmeneno'],
                   'vyrobek' => $p['vyrobek'],
                   '_odvedeno' => 0,
                   '_zbyva' => 0,
                   '_plan' => 0
            ];
            
        }
        
        return $r;
    }
    
            
    
}