import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TavirnaService } from './_services/tavirna.service';
import { Table, BaseListComponent} from '../core/module';
import { JakostDetail } from './jakost.detail';


@Component({
  selector: 'tav-jakost-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ JakostDetail ]
})

export class JakostList extends BaseListComponent  { 

    getComponentName(): string {
        return "JakostList";
    } 

    constructor(private serv: TavirnaService,  protected router: Router) {
        super(router, JakostDetail, serv);

        this.tab.header = [
            { label: 'ID', clmn: 'id' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Extern. kód', clmn: 'externi_kod' },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {        
        super.editRecord(el.id, iswnd, '/tavirna/jakost/'+ el.id);       
    } 

    onDrop(el:any){
        this.serv.dropJakost(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){
       this.serv.getJakostTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      
  
   
}