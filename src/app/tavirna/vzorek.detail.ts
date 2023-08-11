import { Component} from '@angular/core';
import { TavirnaService } from './_services/tavirna.service';
import { DetailComponent, Response } from '../core/module';
import { LabVzorek } from './_obj/tavirna';



@Component({
  selector: 'lab-vzorek-detail',
  templateUrl : './_view/vzorek.detail.html',
  providers: [ ]
})

export class LabVzorekDetail extends DetailComponent { 

    
    constructor(private srv: TavirnaService) {
        super();
    }


    
    saveme() {
        this.srv.updateLabVzorek(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }
    

    edit(id:number){
        this.srv.getLabVzorek(id).then((j: LabVzorek) => {
            this._rec = j;
            this.detailChanged.emit(this);
        });
    }

    
    dropme(){        
        this.srv.dropLabVzorek(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.srv.getLabVzorek(-1).then((j: LabVzorek) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }

}