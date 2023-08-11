import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PracovisteDetailComponent } from './pracoviste.detail';
import { CiselnikService } from './_services/ciselnik.service';
import { Table, BaseListComponent, TableQuery, TabFilter} from '../core/module';


@Component({
  selector: 'pracoviste-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PracovisteDetailComponent],
  providers : [  ]
})
    


export class PracovisteListComponent extends BaseListComponent {

    getComponentName(): string {
        return "PracovisteList";
    } 

    constructor(private ciselnikService: CiselnikService,  protected router: Router) {
    
        super(router, PracovisteDetailComponent, ciselnikService);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod', fulltext: true },
            { label: 'Název', clmn: 'nazev', fulltext: true },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Vytvářet plán', clmn: 'planovat', type: 2 },
            { label: 'Kalendář', clmn: 'kalendar' },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    
    }

    onEdit(el:any, iswnd:boolean) {          
        super.editRecord(el.id, iswnd, '/ciselnik/pracoviste/'+ el.id);
    } 
   
    onDrop(el:any){        
        this.ciselnikService.dropPracoviste(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){       
       this.ciselnikService.getPracovisteTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      

}