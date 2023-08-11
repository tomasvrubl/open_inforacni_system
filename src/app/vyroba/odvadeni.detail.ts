import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Odvadeni } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';
import { iDetail, Response } from '../core/module';
import { ZakazkaList } from './zakazka.list';


@Component({
  selector: 'odvadeni-detail',
  templateUrl : './_view/odvadeni.detail.html',
  providers: [ ]
})

export class OdvadeniDetail implements iDetail { 

    response : Response = new Response();  
    cboZdroj : any[] = [];
    cboSmena: any[] = [];    
    showZakazkaList: boolean = false;
    _rec : Odvadeni = new Odvadeni();     
    _zakazkaList : any = ZakazkaList;
    @Output() odvadeniChanged = new EventEmitter();
        
    constructor(private vyrService: VyrobaService) {
    }    
    
    @Input() 
    set detail(val :Odvadeni) {
        
        if(val == null){
            this._rec = new Odvadeni();
        }
        else{
            this._rec  = val;
        }        
    }  
    
    get detail() : Odvadeni {
        return this._rec;
    }  

    saveme() {
        this.vyrService.updateOdvadeni(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.odvadeniChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.vyrService.getOdvadeni(id).then((j: Odvadeni) => this._rec = j);
    }

    dropme(){        
        this.vyrService.dropOdvadeni(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.vyrService.getOdvadeni(-1).then((j: Odvadeni) => this._rec = j).then(()=>this.odvadeniChanged.emit(this));     
            }  
        });            
    }


    
    onZakazkaChanged(ev: any){      
        
        if(ev == null){
            this._rec.zakazka_id = -1;
            this._rec.zakazka_vyrobek = '';
            this._rec.zakazka_nazev = '';
        }
        else{
            this._rec.zakazka_id = ev.id;
            this._rec.zakazka_vyrobek = ev.tp_vyrobek;
            this._rec.zakazka_nazev = ev.zakazka_nazev;
        }
        
    }

    
}