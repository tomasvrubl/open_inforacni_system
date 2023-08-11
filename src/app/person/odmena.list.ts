import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from './_services/person.service';
import { OdmenaDetail } from './odmena.detail';
import { Table, BaseListComponent, TabColumn} from '../core/module';



@Component({
  selector: 'pers-odmena-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ OdmenaDetail ]
})

export class OdmenaList extends BaseListComponent { 


    getComponentName(): string {
        return "OdmenaList";
    } 

    constructor(private srv: PersonService,  protected router: Router) {
        super(router, OdmenaDetail, srv);

        this.tab.header = [
            { label: 'ID', clmn: 'id' },
            { label: 'Datum', clmn: 'datum', type: TabColumn.TYPE_DATETIME },
            { label: 'Os. číslo', clmn: 'osoba_oscislo' },
            { label: 'Osoba', clmn: 'osoba' },
            { label: 'Částka', clmn: 'castka' },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Vyplaceno', clmn: 'vyplaceno', type: TabColumn.TYPE_DATETIME },
            { label: 'Vyplatil', clmn: 'vyplatil'},
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    
    }
    
    onEdit(el:any, iswnd:boolean) {        
        super.editRecord(el.id, iswnd, '/pers/odmena/'+ el.id);       
    } 
   
    onDrop(el:any){
        this.srv.dropOdmena(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){
       this.srv.getOdmenyTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    } 
   
}