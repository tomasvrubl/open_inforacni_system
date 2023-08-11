import { Component } from '@angular/core';
import { Vada } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { DetailComponent, Response } from '../core/module';

@Component({
  selector: 'vada-detail',
  templateUrl : './_view/vada.detail.html',
  providers: [ ]
})

export class VadaDetail extends DetailComponent { 

    
    constructor(private cisService: CiselnikService) {     
        super();   
    }
  
    
    
    saveme() {
        this.cisService.updateVada(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }

    edit(id:number){
        
        this.cisService.getVada(id).then((j: Vada) =>  {
            this._rec = j;
            this.detailChanged.emit(this);
        });
    }
    
    dropme(){       
        
        this.cisService.dropVada(this._rec).then((response :Response) =>  {
            this.response = response;

           if (response.kod == 0){
               this.cisService.getVada(-1).then((j: Vada) => this._rec = j).then(()=>this.detailChanged.emit(this));            
           }  
       }); 

    }

}