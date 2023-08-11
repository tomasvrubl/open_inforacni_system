import { Component } from '@angular/core';
import { CiselnikService } from './_services/ciselnik.service';
import { DetailComponent, Response, Table } from '../core/module';
import { Porucha } from './module';

@Component({
  selector: 'porucha-detail',
  templateUrl : './_view/poruchy.detail.html',
  providers: [ ]
})

export class PoruchyDetail extends DetailComponent { 

    tabZdroj: Table = new Table();

    showSelectZdroj:boolean = false;
    
    constructor(private srv: CiselnikService) {     
        super();         

        this.tabZdroj.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Výrobní kalendář', clmn: 'kalendar' },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    
    }
    
    ngOnInit(): void { 
        this.reloadDataZdroj(null);
   }        

    
    saveme() {
        this.srv.updatePorucha(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }
    
    edit(id:number){
        
        this.srv.getPorucha(id).then((j: Porucha) => {
            this._rec = j;
            this.detailChanged.emit(this);
            this.listZdroj();
        });


    }
    
    dropme(){        
        this.srv.dropPorucha(this._rec).then((response :Response) =>  {
            this.response = response;

           if (response.kod == 0){
               this.srv.getPorucha(-1).then((j: Porucha) => this._rec = j).then(()=>this.detailChanged.emit(this));            
           }  
       });           
    }



    /*** zdroj vazba */

    listZdroj(){
        this.reloadDataZdroj(null);         
    }
    
    onSelectedZdrojList(ev:any){
        
        this.srv.linkPoruchaZdroj(this._rec, ev).then((response: Response) => {
            this.response = response;
            this.reloadDataZdroj(null);
        });
        
        
        this.showSelectZdroj = false;
    }   
    
    unlinkZdroj(ev:any){
        this.srv.unlinkPoruchaZdroj(ev.id).then((response: Response) => {
            this.response = response;
            this.reloadDataZdroj(null);
        });
    }
    
    reloadDataZdroj(ev:any){

        if(this._rec.id  < 1)
            return;
       
       var query = this.tabZdroj.getQuery();
       query.clmn.push({clmn: 'porucha_id', type: 1, filter: [{operator: 0, value: this.detail.id}]});
              
       this.srv.getPoruchaZdrojTable(query).then(response =>{
            this.tabZdroj.data = response;
       }).then(()=>query.clmn.splice(-1,1));  
    }
    
}