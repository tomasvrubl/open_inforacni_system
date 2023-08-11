<?php

namespace ws\Cestak;

use dibi;
use Nette\Security\User;
use ws\Security\UserController;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/**
 * Class CestakController
 * @package ws\Cestak
 * @controller
 */
class CestakController extends BaseController
{
    
    /** @callable  */
    public function reportVykazTable($tabquery=null)
    {
        
         
        
        $cols = " X.id, X.rok, X.mesic, X.total_km, X.palivo_nakup_kc, X.ost_kc, X.zmenil, X.zmeneno, X.osoba, X.auto, X.spz";
        $oid = intval($this->getOsobaID());
        
        if($this->isAdmin()){
            $from = "(SELECT a.id, a.rok, a.mesic,
                (a.konecny_stav - a.pocatecni_stav) total_km, 
                (a.diesel_palivo_nakup_kc + a.natural_palivo_nakup_kc + a.lpg_palivo_nakup_kc + a.lpg_palivo_nakup_kc + a.kwh_nabijeni_kc) as palivo_nakup_kc, a.ost_kc,                
                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                a.zmeneno,
                coalesce((select prijmeni || ' ' || jmeno  from osoba u where u.id = a.osoba_id), '') as osoba, 
                ca.nazev as auto, ca.spz FROM [com_auto_vykaz_sumar] a LEFT JOIN [com_auto] ca ON a.auto_id = ca.id) X";
        }
        else{
            $from = "(SELECT a.id, a.rok, a.mesic,
                (a.konecny_stav - a.pocatecni_stav) total_km, 
                (a.diesel_palivo_nakup_kc + a.natural_palivo_nakup_kc + a.lpg_palivo_nakup_kc + a.kwh_nabijeni_kc) as palivo_nakup_kc, a.ost_kc,                
                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                a.zmeneno,
                coalesce((select prijmeni || ' ' || jmeno  from osoba u where u.id = a.osoba_id), '') as osoba, 
                ca.nazev as auto, ca.spz FROM [com_auto_vykaz_sumar] a LEFT JOIN [com_auto] ca ON a.auto_id = ca.id WHERE a.osoba_id={$oid}) X";  
        }
        
       $resp = TableHelper::query($tabquery, $cols, $from);
       return $resp;
    }
    
    
    /** @callable  */
    public function getVykazList($sumar_id =-1, $rok=-1, $mesic=-1, $auto_id=-1)
    {
          $sid = intval($sumar_id);   
          $m = intval($mesic);
          $r = intval($rok);

          $sdate = $r."-".$m."-1";
          $edate = date("Y-m-t", strtotime($sdate));

          $q = "SELECT to_char(CAL.datum, 'YYYY-MM-DD') datum, 
                  coalesce(v.id, -1) id, 
                  coalesce(v.cesta, '') cesta, 
                  coalesce(v.km, 0) km, 
                  coalesce(v.km_private, 0) km_private, 
                  coalesce(v.tankovani_kc, 0) tankovani_kc, 
                  coalesce(v.tankovani_l, 0) tankovani_l, 
                  coalesce(v.ost_vyd_kc, 0) ost_vyd_kc, 
                  coalesce(v.ost_vyd, '') ost_vyd,
                  coalesce(v.natural, false) v_natural,
                  coalesce(v.diesel, false) diesel,
                  coalesce(v.lpg, false) lpg,
                  coalesce(v.kwh, false) kwh,
                  coalesce(v.poradi, 0) poradi,
                  coalesce(v.nabijeni_kc, 0) nabijeni_kc,
                  coalesce(v.nabijeni_kwh, 0) nabijeni_kwh
          FROM (select * from com_auto_vykaz where auto_vykaz_sumar_id={$sid}) v 
              RIGHT JOIN (SELECT date_trunc('day', dd)::date datum 
                          FROM generate_series( '{$sdate}'::date, '{$edate}'::date, '1 day'::interval) dd) CAL
          ON v.datum = CAL.datum ORDER BY CAL.datum ASC, v.poradi ASC";
                          
          
          $dfp = dibi::query("SELECT def_palivo FROM com_auto WHERE id=%i", $auto_id)->fetchSingle();
          $dt = dibi::query($q);

          $resp = [];
          foreach($dt as $d){                  
              
              
              if(!$d['v_natural'] && !$d['diesel'] && !$d['lpg'] && !$d['kwh']){                  
                  switch($dfp){                     
                     case 1: 
                            $d['v_natural'] = true;
                            break;             
                      case 2:
                            $d['diesel'] = true;
                            break;
                      case 3:
                            $d['lpg'] = true;
                            break;                        
                      case 4:
                            $d['kwh'] = true;
                            break;
                      default:
                          $d['diesel'] = true;
                          break;
                  }                  
              }

             
              $resp[] = (object) [
                  'id' => $d['id'],
                  'auto_vykaz_sumar_id' => $sid,
                  'datum' => $d['datum'],
                  'cesta' => $d['cesta'],
                  'km' => $d['km'],
                  'km_private' => $d['km_private'],
                  'tankovanikc' => $d['tankovani_kc'],
                  'tankovanil' => $d['tankovani_l'],
                  'ovydkc' => $d['ost_vyd_kc'],
                  'ovyd' => $d['ost_vyd'],
                  'natural' => $d['v_natural'],
                  'diesel' => $d['diesel'],
                  'lpg' => $d['lpg'],
                  'kwh' => $d['kwh'],
                  'nabijeni_kc' => $d['nabijeni_kc'],
                  'nabijeni_kwh' => $d['nabijeni_kwh'],
                  'poradi'=>$d['poradi']
              ];
          }

          return $resp;
    }

    
    public function saveVykazList($sumar_id=-1, $list=array())
    {
        
        if($sumar_id < 0){            
            throw new Exception("Chyba reference ID není zadána. Systémová chyba.");
        }
        
        $id = -1;
        $ids = [];
        foreach($list as $i){

            $l = (array) $i;

            $id = $l['id'];
            $datum = $l['datum'];
            $a = [ 'datum'=> $datum,
                'cesta'=> sanitize($l['cesta']),
                'km'=> intval($l['km']),                
                'km_private'=> intval($l['km_private']),
                'tankovani_kc' => floatval($l['tankovanikc']),
                'tankovani_l' => floatval($l['tankovanil']),                
                'nabijeni_kc' => floatval($l['nabijeni_kc']),
                'nabijeni_kwh' => floatval($l['nabijeni_kwh']),
                'ost_vyd_kc' => floatval($l['ovydkc']),
                'ost_vyd' => sanitize($l['ovyd']),
                'natural' => intval($l['natural']) == 1,
                'diesel' => intval($l['diesel']) == 1,
                'lpg' => intval($l['lpg']) == 1,
                'kwh' => intval($l['kwh']) == 1,
                'auto_vykaz_sumar_id' => intval($sumar_id),
                'zmenil'=> $this->getUserID(),
                'zmeneno'=> $this->getNow(),
                'poradi'=> intval($l['poradi'])
            ];
            
            if($id < 0){
                dibi::query('insert into [com_auto_vykaz]', $a);
                $id = dibi::query("select currval('com_auto_vykaz_id_seq')")->fetchSingle();                
            }
            else{
                dibi::query('UPDATE [com_auto_vykaz] SET ', $a, 'WHERE  id=%i', $id);
            }
            
            $ids[] = $id;
        }
        
        if(count($ids) > 0){
            dibi::query('DELETE FROM [com_auto_vykaz] WHERE auto_vykaz_sumar_id=%i and id not in ('.implode(",", $ids).") ", $sumar_id);    
        }

    }
    
    /** @callable  */
    public function getMesicniVykaz($id=-1, $mesic=-1, $rok=-1){
        
        
        $db = dibi::query("SELECT s.*,  o.prijmeni || ' ' || o.jmeno as osoba, o.oscislo,
                                (SELECT nazev FROM com_auto os WHERE os.id = s.auto_id ORDER BY nazev LIMIT 1) auto_nazev,
                                (SELECT spz FROM com_auto os WHERE os.id = s.auto_id ORDER BY nazev LIMIT 1) auto_spz
                            FROM [com_auto_vykaz_sumar]  s
                                LEFT JOIN [osoba] o on s.osoba_id = o.id
                            WHERE s.id=%i LIMIT 1", $id);        
        $d = $db->fetch();

        if($d){
            $o = (object) ['id'=>$d['id'],
                    'autoid'=>$d['auto_id'], 
                    'auto_nazev'=> $d['auto_nazev'],
                    'auto_spz'=> $d['auto_spz'],
                    'osobaid'=>$d['osoba_id'],
                    'osoba_osoba'=>$d['osoba'], 
                    'osoba_oscislo'=>$d['oscislo'], 
                    'rok'=> intval($d['rok']),
                    'mesic'=> intval($d['mesic']), 
                    'poc_stav'=> $d['pocatecni_stav'], 
                    'kon_stav'=> $d['konecny_stav'], 
                    'diesel_prum_spotreba'=> $d['diesel_prum_spotreba'],
                    'diesel_palivo_nakup_l'=> $d['diesel_palivo_nakup_l'],
                    'diesel_palivo_nakup_prumkc'=> $d['diesel_palivo_nakup_prumkc'],
                    'diesel_palivo_nakup_kc'=> $d['diesel_palivo_nakup_kc'],
                    'diesel_poc_stav_l'=> $d['diesel_pocatecni_stav_l'],
                    'diesel_kon_stav_l'=> $d['diesel_konecny_stav_l'],           

                    'natural_prum_spotreba'=> $d['natural_prum_spotreba'],
                    'natural_palivo_nakup_l'=> $d['natural_palivo_nakup_l'],
                    'natural_palivo_nakup_prumkc'=> $d['natural_palivo_nakup_prumkc'],
                    'natural_palivo_nakup_kc'=> $d['natural_palivo_nakup_kc'],
                    'natural_poc_stav_l'=> $d['natural_pocatecni_stav_l'],
                    'natural_kon_stav_l'=> $d['natural_konecny_stav_l'],           
                    'lpg_prum_spotreba'=> $d['lpg_prum_spotreba'],
                    'lpg_palivo_nakup_l'=> $d['lpg_palivo_nakup_l'],
                    'lpg_palivo_nakup_prumkc'=> $d['lpg_palivo_nakup_prumkc'],
                    'lpg_palivo_nakup_kc'=> $d['lpg_palivo_nakup_kc'],
                    'lpg_poc_stav_l'=> $d['lpg_pocatecni_stav_l'],
                    'lpg_kon_stav_l'=> $d['lpg_konecny_stav_l'],                        
                    'kwh_nabijeni' => $d['kwh_nabijeni'],
                    'kwh_nabijeni_prumkc' => $d['kwh_nabijeni_prumkc'],
                    'kwh_nabijeni_kc' => $d['kwh_nabijeni_kc'],
                    'kwh_pocatecni_stav' => $d['kwh_pocatecni_stav'],
                    'kwh_konecny_stav' => $d['kwh_konecny_stav'],
                    'kwh_prum_spotreba' => $d['kwh_prum_spotreba'],
                    'ost_kc'=> $d['ost_kc'],                
                    'list' => $this->getVykazList($d['id'], $d['rok'], $d['mesic'], $d['auto_id'])
                ];
        }
        else{

            $prevtimestamp = strtotime(date('Y-m')." -1 month");
            
            $rok = $rok < 0 ? intval(date('Y', $prevtimestamp)) : $rok;
            $mesic = $mesic < 0 ? intval(date('m', $prevtimestamp)) : $mesic;
            $osoba_id = $this->getOsobaID();
            $auto_id = -1;
            $auto_spz = '';
            $auto_nazev = '';
            $poc_stav_km = 0;


            $dba = dibi::query("SELECT id FROM [com_auto_vykaz_sumar] WHERE rok=%i and mesic=%i and osoba_id=%i limit 1",
                         $rok, $mesic, $osoba_id)->fetch();  
            
            if($dba){
                return $this->getMesicniVykaz($dba['id'], $rok, $mesic);
            }


            $diesel_l =  $lpg_l = $natural_l = $kwh = 0;

            $dba = dibi::query("SELECT * FROM com_auto WHERE osoba_id = %i ORDER BY nazev LIMIT 1", $osoba_id)->fetch();    

            
            if($dba){
                $auto_id = $dba['id'];
                $auto_spz = $dba['spz'];
                $auto_nazev = $dba['nazev'];
                $poc_stav_km  = $dba['stavkm'];


                $dba = dibi::query("SELECT diesel_konecny_stav_l, lpg_konecny_stav_l, natural_konecny_stav_l, kwh_konecny_stav 
                                            FROM com_auto_vykaz_sumar WHERE auto_id=%i ORDER BY rok DESC, mesic DESC LIMIT 1", $auto_id)->fetch();

                if($dba){

                    $diesel_l = $dba['diesel_konecny_stav_l'];
                    $lpg_l = $dba['lpg_konecny_stav_l'];
                    $natural_l = $dba['natural_konecny_stav_l'];
                    $kwh = $dba['kwh_konecny_stav'];
                }

            }
           

            $o = (object) ['id'=>-1,
                'autoid'=> $auto_id, 
                'auto_nazev'=> $auto_nazev,
                'auto_spz'=> $auto_spz,
                'osobaid'=> $this->getOsobaID(),
                'osoba_osoba'=> $this->getPrijmeniJmeno(), 
                'osoba_oscislo'=>$this->getOsobniCislo(), 
                'rok'=> $rok,
                'mesic'=> $mesic, 
                'poc_stav'=> $poc_stav_km, 
                'kon_stav'=> $poc_stav_km, 
                'diesel_prum_spotreba'=> 0,
                'diesel_palivo_nakup_l'=> 0,
                'diesel_palivo_nakup_prumkc'=> 0,
                'diesel_palivo_nakup_kc'=> 0,
                'diesel_poc_stav_l'=> $diesel_l,
                'diesel_kon_stav_l'=> 0,
                'natural_prum_spotreba'=> 0,
                'natural_palivo_nakup_l'=> 0,
                'natural_palivo_nakup_prumkc'=> 0,
                'natural_palivo_nakup_kc'=> 0,
                'natural_poc_stav_l'=> $natural_l,
                'natural_kon_stav_l'=> 0,
                'lpg_prum_spotreba'=> 0,
                'lpg_palivo_nakup_l'=> 0,
                'lpg_palivo_nakup_prumkc'=> 0,
                'lpg_palivo_nakup_kc'=> 0,
                'lpg_poc_stav_l'=> $lpg_l,
                'lpg_kon_stav_l'=> 0,
                'kwh_nabijeni' => 0,
                'kwh_nabijeni_prumkc' => 0,
                'kwh_nabijeni_kc' => 0,
                'kwh_pocatecni_stav' => $kwh,
                'kwh_konecny_stav' => 0,
                'kwh_prum_spotreba' => 0,
                'ost_kc'=> 0,
                'list' => $this->getVykazList(-1, $rok, $mesic, $auto_id)
            ];
        }
        

        
        return $o;        
    }
    
    /** @callable  */
    public function getVykazSumar($rok=-1, $mesic=-1, $autoid=-1, $osobaid=-1){
        
        $d = dibi::query("select id from [com_auto_vykaz_sumar]  where rok=%i and mesic=%i and auto_id=%i and osoba_id=%i limit 1", $rok, $mesic, $autoid, $osobaid)->fetch();                  
        return $this->getMesicniVykaz($d ? $d['id'] : -1, $mesic, $rok);
    }
    
    /** @callable  */
    public function clearVykazSumar($userid=-1, $rok=0, $mesic=0, $autoid=-1)
    {
        
        dibi::query("delete from [com_auto_vykaz] where auto_vykaz_sumar_id in 
                     (select id from [com_auto_vykaz_sumar] where rok =%i and mesic=%i and auto_id=%i and osoba_id=%i)", $rok, $mesic, $autoid, $userid);        
        
        dibi::query("delete from [com_auto_vykaz_sumar] where rok =%i and mesic=%i and auto_id=%i and osoba_id=%i", $rok, $mesic, $autoid, $userid);        
        
        $resp = ['kod'=> 0, 'nazev' => 'Výzkaz vymazán', 'data'=> null];        
        $resp['data'] = $this->getVykazSumar($rok, $mesic, $autoid, $userid);
        return $resp;
    }

    /** @callable  */
    public function updateVykazSumar($vykaz=array())
    {
      
      $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
      $id = intval($vykaz['id']);
      
      $oid = intval($vykaz['osobaid']);

      $oid = $oid == -1 ? $this->getOsobaID() : $oid;

      $a = [
         'rok' => intval($vykaz['rok']),
         'mesic' => intval($vykaz['mesic']),
         'pocatecni_stav' => intval($vykaz['poc_stav']),
         'konecny_stav' => intval($vykaz['kon_stav']),
         'auto_id' => intval($vykaz['autoid']),
         'osoba_id' => $oid,
         'diesel_palivo_nakup_l' => round(floatval($vykaz['diesel_palivo_nakup_l']), 2),
         'diesel_palivo_nakup_kc' => round(floatval($vykaz['diesel_palivo_nakup_kc']), 2),
         'diesel_palivo_nakup_prumkc' => round(floatval($vykaz['diesel_palivo_nakup_prumkc']),2),
         'diesel_prum_spotreba' => intval($vykaz['diesel_prum_spotreba']),
         'diesel_konecny_stav_l' => intval(round(floatval($vykaz['diesel_kon_stav_l']), 0)),
         'diesel_pocatecni_stav_l'=> intval(round(floatval($vykaz['diesel_poc_stav_l']),0)),         
         'natural_palivo_nakup_l' => round(floatval($vykaz['natural_palivo_nakup_l']), 2),
         'natural_palivo_nakup_kc' => round(floatval($vykaz['natural_palivo_nakup_kc']), 2),
         'natural_palivo_nakup_prumkc' => round(floatval($vykaz['natural_palivo_nakup_prumkc']),2),
         'natural_prum_spotreba' => intval($vykaz['natural_prum_spotreba']),
         'natural_konecny_stav_l' => intval(round(floatval($vykaz['natural_kon_stav_l']), 0)),
         'natural_pocatecni_stav_l'=> intval(round(floatval($vykaz['natural_poc_stav_l']),0)),           
         'lpg_palivo_nakup_l' => round(floatval($vykaz['lpg_palivo_nakup_l']), 2),
         'lpg_palivo_nakup_kc' => round(floatval($vykaz['lpg_palivo_nakup_kc']), 2),
         'lpg_palivo_nakup_prumkc' => round(floatval($vykaz['lpg_palivo_nakup_prumkc']),2),
         'lpg_prum_spotreba' => intval($vykaz['lpg_prum_spotreba']),
         'lpg_konecny_stav_l' => intval(round(floatval($vykaz['lpg_kon_stav_l']), 0)),
         'lpg_pocatecni_stav_l'=> intval(round(floatval($vykaz['lpg_poc_stav_l']),0)),           
         'kwh_nabijeni'=> intval($vykaz['kwh_nabijeni']),
         'kwh_nabijeni_prumkc'=> intval(round(floatval($vykaz['kwh_nabijeni_prumkc']),0)),
         'kwh_nabijeni_kc'=> intval($vykaz['kwh_nabijeni_kc']),
         'kwh_pocatecni_stav'=> intval(round(floatval($vykaz['kwh_pocatecni_stav']),0)),
         'kwh_konecny_stav'=> intval(round(floatval($vykaz['kwh_konecny_stav']),0)),
         'kwh_prum_spotreba'=> intval(round(floatval($vykaz['kwh_prum_spotreba']),0)),
         'ost_kc' => round(floatval($vykaz['ost_kc']),2),         
         'zmenil'=> $this->getUserID(),
         'zmeneno'=> $this->getNow()
      ];
      

      if($id > 0) {
            dibi::query('UPDATE [com_auto_vykaz_sumar] SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
      }
      else {
            $nid = dibi::query("SELECT id FROM [com_auto_vykaz_sumar] WHERE rok=%i and mesic=%i and auto_id=%i and osoba_id=%i", 
                                $a['rok'], $a['mesic'], $a['auto_id'], $a['osoba_id'])->fetchSingle();

        if(!$nid){
            dibi::query('INSERT INTO [com_auto_vykaz_sumar]', $a);
            $id = dibi::query("select currval('auto_vykaz_sumar_id_seq')")->fetchSingle();            
        }
        else{
            $id = $nid;
            dibi::query('UPDATE [com_auto_vykaz_sumar] SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
        }
      }

       

       $this->saveVykazList($id, $vykaz['list']);
       $r['data'] = (object) $this->getMesicniVykaz($id);

        return $r;
    }
    
    /** @callable  */
    public function dropReportVykaz($id=-1){
        
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query('delete from [com_auto_vykaz_sumar] where id=%i', $id);
        }
        return $r;
    }
    
    
    /** @callable  */
    public function userAutocomplete($toStore=null){
              
          $uparam = $this->getUserParam('cestak_vykaz_autocomplete');
            
                  
          if($toStore == null && $uparam == false){
        
                $a_cesta = array();
                $a_ostatni = array();
          
                $oid = $this->getOsobaID();
        
                $q = "SELECT cesta FROM [com_auto_vykaz] WHERE auto_vykaz_sumar_id in ( select id from [com_auto_vykaz_sumar] where osoba_id={$oid} ) and cesta <> '' GROUP BY cesta ORDER BY cesta ASC";
                $rd = dibi::query($q);
          
                foreach($rd as $d){
                    $a_cesta[] = $d['cesta'];
                }

                $q = "SELECT ost_vyd FROM [com_auto_vykaz] WHERE auto_vykaz_sumar_id in ( select id from [com_auto_vykaz_sumar] where osoba_id={$oid} ) and ost_vyd <> '' GROUP BY ost_vyd ORDER BY ost_vyd ASC";
                $rd = dibi::query($q);

                foreach($rd as $d){
                    $a_ostatni[] = $d['ost_vyd'];
                }
                
                return ['cesta' => $a_cesta, 'ostatni' => $a_ostatni ];
          }
          else if($toStore != null){               
              $this->setUserParam('cestak_vykaz_autocomplete', $toStore);                
              return $toStore;
          }
          
          return $uparam;
    }
    
    /** @callable  */
    public function getAutoVykazUserTemplate(){
        
        $oid = $this->getOsobaID();
        $list = [];
        $rd = dibi::query("SELECT * FROM [com_auto_vykaz_user_templ] WHERE osoba_id=".$oid." ORDER BY cesta ASC");
          
        foreach($rd as $d){
            $list[] = ['id'=> $d['id'], 'cesta'=>$d['cesta'], 'km'=>$d['km'], 'km_private'=>$d['km_private']];
        }        
        return $list;
    }
    
    
    /** @callable  */
    public function generateAutoVykazUserTemplate(){
        
        $oid = $this->getOsobaID();
        
        $rd = dibi::query("select * from (select cesta, max(km) km, max(km_private) km_private from com_auto_vykaz where auto_vykaz_sumar_id in (select id from com_auto_vykaz_sumar where osoba_id = {$oid}) and cesta <> '' group by cesta) X
                            where cesta not in (select cesta from com_auto_vykaz_user_templ where osoba_id={$oid} ) order by cesta asc");
        
        foreach($rd as $r){            
            $a = ['cesta'=>$r['cesta'], 'km'=>$r['km'], 'km_private'=>$r['km_private'], 'osoba_id'=>$oid];            
            dibi::query("insert into [com_auto_vykaz_user_templ] ", $a);            
        }
        
        return $this->getAutoVykazUserTemplate();        
    }
    
    
    /** @callable  */
    public function udateAutoVykazUserTemplate($list=[]){
        
        $oid = $this->getOsobaID();     
       
        $res = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
        
        foreach($list as $d){
            
            $a = [
                'cesta' => $d['cesta'],
                'osoba_id' => $oid,
                'km'=> intval($d['km']),
                'km_private'=> intval($d['km_private'])
            ];            
            
            if($d['id'] < 1){
              dibi::query('INSERT INTO [com_auto_vykaz_user_templ]', $a);
            }
            else{
              dibi::query('UPDATE [com_auto_vykaz_user_templ] SET ', $a, ' WHERE id=%i and osoba_id=%i', $d['id'], $oid);
            }
        }     
        
        $res['data'] = $this->getAutoVykazUserTemplate();        
        return $res;
    }
    
     /** @callable  */
    public function dropAutoVykazUserTemplate($list=[]){
        
        $oid = $this->getOsobaID();        
        $res = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=>null];
        
        $in = "";
        foreach($list as $d){
            $in .= intval($d['id']).", ";            
        }     
        
        $in = rtrim($in, ", ");
        
        if(strlen($in) > 0){
            dibi::query('DELETE FROM [com_auto_vykaz_user_templ] WHERE id in ('.$in.') and osoba_id=%i', $oid);
        }
         
        $res['data'] = $this->getAutoVykazUserTemplate();                
        return $res;
    }
    
    
    
 
}