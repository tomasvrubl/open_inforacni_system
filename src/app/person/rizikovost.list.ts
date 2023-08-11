import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersRizikovostDetail } from './rizikovost.detail';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Table, BaseListComponent, TableQuery, TabFilter} from '../core/module';


@Component({
  selector: 'pers-rizikovost-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PersRizikovostDetail],
  providers : [  ]
})

export class PersRizikovostList extends BaseListComponent { 

    getComponentName(): string {
        return "PersRizikovostList";
    } 

    constructor(private serv: ProhlidkyService,  protected router: Router) {
            
        super(router, PersRizikovostDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Kód', clmn: 'kod', fulltext: true },
            { label: 'Druh práce', clmn: 'druh_prace', fulltext:true },
            { label: 'Režim práce', clmn: 'rezim_prace', fulltext: true },
            { label: 'Skupina', clmn: 'skupina_nazev', fulltext: true },
            { label: 'Hluk', clmn: 'hluk' },
            { label: 'Prach', clmn: 'prach' },
            { label: 'Vibrace', clmn: 'vibrace' },
            { label: 'Fyz. záťež', clmn: 'fyzicka_zatez' },
            { label: 'Teplo záťež', clmn: 'zatez_teplem' },
            { label: 'Prac. poloha', clmn: 'pracovni_poloha' },
            { label: 'Zrak zátěž', clmn: 'zrakova_zatez' },
            { label: 'Chem. látky', clmn: 'chemicke_latky_smesi' },
            { label: 'Neion. záření', clmn: 'neionizujici_zareni' },
            { label: 'Chlad zátěž', clmn: 'zatez_chladem' },
            { label: 'Psych. zátěž', clmn: 'psychicka_zatez' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/prohlidky/rizikovost/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropPersRizikovost(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.serv.getPersRizikovostTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
  
    

   
}