import { Component, Input, Output, EventEmitter} from '@angular/core';
import { PersSkupina } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Response, iDetail } from '../core/module';

@Component({
  selector: 'pers-skupina-detail',
  templateUrl : './_view/skupina.detail.html',
  providers: [ ]
})

export class PersSkupinaDetail implements iDetail { 

    response : Response = new Response();  
    _rec : PersSkupina = new PersSkupina();    
    @Output() skupinaChanged = new EventEmitter();
    
    constructor(private serv: ProhlidkyService) { }
    
    @Input() 
    set detail(val: PersSkupina) {
        
        if(val == null){
            this._rec = new PersSkupina();
        }
        else{
            this._rec  = val;
        }
           
    }  
    
    get detail() : PersSkupina {
        return this._rec;
    }  
    
    

    saveme() {
        this.serv.updatePersSkupina(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.skupinaChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }
    
    edit(id:number){
        this.serv.getPersSkupina(id).then((j: PersSkupina) => this._rec = j);
    }
    
    dropme(){        
        this.serv.dropPersSkupina(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getPersSkupina(-1).then((j: PersSkupina) => this._rec = j).then(()=>this.skupinaChanged.emit(this));            
            }  
        });            
    }
    
    
    
   
    
}