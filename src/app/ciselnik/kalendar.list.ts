import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CiselnikService } from './_services/ciselnik.service';
import { Table, BaseListComponent, TableQuery, TabFilter} from '../core/module';
import { KalendarDetail } from './kalendar.detail';

@Component({
  selector: 'kalendar-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ KalendarDetail ]
})

export class KalendarList extends BaseListComponent   { 

    getComponentName(): string {
        return "KalendarList";
    } 
 
    constructor(private ciselnikService: CiselnikService,  protected router: Router) {

        super(router, KalendarDetail, ciselnikService);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Od', clmn: 'platnost_od', type: 3 },
            { label: 'Od', clmn: 'platnost_do', type: 3 },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }

  
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/ciselnik/kalendar/'+ el.id);
    } 

    onDrop(el:any){
        this.ciselnikService.dropKalendar(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.ciselnikService.getKalendarTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
    
}