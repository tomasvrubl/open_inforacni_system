<?php

namespace ws;

use dibi;
use Nette\Security\User;
use ws\Exceptions\SecurityException;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;


/** @controller */
class BaseController
{
    
    public $config;

    /**
     * @var User
     * @inject
     */
    public $user;

    public function checkRequirements($method)
    {
        return true;
    }
    
   
    /* Osoba ID pro prihlaseneho uzivatele
    */
    public function getOsobaID(){
        return $this->user->getIdentity()->osoba_id;
    }

    /* Zobrazovane jmeno
    */
    public function getPrijmeniJmeno(){
        return $this->user->getIdentity()->prijmeni." ".$this->user->getIdentity()->jmeno;
    }

    public function getJmenoPrijmeni(){
        return $this->user->getIdentity()->jmeno." ".$this->user->getIdentity()->prijmeni;
    }


    /* Osobni cislo
    */
    public function getOsobniCislo(){
        return $this->user->getIdentity()->oscislo;
    }



    /*** Je administrator
     */
    public function isAdmin(){
        try{

            if($this->user == null || $this->user->getIdentity() == null){
                return false;
            }

            return  $this->user->getIdentity()->isadmin;

        }catch(Exception $ex){
            return false;
        }
        
    }
    
    public function getCurrentUser(){
        return $this->user->getIdentity();
    }

    public function getUserParam($kod){
        return $this->user->getUserParam($kod);
    }

    public function setUserParam($kod, $val){
        return $this->user->setUserParam($kod, $val);
    }

    public function getUserID(){
        return $this->user->getId();
    }
    
    
    public function getNow(){
        return date("Y-m-d H:i:s");
    }

    public function getToday(){
        return date("Y-m-d");
    }

    /**
     *  Fiskalni rok, desitky
     */ 
    public function getFiskalniRok(){ 
        return date('Y') % 2000;
    }

    public function sanitizeDate($dt){

        $datum = $dt;
    
        if(empty($datum)){
            return null;
        }
        
        
        if(strpos($datum, "T") > 0){
        
            $v = explode("T", $datum);
            $datum = $v[0];
        
        }else if(strpos($datum, ":") > 0){
        
            $v = explode(" ", $datum);
            $datum = $v[0];
        }
        
        
        $e  = explode('.', $datum);   
        
        if(count($e) > 1){
            $datum =  $e[2]."-".$e[1]."-".$e[0];
        }
        
    
        return $datum;
    }

    public function sanitize($text){
        return sanitize($text);
    }

    public function sanitizeTime($dt){

        $time = $dt;
    
        if(empty($time)){
            return "00:00";
        }
        

        $v = explode(":", $time);
        
        if(count($v) > 1){
            
            $time = $v[0].":".$v[1];
        }
        else{
            $time = "00:00";
        }
        
    
        return $time;
    }


    public function is($group="", $role="", $subrole=""){

        $r = false;

        if($this->user){            

            $gr = $group.":".$role;    
            $lst = $this->user->getIdentity()->role;

            if(array_key_exists($gr, $lst)){

                if(strlen($subrole) > 0) {                    
                    $r = in_array($subrole, $lst[$gr]->params);
                }else{
                    $r = true;
                }
            }
            
        }
        return  $r;

    }


    /** @callable */
    public function logout()
    {
        $this->user->logout(true);
    }

    /* URL adresa serveru
    */
    public function getURL(){

        return $this->getUrlOrigin($_SERVER);
    }



    public static function randomHash($len=20){

        $h = "ABCDEFGHIJKLMNOPQRSTUVwxyzabcdefghijklmnopqrstuvwxyz0123456789*+-/.)(@#!:,;";
        $strl = strlen($h);

        $hash = "";
        for($i=0; $i < $len; $i++){
            $hash .= $h[rand(0, $strl - 1)];
        }

        return $hash;
    }


    function getURLOrigin( $s, $use_forwarded_host = false )
    {
        $ssl      = ( ! empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on' );
        $sp       = strtolower( $s['SERVER_PROTOCOL'] );
        $protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
        $port     = $s['SERVER_PORT'];
        $port     = ( ( ! $ssl && $port=='80' ) || ( $ssl && $port=='443' ) ) ? '' : ':'.$port;
        $host     = ( $use_forwarded_host && isset( $s['HTTP_X_FORWARDED_HOST'] ) ) ? $s['HTTP_X_FORWARDED_HOST'] : ( isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : null );
        $host     = isset( $host ) ? $host : $s['SERVER_NAME'] . $port;
        return $protocol . '://' . $host;
    }

    function sendMail($subject, $body, $address=array()) 
    {
        
        $sett = dibi::query("select (select param from settings where kod='MAIL_PASSWORD') smtp_password,
                    (select param from settings where kod='MAIL_USER') smtp_user,
                    (select param from settings where kod='MAIL_SMTP_PORT') smtp_port,
                    (select param from settings where kod='MAIL_SMTP_IP') smtp_server,
                    (select param from settings where kod='MAIL_SMTP_SSL_TLS') smtp_ssl_tls")->fetch();


        $mail = new PHPMailer(true); 
        $mail->isSMTP();   
        $mail->CharSet = 'UTF-8';
        $mail->Host = $sett['smtp_server'];        // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                    // Enable SMTP authentication
        $mail->Username = $sett['smtp_user'];      // SMTP username
        $mail->Password = $sett['smtp_password'];  // SMTP password
        $mail->SMTPSecure = $sett['smtp_ssl_tls']; // Enable TLS encryption, `ssl` also accepted
        $mail->Port = $sett['smtp_port'];          // TCP port to connect to
    

        $mail->isHTML(true);
    
        $mail->setFrom($sett['smtp_user']);
        foreach($address as $a){
            $mail->addAddress(trim($a));          
        }
    

        $head = "<!doctype html>
                    <head>
                        <style>
                        table { margin-top: 15px;}
                        table th { text-align: left; padding: 4px 5px; font-size: 0.9em; padding-left: 5px; border-bottom: 2px solid #4889ce;  padding-bottom: 5px; background: #F9F9F9; padding-top: 5px; }
                        table td { border-bottom: 1px solid #ccc; font-size: 0.9em; padding: 4px 5px; }
                        button, .btn { color: #FFF;font-size: 12px;box-shadow: inset 0 0px 1px rgba(0, 0, 0, .6);cursor: pointer;line-height: 1;border-radius: 0px;padding: 8px 10px;background: #337ab7;vertical-align: middle;}
                        .storno {background: #d5d5d5;}
                        </style>
                    </head>
                    <body>";

        $mail->Subject = $subject;
        $mail->Body    = $head.$body."</body></html>";
        $mail->send();
    }
    
}