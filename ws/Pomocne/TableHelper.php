<?php

namespace ws\Pomocne;

use dibi;

class TableHelper 
{
    
     
    public static function query($tabquery=null, $cols="", $from="", $where="1=1", $defSort=" id DESC"){
       
       $qsort = "";
       $page=0;
       $limit=20;
       $qwhere = "";
       $is_join = $tabquery !== null && isset($tabquery['q_join']) && intval($tabquery['q_join']) == 1;
       
       //    type: number = 0; // 0 - string, 1 - number, 2 - boolean
       // 0 - string, 1 - number, 2 - boolean, 3 - datum, 4 - datetime, 6-cele cislo
       if($tabquery != null){     
           
            if(isset($tabquery['clmn'])){
                
                $qsubwhere = "";
                foreach($tabquery['clmn'] as $h){
                    
                    $clmn = sanitize($h['clmn']);
                    
                    
                    if(isset($h['filter'])){

                        foreach($h['filter'] as $f){
                        
                            $type = !isset($h['type']) ? 0 : intval($h['type']);
                            
                            if(!isset($f['operator']) || intval($f['operator']) < 0 || $f['value'] === null){
                                continue;
                            }
    
                            if(strcmp($clmn, "id") == 0 || $type == 1 || $type == 6){
                                $qsubwhere .=  $clmn."=".$f['value'];    
                            }                            
                            else if($type == 0){
    
                                $qsubwhere .= "lower(".$clmn.")".TableHelper::operator($f['operator'], mb_strtolower($f['value']), 0);                                
                            }
                            else if($type == 2) {
    
                                $vv = true;
                                if(is_string($f['value'])){
                                    $vv = strcasecmp($f['value'], "true") == 0;                                
                                }
                                else{
                                    $vv = boolval($f['value']);
                                }
    
                                $vv = $vv ? 'True' : 'False';
                                $qsubwhere .=  $clmn."=".$vv;    
                            }
                            else if($type == 3 || $type == 4){
                                $qsubwhere .= $clmn.TableHelper::operator($f['operator'], mb_strtolower($f['value']), 0);                                
                            }                        
                            else{
                                $qsubwhere .=  $clmn."".TableHelper::operator($f['operator'], mb_strtolower($f['value']), 1);    
                            }
                            
                            $qsubwhere .= " OR ";
                        }

                        
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


                if(strlen($qsubwhere) > 0){
                            
                    $qsubwhere = rtrim($qsubwhere, "OR ");     
                    
                    if($is_join){
                        $qwhere .=  " OR (".$qsubwhere.")";
                    }
                    else{
                        $qwhere .=  " AND (".$qsubwhere.")";
                    }                            
                }
                
            }

            if(isset($tabquery['fulltext']) && count($tabquery['fulltext']) > 0){

                if(strlen($qwhere) > 0){
                    $qwhere .= " AND ";
                }

                $qwhere .=  "(";
                foreach($tabquery['fulltext'] as $f){
                    $qwhere .=   "lower(".sanitize($f['clmn']).") LIKE '%".mb_strtolower(sanitize($f['val']))."%' OR ";
                }

                $qwhere  = \rtrim($qwhere, " OR ");
                $qwhere .=  ")";

            }

            if(isset($tabquery['extrafilter']) && count($tabquery['extrafilter']) > 0){

                if(strlen($qwhere) > 0){
                    $qwhere .= " AND ";
                }

                $qwhere .=  "(";
                foreach($tabquery['extrafilter'] as $f){
                    
                    $type = !isset($f['type']) ? 0 : intval($f['type']);
                    $clmn = sanitize($f['clmn']);
                    $value = sanitize($f['value']);

                    if(!isset($f['operator']) || intval($f['operator']) < 0 || $value === null){
                        continue;
                    }

                    if(strcmp($clmn, "id") == 0 || $type == 1 || $type == 6){
                        $qwhere .=  $clmn."=".$value;    
                    }                            
                    else if($type == 0){

                        $qwhere .= "lower(".$clmn.")".TableHelper::operator($f['operator'], mb_strtolower($value), 0);                                
                    }
                    else if($type == 2) {

                        $vv = true;
                        if(is_string($value)){
                            $vv = strcasecmp($value, "true") == 0;                                
                        }
                        else{
                            $vv = boolval($value);
                        }

                        $vv = $vv ? 'True' : 'False';
                        $qwhere .=  $clmn."=".$vv;    
                    }
                    else if($type == 3 || $type == 4){
                        $qwhere .= $clmn.TableHelper::operator($f['operator'], mb_strtolower($value), 0);                                
                    }                        
                    else{
                        $qwhere .=  $clmn."".TableHelper::operator($f['operator'], mb_strtolower($value), 1);    
                    }

                }

                $qwhere  = \rtrim($qwhere, " AND ");
                $qwhere .=  ")";

            }

            
            $qsort = rtrim($qsort, ",");
            
            if(isset($tabquery['page'])){
                $page = intval($tabquery['page']);
            }
            
            if(isset($tabquery['limit'])){
                $limit = intval($tabquery['limit']);
                $limit = $limit < 1 ? 30 : $limit;
            }
       }
    
       
       $qsort = !empty($qsort) ? $qsort : $defSort;
       
       if($is_join){
         $qwhere  = ltrim($qwhere, " OR "); 
       }

       if(strlen($qwhere) > 0 && strcmp($where, "1=1") == 0){
            $where = "";
            $qwhere  = ltrim($qwhere, " AND ");
       }


       $q = "SELECT count(*) total FROM $from WHERE ".$where.$qwhere;   

       $total = dibi::query($q)->fetchSingle();
       
       $off = $page * $limit;       


       $q = "SELECT $cols FROM $from WHERE ".$where." ".$qwhere." ORDER BY ".$qsort." LIMIT ".$limit." OFFSET ".$off;
     
       
       $resp = ['total'=>$total, 'list'=> [], 'page'=>$page, 'limit'=>$limit, 'q'=> $q];       
       $data = dibi::query($q)->fetchAll();
       
       foreach($data as $d){
           
           $obj = [];
           foreach($d as $prop=>$val){
                $obj[$prop] = $val;    
           }
           
           if(count($obj) > 0){
                $resp['list'][] = (object) $obj;
           }
       }
       
       return $resp;
    }
    
    
    protected static function operator($op=0, $val, $isnum){
        
        /*   O_EQ = 0;O_MENSI = 1;O_VETSI = 2;O_MENSI_ROVNO = 3;O_VETSI_ROVNO = 4;O_RUZNE = 5;O_LIKE = 6;O_IN = 7;O_NOT_IN = 8; */        
        $r = "";
        $v  = $isnum ? $val : "'".sanitize($val)."'";
        switch($op){
            
            case 1: $r = " < ".$v; break;
            case 2: $r = " > ".$v; break;
            case 3: $r = " <= ".$v; break;
            case 4: $r = " >= ".$v; break;
            case 5: $r = " <> ".$v; break;
            case 6: $r = " LIKE '%".sanitize(mb_strtolower($val))."%'"; break;
            case 7: $r = " in (".$v.")"; break;
            case 8: $r = " not in (".$v.")"; break;            
            default: 
                $r = " = ".$v; 
                break;
        }
        
        return $r;        
    }
    
}