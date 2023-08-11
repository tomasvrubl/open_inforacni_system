import { Component, Input} from '@angular/core';
import { Response, DetailComponent, ItemList} from '../core/module';
import { PostaDomena } from './_obj/posta';
import { PostaService } from './_services/posta.service';

@Component({
  selector: 'posta-domain-detail',
  templateUrl : './_view/domain.detail.html',
  providers: [ ]
})

/***
 * Posta domeny mailoveho serveru
 */
export class PostaDomainDetail extends DetailComponent { 



    constructor(private serv: PostaService) {                      
        super();
    }

    saveme() {
        this.serv.updateDomain(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });      
    }

    edit(id:number){
        
        this.serv.getDomain(id).then((j: PostaDomena) => {
            this._rec = j
            this.detailChanged.emit(this);
        });
    }

    
    dropme(){        
        this.serv.dropDomain(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getDomain(-1).then((j: PostaDomena) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }
    
}