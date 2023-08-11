import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Table, BaseListComponent, TabColumn} from '../core/module';
import { VyrobaService } from './_services/vyroba.service';
import { VyrZapisSmenyDetail } from './zapis-smeny.detail';


@Component({
    selector: 'vyr-zapis-smeny-list',
    templateUrl : '../core/_gui/baselist/view.html',
    viewProviders: [VyrZapisSmenyDetail],
    providers : [  ]
  })
  

export class VyrZapisSmenyList extends BaseListComponent {
    
  
    getComponentName(): string {
        return "VyrZapisSmenyList";
    } 

    constructor(private serv: VyrobaService,  protected router: Router) {
    
        super(router, VyrZapisSmenyDetail, serv);

        this.tab.header = [
            { label: 'Datum', clmn: 'datum', fulltext: true, type: TabColumn.TYPE_DATE },
            { label: 'Směna', clmn: 'smena', fulltext: true },            
            { label: 'Zdroj', clmn: 'zdroj', fulltext: true },
            { label: 'Středisko', clmn: 'pracoviste', fulltext: true},
            { label: 'Odvedeno ks', clmn: 'odv_mnozstvi', type: TabColumn.TYPE_NUMBER},
            { label: 'Utrženo ks', clmn: 'utrz_forem', type: TabColumn.TYPE_NUMBER},            
            { label: 'Terminál osoba', clmn: 'termosoba', fulltext: true},
            { label: 'Poznámka', clmn: 'poznamka'},
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {    
        super.editRecord(el.id, iswnd, '/vyroba/zapis-smeny/'+ el.id);              
    } 
   
    onDrop(el:any){
        this.serv.dropZapisSmeny(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){
       this.serv.getZapisSmenyTable(table.getQuery()).then((data: any) => { 
            this.asyncSetTab(data);
       }); 
    }

    
   
}