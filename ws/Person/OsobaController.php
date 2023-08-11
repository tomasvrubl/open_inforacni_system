<?php

namespace ws\Person;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use ws\Pomocne\TableHelper;
use ws\BaseController;

/** @controller */
class OsobaController extends BaseController
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
        
        $table = "(SELECT a.id, a.zmeneno, a.oscislo, a.cip, a.prijmeni, a.jmeno, a.platnost, a.zdravotni_pojistovna,
                    coalesce(p.kod, '') pracoviste_kod, coalesce(p.nazev, '') pracoviste,
                    EXTRACT(YEAR FROM AGE(now(), datum_narozeni)) vek, z.nazev as pracovni_zarazeni,
                    coalesce((select druh_prace  from pers_rizikovost_pracovist p where p.id = a.rizikovost_id), '') as pracovni_rizikovost,
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil
                    FROM osoba a  LEFT JOIN cis_pracoviste p ON a.cis_pracoviste_id = p.id
                    LEFT JOIN pers_prac_zarazeni z ON a.prac_zarazeni_id = z.id  ) X";
        
        
       $resp = TableHelper::query($tabquery, "X.*", $table);
       return $resp;
    }


    /** @callable  */
    public function Add($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam uložen', 'data'=> null];
        $id = intval($rec['id']);
        $oscislo = sanitize($rec['oscislo']);
        $platnost = $rec['platnost'] == 1 ? true : false;

        $datum_narozeni = $this->sanitizeDate($rec['datum_narozeni']);

        if(empty($oscislo)){
            $r['kod'] = 1;
            $r['nazev'] = 'Osobní číslo je prázdné!';
        }
        else{

            $a = [  'oscislo' => $oscislo, 
                    'prijmeni'=> sanitize($rec['prijmeni']), 
                    'jmeno'=> sanitize($rec['jmeno']), 
                    'cis_pracoviste_id'=> intval($rec['pracoviste_id']), 
                    'rizikovost_id'=> intval($rec['rizikovost_id']), 
                    'datum_narozeni' => $datum_narozeni,
                    'bydliste_ulice' => sanitize($rec['bydliste_ulice']), 
                    'bydliste_cp' => sanitize($rec['bydliste_cp']), 
                    'bydliste_obec' => sanitize($rec['bydliste_obec']),                     
                    'bydliste_psc' => sanitize($rec['bydliste_psc']), 
                    'bydliste_stat' => sanitize($rec['bydliste_stat']), 
                    'zdravotni_pojistovna' => sanitize($rec['zdravotni_pojistovna']), 
                    'prac_zarazeni_id' => intval($rec['prac_zarazeni_id']), 
                    'rezim_prace' => sanitize($rec['rezim_prace']), 
                    'titul' => sanitize($rec['titul']), 
                    'email' => sanitize($rec['email']), 
                    'mobil' => sanitize($rec['mobil']), 
                    'telefon' => sanitize($rec['telefon']), 
                    'rodnecislo' => sanitize($rec['rodnecislo']), 
                    'cip'=> sanitize($rec['cip']), 
                    'zmenil' => $this->getUserID(), 
                    'zmeneno'=> $this->getNow(),
                    'platnost'=>$platnost];

            if($id < 0){
                dibi::query('insert into [osoba]', $a);
                $id = dibi::query("select currval('osoba_id_seq')")->fetchSingle();
            }
            else{
                dibi::query('UPDATE [osoba] SET ', $a, ' WHERE id=%i', $id);
                $r['nazev'] = 'Záznam aktualizován';
            }
            
            $r['data'] = (object) $this->getOsoba($id);                  
        }

        return $r;
    }
    
    /** @callable  */
    public function Drop($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $ids = intval($id);

        if($ids > -1){
            dibi::query("delete from [osoba] where id=%i", $ids);
        }
        return $r;
    }

    
    /** @callable  */
    public function getOsoba($id){
        
        
        if($id > -1){
            $dt = dibi::query("SELECT a.*,  to_char(a.datum_narozeni, 'YYYY-MM-DD') || 'T00:00:00.000Z' s_datum_narozeni, coalesce(p.kod, '') p_kod, coalesce(p.nazev, '') p_nazev,
                     coalesce((select druh_prace from pers_rizikovost_pracovist r where r.id = a.rizikovost_id), '') as rizikovost_druh_prace, 
                     coalesce((select kod from pers_rizikovost_pracovist r where r.id = a.rizikovost_id), '') as rizikovost_kod, 
                     coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil, 
                     to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno 
                     FROM osoba a LEFT JOIN cis_pracoviste p ON a.cis_pracoviste_id = p.id 
                     WHERE a.id=%i", $id);
            $p = $dt->fetch();

            if($p){

                $r = (object) ['id'=>$p['id'], 'oscislo'=>$p['oscislo'], 'cip'=>$p['cip'], 'platnost'=>$p['platnost'],
                'prijmeni'=>$p['prijmeni'], 'jmeno'=>$p['jmeno'], 'pracoviste_kod'=>$p['p_kod'], 'pracoviste'=>$p['p_nazev'], 'pracoviste_id'=>$p['cis_pracoviste_id'], 
                'pracoviste_id'=>$p['cis_pracoviste_id'], 
                'rizikovost_druh_prace' => $p['rizikovost_druh_prace'],
                'rizikovost_id' => $p['rizikovost_id'],
                'rizikovost_kod' => $p['rizikovost_kod'],
                'datum_narozeni' => $p['s_datum_narozeni'],
                'bydliste_ulice' => $p['bydliste_ulice'],
                'bydliste_obec' => $p['bydliste_obec'],
                'bydliste_cp' => $p['bydliste_cp'],
                'bydliste_psc' => $p['bydliste_psc'],
                'bydliste_stat' => $p['bydliste_stat'], 
                'zdravotni_pojistovna' => $p['zdravotni_pojistovna'],
                'prac_zarazeni_id' => $p['prac_zarazeni_id'],
                'rezim_prace' => $p['rezim_prace'],
                'titul' => $p['titul'],
                'rodnecislo' => $p['rodnecislo'], 
                'email' => $p['email'],
                'mobil' => $p['mobil'],
                'telefon' => $p['telefon'],
                'zmeneno'=>$p['zmeneno'], 'zmenil'=>$p['zmenil']]; 

                return $r;

            }


        

           
        }
    
            
        $r = (object) [
                'id'=> -1,
                'oscislo'=> '', 
                'cip'=> '', 
                'prijmeni'=> '',
                'jmeno'=> '', 
                'email'=> '', 
                'mobil'=> '', 
                'telefon'=> '',
                'pracoviste'=> '',
                'pracoviste_kod'=> '', 
                'pracoviste_id'=> -1, 
                'platnost'=> true, 
                'rizikovost_id' => -1,
                'rizikovost_kod' => '',
                'rizikovost_druh_prace' => '',                    
                'datum_narozeni' => null,
                'bydliste_ulice' => '',
                'bydliste_obec' => '',
                'bydliste_cp' => '',
                'bydliste_psc' => '',
                'bydliste_stat' => '',
                'zdravotni_pojistovna' => '',
                'prac_zarazeni_id' => -1,
                'rezim_prace' => '',
                'rodnecislo' => '',
                'titul' => '',
                'zmeneno'=> '', 
                'zmenil'=> ''
        ]; 
      
        
        return $r;
    }
   
}