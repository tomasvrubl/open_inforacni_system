<?php

namespace ws\Pomocne;

use dibi;
use Nette\Security\User;

/** @controller */
class DashboardController extends BaseController
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
    public function getWidgets()
    {
       
       $d = dibi::query("select json from [security_user_params] where security_user_id=%i and param='DASHBOARD'", $this->user->getId());
       
       $resp = [];
       
       $d = $d->fetch();
       if($d){
          $json = $d['json'];
          $resp = json_decode($json); 
       }
        
       return $resp;
    }

   
    /** @callable  */
    public function updateWidgets($widget=[])
    {
        $r = ['kod'=> 0, 'nazev' => 'Změny zapsány', 'data'=> null];

        $sjson = json_encode($widget);
        if(!$sjson){
            return ['kod'=> 1, 'nazev'=> 'Navalidní vstupní data', 'data'=> null];
        }
        
        $d = dibi::query("select id from [security_user_params] where security_user_id=%i and param='DASHBOARD'", $this->user->getId())
                ->fetch();
        
        if(!$d){
            $a = ['json'=> $sjson, 'param'=> 'DASHBOARD', 'security_user_id'=>  $this->user->getId()];
            dibi::query("insert into [security_user_params]", $a);            
        }
        else{
            $a = ['json'=> $sjson];
            dibi::query("UPDATE [security_user_params] SET ", $a, " WHERE security_user_id=%i and param='DASHBOARD'", $this->user->getId());
        }
        
        $r['data'] = $widget;
        return $r;
    }
    
    /** @callable  */
    public function addWidget($widget=null){
        
        $r = ['kod'=> 0, 'nazev' => 'Přidáno na nástěnku', 'data'=> null];
        
        $list = $this->getWidgets();
        
        $is = false;
        if(count($list) > 0){
            foreach($list as $l){
                
                if(strcmp($l->name, $widget['name']) == 0 && $l->id == $widget['id']){
                    
                    $l->params = $widget->params;
                    $r['data'] = $this->updateWidgets($list);                             
                    $is = true;
                    break;
                }
                
            }
        }
        
        if(!$is){            
            $list[] = $widget;
            $r['data'] = $this->updateWidgets($list);
        }
        
        return $r;
    }

}