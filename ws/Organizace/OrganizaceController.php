<?php

namespace ws\Organizace;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;


/** @controller */
class OrganizaceController extends BaseController
{ 

    /** @callable  */
    public function getObjMaterialuTable($tabquery=null)
    {

        $fltr = "WHERE o.vytvoril=".$this->getUserID()." or o.objednal=".$this->getOsobaID();

        if($this->isAdmin() || $this->is("organizace", "obj-mat", "grant-videt-vse")){
           $fltr = ""; 
        }
        
        $table = "( SELECT o.id, to_char(o.datum, 'DD.MM.YYYY') datum, 
                        c.nazev as pracoviste, c.kod as pracoviste_kod,
                        o.cena_celkem,
                        o.stav, o.priloha_hash,
                        to_char(o.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = o.zmenil), '') as zmenil,                      
                        to_char(o.vytvoreno, 'DD.MM.YYYY HH24:MI:SS') vytvoreno,
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = o.vytvoril), '') as vytvoril, 
                        coalesce(to_char(o.schvaleno, 'DD.MM.YYYY HH24:MI:SS'), '') schvaleno, 
                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = o.schvalil), '') as schvalil,                      
                        coalesce((select prijmeni || ' ' || jmeno  from osoba ox where ox.id = o.objednal), '') as objednal
                    FROM [org_obj_mat] o LEFT JOIN [cis_pracoviste] c ON o.pracoviste_id = c.id {$fltr} ) X ";
       
       return TableHelper::query($tabquery, "X.*", $table);
    }

    /** @callable  */
    public function getObjMaterialuPolTable($tabquery=null)
    {

        $fltr = "AND m.vytvoril=".$this->getUserID()." or m.objednal=".$this->getOsobaID();

        if($this->isAdmin() || $this->is("organizace", "obj-mat", "grant-videt-vse")){
            $fltr = ""; 
        }
        
        $table = "( SELECT to_char(m.datum, 'DD.MM.YYYY') m_datum_obj, 
                            p.id, p.obj_mat_id, p.popis, p.mnozstvi, p.jednotka, p.predpokl_cena, 
                           p.stav p_stav, m.stav o_stav, p.objednano p_objednano, 
                           to_char(m.objednano, 'DD.MM.YYYY') m_objednano,  
                           to_char(m.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno,
                        coalesce((select prijmeni || ' ' || jmeno from security_user where id = m.zmenil), '') zmenil,
                        coalesce((select nazev from cis_pracoviste where id = p.pracoviste_id), '') stredisko,
                        coalesce((select prijmeni || ' ' || jmeno from osoba where id = m.objednal), '') m_objednal,
                        coalesce((select nazev from org_firmy where id = firma_id), '') firma, 
                        m.poznamka
                    FROM org_obj_mat_pol p LEFT JOIN org_obj_mat m ON p.obj_mat_id = m.id
                    WHERE p.stav = 0 {$fltr}                    
                 ) X ";
        
        return TableHelper::query($tabquery, "X.*", $table);
    }


    /** @callable  */
    public function getObjMaterialu($id=-1){

        if($id > -1){
            $dt = dibi::query("SELECT a.*, c.nazev, c.kod,
                                a.stav ostav,
                                to_char(a.objednano, 'YYYY-MM-DD') || 'T00:00:00.000Z' s_objednano, 
                                a.poznamka note,
                                to_char(a.datum, 'YYYY-MM-DD') || 'T00:00:00.000Z' s_datum, 
                                to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') s_zmeneno,
                                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as s_zmenil,                      
                                to_char(a.vytvoreno, 'DD.MM.YYYY HH24:MI:SS') s_vytvoreno,
                                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.vytvoril), '') as s_vytvoril, 
                                coalesce(to_char(a.schvaleno, 'DD.MM.YYYY HH24:MI:SS'), '') s_schvaleno, 
                                coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.schvalil), '') as s_schvalil,                      
                                coalesce((select prijmeni || ' ' || jmeno  from osoba o where o.id = a.objednal), '') as s_objednal,
                                coalesce((select oscislo  from osoba o where o.id = a.objednal), '') as s_objednal_oscislo                               
                     FROM [org_obj_mat]  a 
                            LEFT JOIN [cis_pracoviste] c ON a.pracoviste_id = c.id
                     WHERE a.id=%i", $id);      
                     
                     
            $p = $dt->fetch();
            $r = (object) ['id'=> $p['id'], 
                            'datum'=> $p['s_datum'], 
                            'datum_objednano'=> $p['s_objednano'], 
                            'objednal'=> $p['objednal'], 
                            'objednal_osoba' => $p['s_objednal'], 
                            'objednal_oscislo' => $p['s_objednal_oscislo'],                             
                            'cena_celkem' => $p['cena_celkem'],
                            'pracoviste_id' => $p['pracoviste_id'],
                            'pracoviste_nazev' => $p['nazev'],
                            'pracoviste_kod' => $p['kod'],                           
                            'stav'=> $p['ostav'], 
                            'note'=> $p['poznamka'],
                            'schvaleno'=> $p['s_schvaleno'], 
                            'schvalil'=> $p['schvalil'],
                            'schvalil_osoba'=> $p['s_schvalil'],
                            'vytvoreno'=> $p['s_vytvoreno'], 
                            'vytvoril'=> $p['s_vytvoril'],
                            'zmeneno'=> $p['s_zmeneno'], 
                            'zmenil'=> $p['s_zmenil'],
                            'priloha_hash'=> $p['priloha_hash'],
                            'polozky'=> $this->getObjMaterialuPol($p['id'])
                        ]; 
        }
        else{
            
            $dt = dibi::query("SELECT o.*, coalesce(p.kod, '') p_kod, coalesce(p.nazev, '') p_nazev  FROM osoba o LEFT JOIN cis_pracoviste p ON o.cis_pracoviste_id = p.id WHERE o.id=%i", $this->getOsobaID())->fetch();

            $r = (object) ['id'=> -1, 
                            'datum'=>  $this->getToday(),
                            'datum_objednano'=> null,
                            'objednal'=> $dt['id'], 
                            'objednal_osoba' => $dt['prijmeni'].' '.$dt['jmeno'], 
                            'objednal_oscislo' => $dt['oscislo'],                             
                            'cena_celkem' => 0,
                            'pracoviste_id' => $dt['cis_pracoviste_id'],
                            'pracoviste_nazev' => $dt['p_nazev'],
                            'pracoviste_kod' => $dt['p_kod'],
                            'stav'=> 0,
                            'note'=>'',
                            'schvaleno'=> '', 
                            'schvalil'=> -1,
                            'schvalil_osoba'=> '',
                            'vytvoreno'=> '', 
                            'vytvoril'=>-1,
                            'zmeneno'=>'', 
                            'zmenil'=>-1,
                            'priloha_hash'=> 'organizace/objmat/'.round(microtime(true) * 1000)."-".rand(0, 100),
                            'polozky'=> []
                        ]; 
        }
        
        
        return $r;
    }

    /** @callable  */
    public function dropObjMaterialu($id=-1){

        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("delete from [org_obj_mat] where id=%i", $id);
        }
        return $r;
    }


    /** @callable  */
    public function setObjMaterialuObjednano($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam aktualizován', 'data'=> null];

        $a = ['objednano' => intval($rec['objednano']) == 1];
        dibi::query('UPDATE [org_obj_mat_pol] SET ', $a, ' WHERE id=%i', intval($rec['id']));

        return $r;
    }


    /** @callable  */
    public function setKSchvaleniObjMaterialu($rec)
    {
        $rec['stav'] = 1; //nastav ke schvaleni
        $r = $this->addObjMaterialu($rec);

        $st = dibi::query("select * from [settings] where kod='ORG_OBJ_MATERIALU_VYTVORENA_MAIL_TO'")->fetch();

        if(!empty($st['param'])){

            //    function sendMail($subject, $body, $address=array()) 
            
            $osoba = $this->getPrijmeniJmeno();
            $subj = str_replace("%osoba%", $osoba, $st['param2']);
            $body = str_replace("%osoba%", $osoba, $st['param3']);

            $rows  = "<table><thead><tr><th>Popis</th><th>Množství</th><th>Cena v kč</th><th>Středisko</th></tr></thead><tbody>";
            foreach($rec['polozky'] as $p){
                $rows .= "<tr><td>{$p['popis']}</td><td>{$p['mnozstvi']}</td><td>{$p['cena']}</td><td>{$p['pracoviste_kod']}</td></tr>";
            }

            $rows .= "</tbody></table>";

            $body = str_replace("%rows%", $rows, $body);
            
            $url = $this->getURL()."/org/objmat/".$rec['id'];
            $body .= "</br><br/>Odkaz na záznam: <a href='{$url}'>{$url}</a><br/>";


            $st['param'] = str_replace(",", ";",  $st['param']);
            $this->sendMail($subj, $body, explode(";", $st['param']));

        }



        $r['nazev'] = 'Požadavek odeslán ke schválení.';
        return $r;
    }


    

    /** @callable  */
    public function setVraceniObjMaterialu($rec)
    {
        $rec['stav'] = 0; //nastav na vytvořen
        $rec['schvalil'] = -1;
        $rec['schvaleno'] = null;

        //nastav zpet status na normal
        foreach($rec['polozky'] as $p){
            $p['stav'] = 0;
        }

        $r = $this->addObjMaterialu($rec);

        $eml = dibi::query("select email from [security_user] where id in (select vytvoril from [org_obj_mat] where id=%i)", $rec['id'])->fetchSingle();
        if(!empty($eml)){

            $st = dibi::query("select * from [settings] where kod='ORG_OBJ_MATERIALU_VRACENI_MAIL_TO'")->fetch();

            $osoba = $this->getPrijmeniJmeno();
            $subj = str_replace("%osoba%", $osoba, $st['param2']);
            $body = str_replace("%osoba%", $osoba, $st['param3']);
    
            $rows  = "<table><thead><tr><th>Popis</th><th>Množství</th><th>Cena v kč</th><th>Středisko</th></tr></thead><tbody>";
            foreach($rec['polozky'] as $p){
                $rows .= "<tr><td>{$p['popis']}</td><td>{$p['mnozstvi']}</td><td>{$p['cena']}</td><td>{$p['pracoviste_kod']}</td></tr>";
            }
    
            $rows .= "</tbody></table>";
    
            $body = str_replace("%rows%", $rows, $body);
    
            $url = $this->getURL()."/org/objmat/".$rec['id'];
            $body .= "</br><br/>Odkaz na záznam: <a href='{$url}'>{$url}</a><br/>";

    
            $this->sendMail($subj, $body, [$eml]);

        }

        $r['nazev'] = 'Požadavek odeslán k přepracování.';
        return $r;
    }

    /** @callable  */
    public function setObjednanoObjMaterialu($rec)
    {
        $rec['stav'] = 3; //nastav na vytvořen
        
        $r = $this->addObjMaterialu($rec);

        $eml = dibi::query("select email from [security_user] where id in (select vytvoril from [org_obj_mat] where id=%i)", $rec['id'])->fetchSingle();
        if(!empty($eml)){

            $st = dibi::query("select * from [settings] where kod='ORG_OBJ_MATERIALU_OBJEDNANO_MAIL_TO'")->fetch();

            $osoba = $this->getPrijmeniJmeno();
            $subj = str_replace("%osoba%", $osoba, $st['param2']);
            $body = str_replace("%osoba%", $osoba, $st['param3']);
    
            $rows  = "<table><thead><tr><th>Popis</th><th>Množství</th><th>Cena v kč</th><th>Středisko</th></tr></thead><tbody>";
            foreach($rec['polozky'] as $p){
                $rows .= "<tr><td>{$p['popis']}</td><td>{$p['mnozstvi']}</td><td>{$p['cena']}</td><td>{$p['pracoviste_kod']}</td></tr>";
            }
    
            $rows .= "</tbody></table>";
    
            $body = str_replace("%rows%", $rows, $body);
    
            $url = $this->getURL()."/org/objmat/".$rec['id'];
            $body .= "</br><br/>Odkaz na záznam: <a href='{$url}'>{$url}</a><br/>";

            $this->sendMail($subj, $body, [$eml]);            
        }


        $r['nazev'] = 'Požadavek aktualizován.';
        return $r;
    }


    /** @callable  */
    public function setOdsouhlaseniObjMaterialu($rec)
    {
        $rec['stav'] = 2; //nastav ke schvaleni

        $rec['schvalil'] = $this->getUserID();
        $rec['schvaleno'] = date("d.m.Y H:i:s");
        $r = $this->addObjMaterialu($rec);

        $eml = dibi::query("select email from [security_user] where id in (select vytvoril from [org_obj_mat] where id=%i)", $rec['id'])->fetchSingle();
        $st = dibi::query("select * from [settings] where kod='ORG_OBJ_MATERIALU_ODSOUHLASENO_MAIL_TO'")->fetch();

        if(!empty($st['param'])){
            $osoba = $this->getPrijmeniJmeno();
            $subj = str_replace("%osoba%", $osoba, $st['param2']);
            $body = str_replace("%osoba%", $osoba, $st['param3']);

            $rows  = "<table><thead><tr><th>Popis</th><th>Množství</th><th>Cena v kč</th><th>Středisko</th><th>Stav</th></tr></thead><tbody>";
            $cls = $lbl = "";
            foreach($rec['polozky'] as $p){

                if($p['stav'] == 1){
                    $cls = "storno";
                    $lbl = "Zamítnuto";
                }
                else{
                    $cls = "";
                    $lbl = "";
                }
                

                $rows .= "<tr class='{$cls}'><td>{$p['popis']}</td><td>{$p['mnozstvi']}</td><td>{$p['cena']}</td><td>{$p['pracoviste_kod']}</td><td>{$lbl}</td></tr>";
            }

            $rows .= "</tbody></table>";

            $body = str_replace("%rows%", $rows, $body);

            $url = $this->getURL()."/org/objmat/".$rec['id'];
            $body .= "</br><br/>Odkaz na záznam: <a href='{$url}'>{$url}</a><br/>";



            $st['param'] = str_replace(",", ";",  $st['param']);            
            $emls = explode(";", $st['param']);

            if($eml){
                $emls[] = $eml;
            }

            $this->sendMail($subj, $body, $emls);

        }

        $r['nazev'] = 'Požadavek odsouhlašen, zaslán k objednání.';
        return $r;
    }

    

    /** @callable  */
    public function addObjMaterialu($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $datum = $this->sanitizeDate($rec['datum']);
        $objednal = intval($rec['objednal']);
        $pracoviste_id = intval($rec['pracoviste_id']);
        $cena_celkem = floatval($rec['cena_celkem']);
        $note = sanitize($rec['note']);
        $priloha_hash = sanitize($rec['priloha_hash']);


        $a = [ 'datum' => $datum, 'objednal' => $objednal, 'poznamka'=>$note, 'pracoviste_id'=>$pracoviste_id, 'priloha_hash'=>$priloha_hash,
                'stav'=>intval($rec['stav']), 'cena_celkem'=>$cena_celkem, 'zmeneno'=> $this->getNow(),
                'zmenil' => $this->getUserID()];

            
        if(!empty($rec['datum_objednano'])){
            $a['objednano'] = $this->sanitizeDate($rec['datum_objednano']);
        }
        else{
            $a['objednano'] = null;
        }

        if(!empty($rec['schvaleno'])){
            $a['schvaleno'] = $this->sanitizeDate($rec['schvaleno']);
            $a['schvalil'] = intval($rec['schvalil']);
        }

        if($id < 0){

            if($objednal  < 0){
                $a['objednal'] = $this->getUserID();
            }

            $a['vytvoril'] = $this->user->getId();

            $a['schvaleno'] = null;
            $a['schvalil'] = -1;
            $a['stav'] = 0;

            dibi::query('INSERT INTO org_obj_mat', $a);
            $id = dibi::query("select currval('org_obj_mat_seq')")->fetchSingle();

        }
        else{
            dibi::query('UPDATE org_obj_mat SET ', $a, ' WHERE id=%i', $id);
            $r['nazev'] = 'Záznam aktualizován';
        }


        $lst = $rec['polozky'];
        $ids = [];
        foreach($lst as $a){

            $b = [];
            $rid = intval($a['id']);
            $b['jednotka'] = sanitize($a['jednotka']);
            $b['popis'] = sanitize($a['popis']);
            $b['mnozstvi'] = intval($a['mnozstvi']);
            $b['predpokl_cena'] = intval($a['cena']);
            $b['pracoviste_id'] = intval($a['pracoviste_id']);
            $b['firma_id'] = intval($a['firma_id']);                        
            $b['obj_mat_id'] = $id;
            $b['zmenil'] =  $this->getUserID();
            if($rid < 0){                
                $b['vytvoril'] = $this->getUserID();
                $b['stav'] = 0;
                dibi::query('INSERT INTO org_obj_mat_pol', $b);     
                $ids[] = dibi::query("select currval('org_obj_mat_pol_id_seq')")->fetchSingle();           
            }
            else{
                $ids[] = $rid;
                $b['stav'] = intval($a['stav']);
                dibi::query('UPDATE org_obj_mat_pol SET ', $b, ' WHERE id=%i', $rid);
            }
        
        }

        if(!empty($ids)){ //uklid zaznamy, ktere jiz neexistuji
            dibi::query("DELETE FROM org_obj_mat_pol WHERE obj_mat_id=%i and id not in (?)",  $id,  $ids);
        }
        

        $r['data'] = (object) $this->getObjMaterialu($id);                  
        return $r;
    }

    /** @callable  */
    public function getObjMaterialuPol($obj_mat_id=-1)
    {

        $r = [];


        $dt = dibi::query("SELECT a.*, c.nazev p_nazev, c.kod p_kod,                                    
                                    to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') s_zmeneno,
                                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as s_zmenil,                      
                                    to_char(a.vytvoreno, 'DD.MM.YYYY HH24:MI:SS') s_vytvoreno,
                                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.vytvoril), '') as s_vytvoril,
                                    coalesce(f.nazev, '') as firma_nazev,
                                    coalesce(f.ulice || ', ' || f.obec || '  ' || f.psc ) as firma_adresa
                            FROM org_obj_mat_pol  a 
                                LEFT JOIN cis_pracoviste c ON a.pracoviste_id = c.id
                                LEFT JOIN org_firmy f ON a.firma_id = f.id
                            WHERE a.obj_mat_id=%i ORDER BY a.id ASC", $obj_mat_id)->fetchAll();

      
        foreach($dt as $d){

            $r[] = [
                    'id' => $d['id'],
                    'obj_mat_id' => $d['obj_mat_id'],
                    'popis' => $d['popis'],
                    'stav' => $d['stav'],
                    'pracoviste_id' => $d['pracoviste_id'],
                    'pracoviste_kod' => $d['p_kod'],
                    'pracoviste_nazev' => $d['p_nazev'],
                    'mnozstvi' => $d['mnozstvi'],
                    'jednotka' => $d['jednotka'],
                    'cena' => $d['predpokl_cena'],
                    'objednano'=> $d['objednano'],
                    'firma_id' => $d['firma_id'],
                    'firma_nazev' => $d['firma_nazev'],
                    'firma_adresa' => $d['firma_adresa'],
                    'vytvoreno'=> $d['s_vytvoreno'], 
                    'vytvoril'=> $d['s_vytvoril'],                    
                    'zmeneno'=> $d['s_zmeneno'], 
                    'zmenil'=> $d['s_zmenil'],             
                           
            ];             
            
        }


        return $r;
    }
    
 
}