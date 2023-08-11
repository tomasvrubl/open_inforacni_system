import { Component, Input } from '@angular/core';
import { Odmena } from './_obj/person';
import { PersonService } from './_services/person.service';
import { iDetail, Response } from '../core/module';
import { OsobaListComponent } from './osoba.list';

@Component({
  selector: 'pers-odmena-detail',
  templateUrl : './_view/odmena.detail.html',
  providers: [ ]
})

export class OdmenaDetail implements iDetail { 

    response : Response;  
    _odmena : Odmena;    
    _osobaList: any = OsobaListComponent;
    
    constructor(private srv: PersonService) {              
        this._odmena = new Odmena();            
        this.response = new Response();    
    }


    @Input() 
    set detail(val : Odmena){
        
        if(val == null){
            this._odmena = new Odmena();
        }
        else{
            this._odmena = val;
        }            
        
    } 
        
    get detail(): Odmena {
        return this._odmena;
    }
    

    vyplatit(){
        
        this.srv.vyplacenoOdmena(this._odmena).then((response :Response) =>  {
            this.response = response;
            this._odmena = response.data;
       });      
    }
    
    saveme() {
    
        this.srv.updateOdmena(this._odmena).then((response :Response) =>  {
            this.response = response;
            this._odmena = response.data;
       });        
    }
    
    newone(){
        this.edit(-1);
    }


    edit(id:number){
        this.srv.getOdmena(id).then((j: Odmena) => this._odmena = j);
    }
    
    dropme(){        
        this.srv.dropOdmena(this._odmena).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.srv.getOdmena(-1).then((j: Odmena) => this._odmena = j);
            }  
        });            
    }

    
    onOsobaChanged(ev: any){      
        
        if(ev == null){
            this._odmena.osoba_id = -1;
            this._odmena.osoba_oscislo = '';
            this._odmena.osoba_osoba = '';
        }
        else{
            this._odmena.osoba_id = ev.id;
            this._odmena.osoba_oscislo = ev.oscislo;
            this._odmena.osoba_osoba = ev.prijmeni + ' ' + ev.jmeno;
        }
        
        
    }

}