<?php

namespace ws\Pomocne;

use dibi;
use Nette\Security\User;
use ws\BaseController;


/** @controller */
class ReportController extends BaseController
{


    public static function randomHashFile($len=8){

        $h = "ABCDEFGHIJKLMNOPQRSTUVwxyzabcdefghijklmnopqrstuvwxyz0123456789";
        $strl = strlen($h);

        $hash = "";
        for($i=0; $i < $len; $i++){
            $hash .= $h[rand(0, $strl - 1)];
        }

        return $hash;
    }

    protected static function prepareDirStrucutre($basePath = __DIR__, $parts){

        $pp = rtrim(ltrim($parts, "/"), "/");
    
        $pp = explode("/", $pp);
        $path = $basePath;

        if(count($pp) < 1)
            return $path;
    
    
        foreach($pp as $p){
    
            $path .= "/".$p;
    
            if(!is_dir($path)){
                mkdir($path);
            }
        }

        return $path;
    
    }
    


    /** @callable  */
    public function getTable($tabquery=null, $urlrec=null)
    {

        $urlrec = sanitize($urlrec);
        
        //priznak candelete ridi cron urcuje co muze mazat a co nemuze co je urceno k smazani
        $table = "( SELECT a.id,  a.nazev, a.note, a.url, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM [framework_tisk] a WHERE a.url_rec='{$urlrec}') X ";
        
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function upload($id='-1', $urlrec=null){

        $r = ['kod'=> 0, 'nazev' => 'Soubor nahrán', 'data'=> null];

        $id = intval($id);

        $urlrec = sanitize($urlrec);
        $url = rtrim($this->getURL()."/".STORAGE_REPORT_URL.ltrim($urlrec, "/"), "/");

        $dir = ReportController::prepareDirStrucutre(STORAGE_REPORT, $urlrec);


        foreach($_FILES as $f){
            try{
        
                $temp= explode('.',$f['name']);
                $mime = end($temp);
                
                $fname = $this->randomHashFile()."_".$f['name'];
                $path = $dir."/".$fname;
                @copy($f["tmp_name"], $path);

                $a = ['url'=> $url."/".$fname,  'url_rec'=>$urlrec, 'path'=>$path, 'zmenil'=>$this->getUserID(), 'zmeneno'=>$this->getNow()];

                if($id > 0){ //aktualizu zaznam

                    $v = dibi::query("SELECT path FROM [framework_tisk] WHERE id=%i", $id)->fetchSingle();

                    if(file_exists($v)){
                        unlink($v);
                    }

                    dibi::query('UPDATE [framework_tisk] SET ', $a, ' WHERE id=%i', $id);

                }
                else{  //vytvor novy 
                    
                    $a['nazev'] = $this->randomHashFile(5);
                    $a['note'] = '';

                    dibi::query("insert into [framework_tisk]", $a);     
                    $id = dibi::query("select currval('framework_tisk_id_seq')")->fetchSingle();                
                }


                $r['data'] = $this->get($id);

                break;
            }
            catch(Exception $ex){
                $r['kod'] = 1;
                $r['nazev'] = $ex->getMessage();
            }
        }
        return $r;
    }


    /** @callable  */
    public function get($id=-1){


        if($id > -1){
            $dt = dibi::query("SELECT a.*, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                                FROM [framework_tisk] a WHERE id=%i", $id);

            $p = $dt->fetch();
            $r = (object) [
                'id' => $p['id'],
                'nazev'=> $p['nazev'], 
                'note'=> $p['note'], 
                'url'=> $p['url'], 
                'url_rec'=> $p['url_rec'], 
                'path'=> $p['path'],
                'zmeneno'=> $p['zmeneno'], 
                'zmenil'=>$p['zmenil']                
            ]; 
        }
        else{
            $r = (object) [
                'id' => -1,
                'nazev'=> '', 
                'note'=> '', 
                'url'=> '', 
                'url_rec'=> '', 
                'path'=> '',
                'zmeneno'=> '', 
                'zmenil'=> -1
            ]; 
        }

        return $r;
    }


    /** @callable  */
    public function drop($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Sestava odstraněna', 'data'=> null];
        $id = intval($id);

        if($id > -1){

            $v = dibi::query("SELECT path FROM [framework_tisk] WHERE id=%i", $id)->fetchSingle();

            if(file_exists($v)){
                unlink($v);
            }
            dibi::query("DELETE FROM [framework_tisk] WHERE id=%i", $id);
        }

        return $r;
    }

    /** @callable  */
    public function update($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Sestava aktualizována', 'data'=> null];

        $id = intval($rec['id']);
        $a = [
            'nazev'=>$rec['nazev'],
            'note'=>$rec['note'],      
            'zmenil' => $this->user->getId(),
            'zmeneno' => 'now()'
        ];

        if($id < 0){
            dibi::query("insert into [framework_tisk]", $a);     
            $id = dibi::query("select currval('framework_tisk_id_seq')")->fetchSingle();       
        }
        else{
            dibi::query('UPDATE [framework_tisk] SET ', $a, ' WHERE id=%i', $id);
        }

        $r['data'] = $this->get($id);
        return $r;
    }

}