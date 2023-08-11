import { Component} from '@angular/core';
import { Response, DetailComponent, ItemList} from '../core/module';
import { PostaUser } from './_obj/posta';
import { PostaService } from './_services/posta.service';

@Component({
  selector: 'posta-email-detail',
  templateUrl : './_view/email.detail.html',
  providers: [ ]
})

/***
 * Posta emailove adresy postovniho serveru
 */
export class PostaEmailDetail extends DetailComponent { 

    _domeny : ItemList[] = [];

    constructor(private serv: PostaService) {                      
        super();
    }


    ngOnInit(): void {

        this.serv.getDomenyCBO().then(r =>  {
            this._domeny = r;
        });        
    }

    saveme() {
        this.serv.updateEmail(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });      
    }

    edit(id:number){
        
        this.serv.getEmail(id).then((j: PostaUser) => {
            this._rec = j
            this.detailChanged.emit(this);
        });
    }

    
    dropme(){        
        this.serv.dropEmail(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getEmail(-1).then((j: PostaUser) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }
    
}