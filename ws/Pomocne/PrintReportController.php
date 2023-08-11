<?php

namespace ws\Pomocne;

use dibi;
use Nette\Security\User;
use ws\BaseController;

use ws\Pomocne\TemplateProcessorReport;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;


/** @controller */
class PrintReportController extends BaseController
{
    
        /** @callable  */
    public function pdf(){
  

        Settings::setPdfRendererName(Settings::PDF_RENDERER_DOMPDF);
        Settings::setPdfRendererPath('.');

        $TEMP_DIR = \ws\Bootstrap\ProxyContainer::$temp;

        $rep_id = intval($_REQUEST['report_id']);
        $rec_list = $_REQUEST['id'];

        $pdf_list = [];

        foreach($rec_list as $rec_id){

            $rec_id = intval($rec_id);
        
            $tempname = tempnam($TEMP_DIR, 'id-'.$rec_id."-".$rep_id);
            rename($tempname, $tempname.'.docx');

            $tempname .='.docx';

            $dt = dibi::query("select path from framework_tisk where id=%i", $rep_id)->fetch();
            if(!$dt){
                throw new Exception("Nevalidni vstupni data. Tiskova sestava id:".$rep_id." neexistuje.");
            }

            $t = new TemplateProcessorReport($dt['path']);
            $varlist = $t->getVariables();
            $forms = $t->getElements();


            //echo "ALL: \r\n";
            //print_r($varlist);

            $osoba = $this->getJmenoPrijmeni();
            $dnes = date("d.m.Y");


            $blocks = [];
            $var = [];
            $sql = [];

            //rozdel na sql, bloky, promene
            foreach($varlist as $b){
                if($b[0] == '/'){
                        $x = ltrim($b, '/');
                        
                        if(startsWith($x, "sql")){                
                            $sql[] = $x;
                            continue;
                        }

                        $blocks[] = $x;
                }
                else{
                    if(strcasecmp($b, "%uzivatel") == 0){
                        $t->setValue($b, array($osoba, TemplateProcessorReport::NONE));
                    }
                    else if(strcasecmp($b, "%dnes") == 0){
                        $t->setValue($b, array($dnes, TemplateProcessorReport::NONE));
                    }
                    else{
                        $var[] = $b;
                    }                 
                }
            }


            $var = array_values(array_diff($var, $blocks, $sql));

            $tmp = [];
            for($i=0; $i < count($var); ++$i){

                $e = explode("_", $var[$i]);
                if(count($e) > 1){
                    $tmp[$e[0]][] = substr($var[$i], strlen($e[0])+1);
                }
                else{
                    $tmp[""][] = $var[$i];
                }
            }

            $var = $tmp;


            //zpracuj sql
            $tmp = [];
            for($i=0; $i < count($sql); ++$i){
                    $e = explode(".", $sql[$i]);

                    if(count($e) > 1){
                        $tmp[$e[1]] = $t->getBlockValue($sql[$i]);
                    }
                    else{
                        $tmp[""] = $t->getBlockValue($sql[$i]);
                    }
            }

            $sql = $tmp;



            
            foreach($sql as $key=>$s){

                $s[0] = str_ireplace("&apos;", "'", $s[0]);
                $s[0] = str_ireplace("%id", $rec_id, $s[0]);
                $s[0] = str_ireplace("&quot;", "\"", $s[0]);
                $s[0] = str_ireplace("”", "\`", $s[0]);
                $s[0] = str_ireplace("`", "'", $s[0]);  
                
        
                $dt = dibi::query(strtolower($s[0]))->fetchAll();
        
                if(count($dt) > 1){
        
                     $ar = [];             
                     foreach($dt as $d){
        
                        $d = (array) $d;
                        $a = [];
                        if(key_exists($key, $var)){
                            foreach($var[$key] as $v){  //zpracovani klasickych promenych
                                $vkey = rtrim(strtolower($v), '#');
                                $a[$key."_".$v] = array($d[$vkey], TemplateProcessorReport::NONE);
                           }
                        }
                        
                        if(key_exists($key, $forms)){
                            foreach($forms[$key] as $v){  //zpracovani formularovych prvku 
                                $a[$key."_".$v[0]] = array($d[rtrim(strtolower($v[0]),'#')], $v[1]);
                            }
                        }
        
                        $ar[] = $a;
                     }
        
                    $t->cloneRowAndSetValues($key."_".$var[$key][0], $ar);
                     
                }
                else if(count($dt) == 1) {                
                     $dt = (array)$dt[0];
        
                    if(key_exists($key, $var)){
                        foreach($var[$key] as $v){
                            try{
                                $vkey = rtrim(strtolower($v), '#');
                                if(key_exists($vkey, $dt)){
                                    $t->setValue($key."_".$v, array($dt[$vkey], TemplateProcessorReport::NONE));                            
                                }
                                else{
                                    $t->setValue($key."_".$v, array("", TemplateProcessorReport::NONE));                            
                                }
                                
                            }catch(Exception $ex){}
                            
                        }
                    }                        

                    if(key_exists($key, $forms)){ 
                        foreach($forms[$key] as $v){  //zpracovani formularovych prvku 
                            try{
                                $vkey = rtrim(strtolower($v), '#');
                                if(key_exists($vkey, $dt)){
                                    $t->setValue($key."_".$v[0], array($dt[$vkey], $v[1]));
                                }
                                else{
                                    $t->setValue($key."_".$v[0], array("", TemplateProcessorReport::NONE));   
                                }

                            }catch(Exception $ex){}
                             
                         }
                     }
        
                }

            }

            
            foreach($sql as $key => $s){        
                    if(strlen($key) > 0){
                        $t->dropBlock("sql.".$key);
                    }
                    else{
                        $t->dropBlock("sql");
                    }
            }


            $t->saveAs($tempname);
            $cmd = "/usr/bin/libreoffice --headless --convert-to pdf {$tempname} --outdir {$TEMP_DIR}/";
            exec($cmd);            
            @unlink($tempname);

            $pdf_list[] = rtrim($tempname, "docx")."pdf";

        }


        $pdfout = "";

        $tot = count($pdf_list);
        if($tot == 1){            
            $pdfout = $pdf_list[0];
        }
        else if($tot > 0){
            
            $pdfout =  tempnam($TEMP_DIR, "id-".$rep_id."-merged.pdf");            
            
            exec("/usr/bin/pdfunite ".implode(" ", $pdf_list)." ".$pdfout);           

            foreach($pdf_list as $p){
                @unlink($p);
            }
        }


        header("Content-Disposition: attachment; filename=id-".$rep_id.".pdf;");
        header("Content-Type: application/pdf");
        header('Content-Length: ' . filesize($pdfout));

        $fp = fopen($pdfout, 'rb');
        fpassthru($fp);
        fclose($fp);
        @unlink($pdfout);
        exit;
    }

    /** @callable  */
    public function getList($recurl=''){

        $r = [];

        $dt = dibi::query("SELECT a.*, to_char(a.zmeneno, 'DD.MM.YYYY HH24:MI:SS') zmeneno , 
                                        coalesce((select prijmeni || ' ' || jmeno  from security_user u where u.id = a.zmenil), '') as zmenil 
                                FROM framework_tisk a WHERE url_rec=%s", $recurl)->fetchAll();

        foreach($dt as $d){

           $r[] = [
                   'id' => $d['id'],
                   'nazev' => $d['nazev'],
                   'url' => $d['url'],
                   'url_rec' => $d['url_rec'],
                   'note' => $d['note'],
                   'zmenil' => $d['zmenil'],
                   'zmeneno' => $d['zmeneno'],
                   'path' => $d['path'],
           ];

        }

        return $r;
    }




}