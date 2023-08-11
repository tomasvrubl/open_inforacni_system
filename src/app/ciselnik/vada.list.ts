
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CiselnikService } from './_services/ciselnik.service';
import { Table,BaseListComponent} from '../core/module';
import { VadaDetail } from './vada.detail';


@Component({
  selector: 'vada-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ VadaDetail ]
})

export class VadaList extends BaseListComponent { 

    getComponentName(): string {
        return "VadaList";
    } 

    constructor(private ciselnikService: CiselnikService,  protected router: Router) {
    
        super(router, VadaDetail, ciselnikService);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod', fulltext:true},
            { label: 'Název', clmn: 'nazev', fulltext:true},
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
   

    onEdit(el:any, iswnd:boolean) {                       
        super.editRecord(el.id, iswnd, '/ciselnik/vada/'+ el.id);
    } 
   
    onDrop(el:any){
        this.ciselnikService.dropVada(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){       
       this.ciselnikService.getVadaTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
     
    
   
}