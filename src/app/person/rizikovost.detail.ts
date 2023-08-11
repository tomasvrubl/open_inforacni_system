import { Component, Input, Output, EventEmitter} from '@angular/core';
import { PersRizikovost, PersSkupina, PersPracCinnost } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Response, iDetail } from '../core/module';

@Component({
  selector: 'pers-rizikovost-detail',
  templateUrl : './_view/rizikovost.detail.html',
  providers: [ ]
})

export class PersRizikovostDetail implements iDetail { 

    response : Response;  
    skupinyList: PersSkupina[] = [];
    cinnostList: PersPracCinnost[] = [];
    _rec : PersRizikovost = new PersRizikovost();    
    @Output() rizikovostChanged = new EventEmitter();
    
    constructor(private serv: ProhlidkyService) {                      
        this.response = new Response();             

        this.serv.getPersSkupinaList().then((list: PersSkupina[]) => {
            this.skupinyList = list;
        });

        this.serv.getPracCinnostList().then((list: PersPracCinnost[]) => {
            this.cinnostList = list;
        });

    }


    
    @Input() 
    set detail(val: PersRizikovost) {
        
        if(val == null){
            this._rec = new PersRizikovost();
        }
        else{
            this._rec  = val;
        }
           
    }  
    
    get detail() : PersRizikovost {
        return this._rec;
    }  

    saveme() {
        this.serv.updatePersRizikovost(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.rizikovostChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }
    

    edit(id:number){
        this.serv.getPersRizikovost(id).then((j: PersRizikovost) => this._rec = j);
    }
    

    dropme(){        
        this.serv.dropPersRizikovost(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getPersRizikovost(-1).then((j: PersRizikovost) => this._rec = j).then(()=>this.rizikovostChanged.emit(this));            
            }  
        });            
    }


    cinnostChanged(chk:any, cinid: number) {

        
        if(chk.checked == true){
            this._rec.cinnost.push(cinid);
        }
        else{
            const index = this._rec.cinnost.indexOf(cinid);
            if (index > -1) {
                this._rec.cinnost.splice(index, 1);
            }
        }
    }
    
}