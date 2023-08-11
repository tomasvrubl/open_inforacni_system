import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JednotkyDetail } from './jednotky.detail';
import { CiselnikService } from './_services/ciselnik.service';
import { Table, BaseListComponent} from '../core/module';


@Component({
    selector: 'jednotka-list',
    templateUrl : '../core/_gui/baselist/view.html',
    viewProviders: [JednotkyDetail],
    providers : [  ]
  })
  


export class JednotkyList extends BaseListComponent {
    
    getComponentName(): string {
        return "JednotkyList";
    } 


    constructor(private ciselnikService: CiselnikService,  protected router: Router) {
    
        super(router, JednotkyDetail, ciselnikService);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod', fulltext:true },
            { label: 'Název', clmn: 'nazev', fulltext:true },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/ciselnik/jednotky/'+ el.id);    
    } 
   
    onDrop(el:any){
        this.ciselnikService.dropJednotka(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    


    reloadData(table: Table){
       this.ciselnikService.getJednotkaTable(table.getQuery()).then(response => {
        this.asyncSetTab(response);
       }); 
    }
      
}