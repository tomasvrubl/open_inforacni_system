import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TavirnaService } from './_services/tavirna.service';
import { Table, BaseListComponent} from '../core/module';
import { PecDetail } from './pec.detail';


@Component({
  selector: 'tav-pec-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ PecDetail ]
})

export class PecList extends BaseListComponent  { 

    getComponentName(): string {
        return "PecList";
    } 

    constructor(private serv: TavirnaService,  protected router: Router) {
        super(router, PecDetail, serv);

        this.tab.header = [
            { label: 'ID', clmn: 'id' },
            { label: 'Název', clmn: 'nazev', fulltext:true },
            { label: 'Kód', clmn: 'kod', fulltext:true },
            { label: 'Pec číslo', clmn: 'pec', fulltext:true },
            { label: 'Rok', clmn: 'rok' },
            { label: 'Kampaň', clmn: 'pec' },
            { label: 'Tavba', clmn: 'tavba' },
            { label: 'Zdroj', clmn: 'zdroj'},
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {        
        super.editRecord(el.id, iswnd, '/tavirna/pec/'+ el.id);       
    } 

    onDrop(el:any){
        this.serv.dropPec(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){
       this.serv.getPecTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      
  
   
}