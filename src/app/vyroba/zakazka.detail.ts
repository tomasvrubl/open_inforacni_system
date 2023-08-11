import { Component, OnInit,  OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Zakazka } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';
import { iDetail, Response } from '../core/module';

@Component({
  selector: 'zakazka-detail',
  templateUrl : './_view/zakazka.detail.html',
  providers: [ ]
})

export class ZakazkaDetail implements iDetail { 

    response : Response = new Response();   
    _rec : Zakazka = new Zakazka();    
    
    @Output() zakazkaChanged = new EventEmitter();
    
    constructor(private vyrService: VyrobaService) {      
    }
    

    @Input() 
    set detail(val: Zakazka) {
        
        if(val == null){
            this._rec = new Zakazka();
        }
        else{
            this._rec  = val;
        }
          
    }  
    
    get detail() : Zakazka {
        return this._rec;
    }  



    saveme() {

        this.vyrService.updateZakazka(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.zakazkaChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.vyrService.getZakazka(id).then((j: Zakazka) => this._rec = j);
    }

    dropme(){        
        this.vyrService.dropZakazka(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.vyrService.getZakazka(-1).then((j: Zakazka) => this._rec = j).then(()=>this.zakazkaChanged.emit(this));            
            }  
        });            
    }


    
    

}