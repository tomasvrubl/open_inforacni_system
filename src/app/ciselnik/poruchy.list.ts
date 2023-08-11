import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JednotkyDetail } from './jednotky.detail';
import { CiselnikService } from './_services/ciselnik.service';
import { Table, BaseListComponent} from '../core/module';
import { PoruchyDetail } from './poruchy.detail';


@Component({
    selector: 'porucha-list',
    templateUrl : '../core/_gui/baselist/view.html',
    viewProviders: [PoruchyDetail],
    providers : [  ]
  })
  


export class PoruchyList extends BaseListComponent {
    
    getComponentName(): string {
        return "PoruchyList";
    } 


    constructor(private srv: CiselnikService,  protected router: Router) {
    
        super(router, PoruchyDetail, srv);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod', fulltext:true },
            { label: 'Název', clmn: 'nazev', fulltext:true },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/ciselnik/poruchy/'+ el.id);    
    } 
   
    onDrop(el:any){
        this.srv.dropPorucha(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    


    reloadData(table: Table){
       this.srv.getPoruchaTable(table.getQuery()).then(response => {
        this.asyncSetTab(response);
       }); 
    }
      
}