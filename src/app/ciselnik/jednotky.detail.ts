import { Component, Input, Output, EventEmitter} from '@angular/core';
import { MernaJednotka } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { DetailComponent, Response, iDetail } from '../core/module';

@Component({
  selector: 'jednotka-detail',
  templateUrl : './_view/jednotky.detail.html',
  providers: [ ]
})

export class JednotkyDetail extends DetailComponent { 

    
    constructor(private cisService: CiselnikService) {   
        super();           
    }
    
    saveme() {
        this.cisService.updateJednotka(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }
    

    edit(id:number){
        this.cisService.getJednotka(id).then((j: MernaJednotka) => {
            this._rec = j;
            this.detailChanged.emit(this);
        } );
    }

    dropme(){        
        this.cisService.dropJednotka(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.cisService.getJednotka(-1).then((j: MernaJednotka) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }

    
}