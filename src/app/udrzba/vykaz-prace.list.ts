import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UdrzbaService } from './_services/udrzba.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';
import { VykazPraceDetail } from './vykaz-prace.detail';



@Component({
    selector: 'vykaz-prace-list',
    templateUrl : '../core/_gui/baselist/view.html',
    viewProviders: [VykazPraceDetail],
    providers : [  ]
  })
  


export class VykazPraceList extends BaseListComponent {
    
    getComponentName(): string {
        return "VykazPraceList";
    } 


    constructor(private srv: UdrzbaService,  protected router: Router) {
    
        super(router, VykazPraceDetail, srv);

        this.tab.header = [            
            { label: 'Datum', clmn: 'datum', type: TabColumn.TYPE_DATE },
            { label: 'Od', clmn: 'od', type: TabColumn.TYPE_TIME },
            { label: 'Do', clmn: 'do', type: TabColumn.TYPE_TIME },
            { label: 'Porucha', clmn: 'porucha', fulltext: true},            
            { label: 'Zdroj', clmn: 'zdroj', fulltext:true },            
            { label: 'Osoba', clmn: 'osoba', fulltext:true },
            { label: 'Poznámka', clmn: 'poznamka', fulltext:true },
            { label: 'Vytvořeno', clmn: 'vytvoreno', type: TabColumn.TYPE_DATETIME },
            { label: 'Vytvořil', clmn: 'vytvoril' },
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }            
        ];
        
        this.isDropButton = this.srv.isAdmin();
    }

    
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/udrzba/vykaz-prace/'+ el.id);    
    } 
   
    onDrop(el:any){
        this.srv.dropVykazPrace(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }

      
}