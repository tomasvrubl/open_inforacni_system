import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersSkupinaDetail } from './skupina.detail';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Table, BaseListComponent} from '../core/module';


@Component({
  selector: 'pers-skupina-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PersSkupinaDetail],
  providers : [  ]
})

export class PersSkupinaList extends BaseListComponent { 

    getComponentName(): string {
        return "PersSkupinaList";
    } 

    constructor(private serv: ProhlidkyService,  protected router: Router) {
    
        super(router, PersSkupinaDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/prohlidky/skupina/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropPersSkupina(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.serv.getPersSkupinaTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
  
    
   
}