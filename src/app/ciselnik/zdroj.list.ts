import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CiselnikService } from './_services/ciselnik.service';
import { Table, BaseListComponent, TableQuery, TabFilter} from '../core/module';
import { ZdrojDetailComponent } from './zdroj.detail';


@Component({
  selector: 'zdroj-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ ZdrojDetailComponent ]
})

export class ZdrojListComponent extends BaseListComponent { 

    getComponentName(): string {
        return "ZdrojList";
    } 

    constructor(private ciselnikService: CiselnikService,  protected router: Router) {

        super(router, ZdrojDetailComponent, ciselnikService);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod', fulltext: true },
            { label: 'Název', clmn: 'nazev', fulltext: true },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Středisko', clmn: 'pracoviste' },
            { label: 'Výrobní kalendář', clmn: 'kalendar' },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    

    }
    
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/ciselnik/zdroj/'+ el.id);
    } 
   
    onDrop(el:any){
        this.ciselnikService.dropZdroj(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){       
       this.ciselnikService.getZdrojTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }

    
}