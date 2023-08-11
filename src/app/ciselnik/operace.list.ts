import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OperaceDetailComponent } from './operace.detail';
import { CiselnikService } from './_services/ciselnik.service';
import { Table, BaseListComponent} from '../core/module';


@Component({
  selector: 'operace-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [OperaceDetailComponent],
  providers : [  ]
})

export class OperaceListComponent extends BaseListComponent { 

    getComponentName(): string {
        return "OperaceList";
    } 

    constructor(private ciselnikService: CiselnikService,  protected router: Router) {
    
        super(router, OperaceDetailComponent, ciselnikService);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Název', clmn: 'nazev', fulltext: true },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/ciselnik/operace/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.ciselnikService.dropOperace(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.ciselnikService.getOperaceTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
  
    
   
}