import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VyrobaService } from './_services/vyroba.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';


@Component({
  selector: 'vyr-osoba-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [],
  providers : [  ]
})
    


export class VyrOsobaList extends BaseListComponent {

    getComponentName(): string {
        return "VyrOsobaList";
    } 

    constructor(private srv: VyrobaService,  protected router: Router) {
    
        super(router, null, srv);

        this.isEditButton = false;
        this.isDropButton = false;

        this.tab.header = [
            { label: 'ID', clmn: 'id', hidden: true},
            { label: 'Os. číslo', clmn: 'oscislo', fulltext:true },
            { label: 'Příjmení', clmn: 'prijmeni', sort: TabColumn.SORT_ASC, fulltext:true },
            { label: 'Jméno', clmn: 'jmeno', sort: TabColumn.SORT_ASC , fulltext:true },
            { label: 'Pracoviště', clmn: 'pracoviste', fulltext:true },
            { label: 'Pracoviště kód', clmn: 'pracoviste_kod', fulltext:true },
            { label: 'Pracoviště ID', clmn: 'cis_pracoviste_id', hidden: true}
        ];    
    }


    
    reloadData(table: Table){       
       this.srv.getVyrOsobaTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
}