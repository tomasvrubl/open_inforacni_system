import { Component} from '@angular/core';
import { Response, DetailComponent} from '../core/module';
import { OrganizaceService } from './_services/organizace.service';
import { Telkontakt } from './_obj/organizace';

@Component({
  selector: 'org-telefonni-seznam-detail',
  templateUrl : './_view/telseznam.detail.html',
  providers: [ ]
})

export class TelseznamDetail extends DetailComponent { 


    constructor(private serv: OrganizaceService) {                      
        super();
    }


    saveme() {
        
        this.serv.updateKontakt(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }

    edit(id:number){
        
        this.serv.getKontakt(id, 0).then((j: Telkontakt) => {
            this._rec = j;
            this.detailChanged.emit(this);
        });


    }
    
    dropme(){        
        this.serv.dropKontakt(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getKontakt(-1, 0).then((j: Telkontakt) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }
    
}