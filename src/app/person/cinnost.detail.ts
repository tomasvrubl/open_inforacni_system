import { Component, Input, Output, EventEmitter} from '@angular/core';
import { PersPracCinnost } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Response, iDetail } from '../core/module';

@Component({
  selector: 'pers-cinnost-detail',
  templateUrl : './_view/cinnost.detail.html',
  providers: [ ]
})

export class PersCinnostDetail implements iDetail { 

    response : Response = new Response();  
    _rec : PersPracCinnost = new PersPracCinnost();    
    @Output() cinnostChanged = new EventEmitter();
    
    constructor(private serv: ProhlidkyService) {                      
        this.response = new Response();             
    }
    
    @Input() 
    set detail(val: PersPracCinnost) {
        
        if(val == null){
            this._rec = new PersPracCinnost();
        }
        else{
            this._rec  = val;
        }
           
    }  
    
    get detail() : PersPracCinnost {
        return this._rec;
    }  
    
    
    saveme() {
        this.serv.updatePracCinnost(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.cinnostChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }
    
    edit(id:number){
        this.serv.getPracCinnost(id).then((j: PersPracCinnost) => this._rec = j);
    }
    
    dropme(){        
        this.serv.dropPracCinnost(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getPracCinnost(-1).then((j: PersPracCinnost) => this._rec = j).then(()=>this.cinnostChanged.emit(this));            
            }  
        });            
    }

}