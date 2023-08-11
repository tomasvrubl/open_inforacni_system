import { Component, OnInit,  OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AutoVykazTempl } from './_obj/cestak';
import { CestakService } from './_services/cestak.service';
import { Response  } from '../core/module';


@Component({
  selector: 'auto-vykaz-user-templ',
  templateUrl : './_view/auto.vykaz.user.tmpl.html'
})

export class AutoVykazUserTemplComponent implements OnInit, OnDestroy { 

    list : AutoVykazTempl[];
    response : Response;  
    inProgress : boolean = false;
    _editIDX : number = -1;
    chkAll: boolean = false;
    
    constructor(private cestakService: CestakService, private router: Router, private location: Location) {
        
        this.response = new Response(); 
        this.list = [];
    }
    
    ngOnInit(): void {                
        this.inProgress = true;
        this.cestakService.getAutoVykazUserTemplate().then((arr: AutoVykazTempl[]) =>{
             this.list = arr;
             this.inProgress = false;
        });       
    }
    
    ngOnDestroy() {}
 
    
    generate(){
        this.inProgress = true;
        this.cestakService.generateAutoVykazUserTemplate().then((arr: AutoVykazTempl[]) =>{
             this.list = arr;
             this.inProgress = false;
        });       
    }
    
    newone(){        
        this.list.push(new AutoVykazTempl());
    }
    
    
    dropRecord(ev:any){
        
        if(this._editIDX > -1){
            this.list[this._editIDX]._ischk = true;    
            this._editIDX = -1;
        }
        
        this.dropSelected();

    }

    dropSelected(){

       
        var l = [];
        
        for(var i=0; i < this.list.length; ++i){
            if(this.list[i]._ischk == true){
                l.push(this.list[i]);
            }
        }
        
        if (l.length < 1){
            
            return;
        }
        
        this.cestakService.dropAutoVykazUserTemplate(l).then((resp:Response)=> {
            this.response = resp;
            this.list = resp.data;
            this.chkAll = false;
        })
    }
    
    navback(){
        
        window.close();
    }
    
    saveme(){    
        this.cestakService.udateAutoVykazUserTemplate(this.list).then((resp:Response)=> {
            this.response = resp;
            this.list = resp.data;
        })
    }
    
    checkAll(){
        
        for(var i=0; i < this.list.length; ++i){
            this.list[i]._ischk = this.chkAll;
        }
    }
}