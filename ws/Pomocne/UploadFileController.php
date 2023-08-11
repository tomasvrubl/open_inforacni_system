<?php

namespace ws\Pomocne;

use dibi;
use Nette\Security\User;
use ws\BaseController;


/** @controller */
class UploadFileController extends BaseController
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


    /** @callable  */
    public function getTable($tabquery=null, $urlrec=null)
    {
        
        $urlrec = sanitize($urlrec);
        
        //priznak candelete ridi cron urcuje co muze mazat a co nemuze co je urceno k smazani
        $table = "( SELECT a.id,  a.nazev, a.note, a.url, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                    FROM framework_prilohy a WHERE a.url_rec='{$urlrec}' and a.candelete=0) X ";
        
        $resp = TableHelper::query($tabquery, "X.*", $table);
        return $resp;
    }


    /** @callable  */
    public function uploadAttachment($modul=null,$urlrec=null){

        $r = ['kod'=> 0, 'nazev' => 'Soubor nahrán', 'data'=> null];
        $dir = STORAGE."/";
        $url = $this->getURL()."/".STORAGE_URL;
        $urlrec = sanitize($urlrec);

        if(!empty($modul)){
            $dir .= $modul."/";
            $url .= $modul."/";
        }


        if(!is_dir($dir)){
            mkdir($dir);
        }                

        foreach($_FILES as $f){
            try{

                $temp= explode('.',$f['name']);
                if($temp > 0){
                    $mime = end($temp);
                }
                else{
                    $mime = "";
                }
                
                
                $fname = $this->randomHashFile()."_".$f['name'];
                $path = $dir.$fname;
                @copy($f["tmp_name"], $path);

                $a = ['url'=> $url.$fname, 'note'=>$f['name'], 'url_rec'=>$urlrec, 'velikost'=>$f['size'], 'path'=>$path, 'skupina'=>$modul, 'temphash'=> $this->randomHash(), 'mime'=>$mime, 'nazev'=>$f['name'], 'zmenil'=>$this->getUserID()];
                dibi::query("insert into framework_prilohy", $a);     
                $id = dibi::query("select currval('framework_prilohy_id_seq')")->fetchSingle();                
                $r['data'] = $this->getAttachment($id);
            }
            catch(Exception $ex){
                $r['kod'] = 1;
                $r['nazev'] = $ex->getMessage();
            }
        }
        return $r;
    }


    /** @callable  */
    public function getAttachment($id=-1){


        if($id > -1){
            $dt = dibi::query("SELECT a.*, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                                    coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                                FROM framework_prilohy a WHERE id=%i", $id);

            $p = $dt->fetch();

            if($p){
                return  (object) [
                    'id' => $p['id'],
                    'url'=> $p['url'], 
                    'note'=> $p['note'], 
                    'skupina'=> $p['skupina'], 
                    'mime'=> $p['mime'], 
                    'tagy'=> $p['tagy'], 
                    'url_rec'=> $p['url_rec'], 
                    'velikost'=> $p['velikost'], 
                    'zmeneno'=> $p['zmeneno'], 
                    'zmenil'=>$p['zmenil'], 
                    'temphash'=> $p['temphash'], 
                    'nazev'=> $p['nazev'], 
                    'path'=> $p['path']
                ]; 
            }
            
        }

        return (object) [
                'id' => -1,
                'url'=> '', 
                'note'=> '', 
                'skupina'=> '', 
                'mime'=> '', 
                'tagy'=> '', 
                'url_rec'=> '', 
                'velikost'=> 0, 
                'zmenil'=> '', 
                'zmeneno'=> '', 
                'temphash'=> '', 
                'nazev'=> '', 
                'path'=> ''
            ]; 
        

    }


    /** @callable  */
    public static function DropByUrlRec($hash=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){

            $v = dibi::query("SELECT path FROM framework_prilohy WHERE url_rec=%s", $hash)->fetchSingle();

            if(file_exists($v)){
                unlink($v);
            }
            dibi::query("DELETE FROM framework_prilohy WHERE id=%i", $id);
        }

        return $r;
    }



    /** @callable  */
    public static function Drop($id=-1)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam odstraněn', 'data'=> null];
        $id = intval($id);

        if($id > -1){

            $v = dibi::query("SELECT path FROM framework_prilohy WHERE id=%i", $id)->fetchSingle();

            if(file_exists($v)){
                unlink($v);
            }
            dibi::query("DELETE FROM framework_prilohy WHERE id=%i", $id);
        }

        return $r;
    }

    /** @callable  */
    public function update($rec)
    {
        $r = ['kod'=> 0, 'nazev' => 'Záznam aktualizován', 'data'=> null];

        $id = $rec['id'];
        $a = [
            'nazev'=>$rec['nazev'],
            'note'=>$rec['note'],
            'skupina'=>$rec['skupina'],
            'tagy'=>$rec['tagy'],            
            'zmenil' => $this->user->getId(),
            'zmeneno' => 'now()'
        ];

        dibi::query('UPDATE framework_prilohy SET ', $a, ' WHERE id=%i', $id);        
        $r['data'] = $this->getAttachment($id);
        return $r;
    }

}