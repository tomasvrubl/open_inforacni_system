import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Sklad } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { iDetail, Response } from '../core/module';

@Component({
  selector: 'sklad-detail',
  templateUrl : './_view/sklad.detail.html',
  providers: [ ]
})

export class SkladDetail implements iDetail  { 

    response : Response;  
    @Input() sklad : Sklad;    
    @Output() skladChanged = new EventEmitter();
    
    
    constructor(private cisService: CiselnikService) {              
        this.sklad = new Sklad();            
        this.response = new Response();    
    }
    
  
    onSubmit() {}
    
    saveme() {
       this.cisService.updateSklad(this.sklad).then((response :Response) =>  {
            this.response = response;
            this.sklad = response.data;
            this.skladChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.cisService.getSklad(id).then((j: Sklad) => this.sklad = j);
    }
    
    dropme(){        
        this.cisService.dropSklad(this.sklad).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.cisService.getSklad(-1).then((j: Sklad) => this.sklad = j).then(()=>this.skladChanged.emit(this));            
            }  
        });            
    }
    
   

}