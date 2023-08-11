import { Component, Input, Output, EventEmitter} from '@angular/core';
import { PersPracKategorie } from './_obj/person';
import { PersonService } from './_services/person.service';
import { Response, iDetail } from '../core/module';

@Component({
  selector: 'pers-prackat-detail',
  templateUrl : './_view/prackat.detail.html',
  providers: [ ]
})

export class PersPracKategorieDetail implements iDetail { 

    response : Response;  
    _rec : PersPracKategorie = new PersPracKategorie();    
    @Output() kategorieChanged = new EventEmitter();
    
    constructor(private serv: PersonService) {                      
        this.response = new Response();             
    }
    
    @Input() 
    set detail(val: PersPracKategorie) {
        
        if(val == null){
            this._rec = new PersPracKategorie();
        }
        else{
            this._rec  = val;
        }
           
    }  
    
    get detail() : PersPracKategorie {
        return this._rec;
    }  
    
    saveme() {
        this.serv.updatePracovniKategorie(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.kategorieChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }
    
    edit(id:number){
        this.serv.getPracovniKategorie(id).then((j: PersPracKategorie) => this._rec = j);
    }
    
    dropme(){        
        this.serv.dropPracovniKategorie(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getPracovniKategorie(-1).then((j: PersPracKategorie) => this._rec = j).then(()=>this.kategorieChanged.emit(this));            
            }  
        });            
    }
    
    
    
   
    
}