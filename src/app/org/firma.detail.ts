import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Firma } from './_obj/firma';
import { OrganizaceService } from './_services/organizace.service';
import { Response, iDetail } from '../core/module';

@Component({
  selector: 'firma-detail',
  templateUrl : './_view/firma.detail.html',
  providers: [ ]
})

export class FirmaDetail implements iDetail { 

    response : Response;  
    _rec : Firma = new Firma();    
    @Output() firmaChanged = new EventEmitter();
    
    
    constructor(private serv: OrganizaceService) {                      
        this.response = new Response();             
    }
    
    @Input() 
    set detail(val: Firma) {
        
        if(val == null){
            this._rec = new Firma();
        }
        else{
            this._rec  = val;
        }
             
    }  

    
    
    get detail() : Firma {
        return this._rec;
    }  
    
    
    saveme() {
       this.serv.updateFirma(this._rec).then(response => this.asyncSaveResponse(response));        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.serv.getFirma(id).then((j: Firma) => this._rec = j);
    }
    
    dropme(){        
        this.serv.dropFirma(this._rec).then(response => this.asyncDropResponse(response));            
    }
    

    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this.serv.getFirma(-1).then((j: Firma) => this._rec = j).then(()=>this.firmaChanged.emit(this));            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this._rec = resp.data;
        this.firmaChanged.emit(this);
    }

    
}