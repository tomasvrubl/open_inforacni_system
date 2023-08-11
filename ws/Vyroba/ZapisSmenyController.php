<?php

namespace ws\Vyroba;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;



/** @controller */
class ZapisSmenyController extends BaseController
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

/*
 *   { label: 'Datum', clmn: 'datum', fulltext: true, type: TabColumn.TYPE_DATE },
            { label: 'Směna', clmn: 'smena', fulltext: true },            
            { label: 'Zdroj', clmn: 'zdroj', fulltext: true },
            { label: 'Středisko', clmn: 'pracoviste', fulltext: true},
            { label: 'Odvedeno ks', clmn: 'odv_mnozstvi', type: TabColumn.TYPE_NUMBER},
            { label: 'Utrženo ks', clmn: 'utrz_forem', type: TabColumn.TYPE_NUMBER},            
            { label: 'Poznámka', clmn: 'poznamka'},
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }

            -- left join vyr_zapis_smeny_pol p on d.id = p.zapis_smeny_dkl_id
            -- left join osoba o on p.osoba_id  = o.id
*/

        $table = "( SELECT d.id, d.termosoba,
                            (select nazev from cis_zdroj where id = d.zdroj_id) zdroj,
                            (select nazev from cis_pracoviste where id = d.pracoviste_id) pracoviste,
                            to_char(d.datum, 'DD.MM.YYYY') datum, 
                            ks.nazev smena, 
                            d.odv_mnozstvi,
                            d.utrz_forem,
                            d.poznamka,
                            to_char(d.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                            coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = d.zmenil), '') as zmenil 
                    FROM vyr_zapis_smeny_dkl d 
                    LEFT JOIN kalendar_smena ks ON d.kalendar_smena_id = ks.id ) X ";
       
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


    /** @callable  */
    public function Add($rec) 
    {


        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];

        $id = intval($rec['id']);
        $datum = $this->sanitizeDate($rec['datum']);
        $kalendar_smena_id = intval($rec['kalendar_smena_id']);
        $zdroj_id = intval($rec['zdroj_id']);
        $pracoviste_id = intval($rec['pracoviste_id']);

        $oid = isset($this->user) &&  $this->user->getId() != null ? $this->user->getId() : -1;
                
        
        if($kalendar_smena_id < 0){
            $r['kod'] = 1;
            $r['nazev'] = 'Není zadána směna ! Směna se bere ze zdroje nebo střediska.';
        }
        else if($pracoviste_id < 0 && $zdroj_id < 0){
            $r['kod'] = 1;
            $r['nazev'] = 'Zadej alespoň středisko nebo zdroj.';
        }
        else{

            $a = [ 'datum' => $datum, 
                    'kalendar_smena_id' => $kalendar_smena_id,
                    'zdroj_id' => $zdroj_id,
                    'pracoviste_id' => $pracoviste_id,
                    'odv_mnozstvi' => intval($rec['odv_mnozstvi']),
                    'utrz_forem' => intval($rec['utrz_forem']),
                    'poznamka'=>   sanitize($rec['poznamka']),
                    'termosoba' => sanitize($rec['termosoba']),
                    'zmenil' => $oid, 
                    'zmeneno'=> $this->getNow()
                ];

            if($id < 0){
                dibi::query('INSERT INTO vyr_zapis_smeny_dkl', $a);
                $id = dibi::query("SELECT currval('vyr_zapis_smeny_dkl_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE vyr_zapis_smeny_dkl SET ', $a, ' WHERE id=%i', $id);
                dibi::query("DELETE FROM vyr_zapis_smeny_pol WHERE zapis_smeny_dkl_id=%i", $id);

                $r['nazev'] = 'Záznam aktualizován';                        
            }


            foreach($rec['polozky'] as $p){

                $oid = intval($p['osoba_id']);
                if($oid < 0)
                    continue;

                $a = ['zapis_smeny_dkl_id'=> $id, 
                      'osoba_id' => $oid,
                      'pracovni_zarazeni_id'=> intval($p['pracovni_zarazeni_id']),
                      'zmenil' => $oid, 
                      'zmeneno'=> $this->getNow()
                ];

                dibi::query('INSERT INTO vyr_zapis_smeny_pol', $a);

            }
            
            $r['data'] = (object) $this->Get($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Get($id=-1){

        /**
            export class VyrZapisSmeny {
                public id: number = -1;
                public datum: Date =  new Date();
                public kalendar_smena_id: number = -1;
                public cis_zdroj_id: number = -1;
                public cis_pracoviste_id: number = -1;
                public odv_mnozstvi: number = 0;
                public utrz_forem: number = 0;
                public poznamka: string = '';
                public zmeneno: string = '';
                public zmenil: string = ''; 
                public polozky: any[]  = [];
            }

            */

        if($id > -1){
            $dt = dibi::query("SELECT d.id,
                                 to_char(d.datum, 'YYYY-MM-DD') datum,
                                d.poznamka,
                                d.zdroj_id,
                                d.pracoviste_id,
                                d.odv_mnozstvi,
                                d.utrz_forem,
                                d.termosoba,
                                d.kalendar_smena_id,					 
                                ks.nazev kalendar_smena, 
                                coalesce(z.nazev, '') zdroj,
                                coalesce(z.kod, '') zdroj_kod,
                                coalesce(p.nazev, '') pracoviste, 
                                coalesce(p.kod, '') pracoviste_kod,
                                to_char(d.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno ,
                                coalesce((select prijmeni || ' ' || jmeno from security_user u where u.id = d.zmenil), '') as zmenil
                            FROM vyr_zapis_smeny_dkl d
                            LEFT JOIN kalendar_smena ks ON d.kalendar_smena_id = ks.id
                            LEFT JOIN cis_zdroj z ON d.zdroj_id = z.id
                            LEFT JOIN cis_pracoviste p ON d.pracoviste_id = p.id WHERE d.id=%i", $id);            
            $p = $dt->fetch();

            $r = (object) ['id'=>$p['id'], 'datum'=>$p['datum'], 'poznamka'=>$p['poznamka'], 
                            'kalendar_smena'=> $p['kalendar_smena'], 'kalendar_smena_id'=> $p['kalendar_smena_id'],
                            'odv_mnozstvi' => $p['odv_mnozstvi'], 'utrz_forem' => $p['utrz_forem'],
                            'zdroj_id'=>$p['zdroj_id'], 'zdroj_kod'=>$p['zdroj_kod'], 'zdroj'=>$p['zdroj'],
                            'pracoviste_id'=>$p['pracoviste_id'], 'pracoviste_kod'=>$p['pracoviste_kod'], 'pracoviste'=>$p['pracoviste'],
                            'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil'],                            
                            'polozky' => $this->getZapisZarazeniList($p['zdroj_id'], $p['pracoviste_id'], $p['id'])
                        ]; 
        }
        else{
            
            $r = (object) [
                    'id'=> -1,
                    'datum'=> $this->getToday(), 
                    'kalendar_smena_id'=> -1,
                    'kalendar_smena'=> '',
                    'zdroj_id'=> -1, 
                    'zdroj_kod'=> '', 
                    'zdroj'=> '', 
                    'pracoviste_id'=> -1,
                    'pracoviste_kod'=> '',
                    'pracoviste'=> '',
                    'odv_mnozstvi'=> 0,
                    'utrz_forem'=> 0,
                    'poznamka'=> '', 
                    'termosoba'=> '',
                    'zmeneno'=> '', 
                    'zmenil'=> '',
                    'polozky'=> []
            ]; 
        }
        
        
        return $r;
    }


    /** @callable  */
    public function Drop($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){
            dibi::query("DELETE FROM vyr_zapis_smeny_pol WHERE zapis_smeny_dkl_id=%i", $id);
            dibi::query("DELETE FROM vyr_zapis_smeny_dkl WHERE id=%i", $id);
        }
        return $r;
    }
 

    /** @callable  */
    public function getZapisZarazeniList($zdrojid=-1, $pracovisteid=-1, $zapisid=-1){

        $r = [];

        /*
            public id: number = -1;    
            public zapissmeny_dkl_id: number = -1;
            public pracovni_zarazeni_id: number = -1;
            public pracovni_zarazeni_kod : string = '';
            public pracovni_zarazeni : string = '';
            public pracovni_zarazeni_platnost : boolean = true;
            public osoba_id : number = -1;    
            public osoba : string = '';
            public osoba_oscislo: string = '';    
            public osoba_platnost: boolean = true;
            public zmeneno: string = '';
            public zmenil: string  = '';*/


        if($zdrojid > -1){            
            $dt = dibi::query("SELECT p.id, z.id pracovni_zarazeni_id, z.nazev pracovni_zarazeni, z.kod pracovni_zarazeni_kod, z.platnost pracovni_zarazeni_platnost, 
                                coalesce(p.osoba_id, -1) osoba_id, o.oscislo, o.prijmeni || ' ' || o.jmeno osoba, o.platnost osoba_platnost
                                FROM cis_pracovni_zarazeni z left join vyr_zapis_smeny_pol p on z.id = p.pracovni_zarazeni_id and p.zapis_smeny_dkl_id=%i
                                left join osoba o on p.osoba_id  = o.id 
                                WHERE z.platnost=true and z.pracoviste_id in (SELECT pracoviste_id FROM cis_zdroj WHERE id=%i)", $zapisid, $zdrojid);

        }
        else{
            $dt = dibi::query("SELECT p.id, z.id pracovni_zarazeni_id, z.nazev pracovni_zarazeni, z.kod pracovni_zarazeni_kod, z.platnost pracovni_zarazeni_platnost, 
                                coalesce(p.osoba_id, -1) osoba_id, o.oscislo, o.prijmeni || ' ' || o.jmeno osoba, o.platnost osoba_platnost
                                FROM cis_pracovni_zarazeni z left join vyr_zapis_smeny_pol p on z.id = p.pracovni_zarazeni_id and p.zapis_smeny_dkl_id=%i
                                left join osoba o on p.osoba_id  = o.id 
                                WHERE z.platnost=true and z.pracoviste_id=%i", $zapisid, $pracovisteid);
        }

        foreach($dt->fetchAll() as $d){
            $r[] = ['id'=> $d['id'], 
                    'zapissmeny_dkl_id' => $zapisid,
                    'pracovni_zarazeni_id' => $d['pracovni_zarazeni_id'],
                    'pracovni_zarazeni_kod' => $d['pracovni_zarazeni_kod'],
                    'pracovni_zarazeni' => $d['pracovni_zarazeni'],
                    'pracovni_zarazeni_platnost' => $d['pracovni_zarazeni_platnost'],
                    'osoba_id' => $d['osoba_id'],
                    'osoba_oscislo' => $d['oscislo'],
                    'osoba' => $d['osoba'],
                    'osoba_platnost' => $d['osoba_platnost'],
                ];
        }

        return $r;

    }
}