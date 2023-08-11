import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { PersCinnostDetail } from './cinnost.detail';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Table, BaseListComponent} from '../core/module';


@Component({
  selector: 'pers-cinnost-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PersCinnostDetail],
  providers : [  ]
})

export class PersCinnostList extends BaseListComponent { 

    getComponentName(): string {
        return "PersCinnostList";
    } 

    constructor(private serv: ProhlidkyService,  protected router: Router) {
    
        super(router, PersCinnostDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Činnost', clmn: 'nazev' },
            { label: 'Lhůta rok', clmn: 'lhuta' },
            { label: 'Ze zák.', clmn: 'zakon_riziko' },
            { label: 'Ze zák. sk.', clmn: 'zakon_skupina' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },            
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/prohlidky/cinnost/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropPracCinnost(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.serv.getPracCinnostTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
  
    
   
}