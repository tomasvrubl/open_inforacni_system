import { Component, Input} from '@angular/core';
import { Response, DetailComponent, ItemList} from '../core/module';
import { PostaAlias } from './_obj/posta';
import { PostaService } from './_services/posta.service';

@Component({
  selector: 'posta-alias-detail',
  templateUrl : './_view/alias.detail.html',
  providers: [ ]
})

/***
 * Posta aliasy mailoveho serveru
 */
export class PostaAliasDetail extends DetailComponent { 


    _domeny : ItemList[] = [];
    _adresy: string[] = [];

    constructor(private serv: PostaService) {                      
        super();
    }


    ngOnInit(): void {

        this.serv.getDomenyCBO().then(r =>  {
            this._domeny = r;
        });        
    }

    saveme() {
        this._rec.destination = this._adresy.join(";");

        this.serv.updateAlias(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });      
    }

    edit(id:number){
        
        this.serv.getAlias(id).then((j: PostaAlias) => {
            this._rec = j;

            this._adresy = j.destination.split(';');
            this.detailChanged.emit(this);
        });
    }

    @Input() 
    set detail(val : any){
        
        
        if(val == null){
           return;
        }
        else{
            this._rec = val;
            this._adresy = val.destination.split(';');
        }            
        
    } 
    
    get detail(): any {
        return this._rec;
    }

    
    dropme(){        
        this.serv.dropAlias(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getAlias(-1).then((j: PostaAlias) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }
    
}