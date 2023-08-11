import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VyrobaService } from './_services/vyroba.service';
import { TableQuery, Table, BaseListComponent, TabFilter} from '../core/module';
import { OdvadeniDetail } from './odvadeni.detail';


@Component({
  selector: 'odvadeni-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [OdvadeniDetail],
  providers : [  ]
})

export class OdvadeniList extends BaseListComponent { 


    getComponentName(): string {
        return "OdvadeniList";
    } 

    constructor(private odvService: VyrobaService,  protected router: Router) {
    
        super(router, OdvadeniDetail, odvService);

        this.tab.header = [
            { label: 'Datum', clmn: 'datum' },
            { label: 'Osoba', clmn: 'osoba' },
            { label: 'Zakazka', clmn: 'zakazka_id' },            
            { label: 'Výrobek', clmn: 'zakazka_vyrobek' },            
            { label: 'Odvedeno ks', clmn: 'shodne_ks' },
            { label: 'Zmetky ks', clmn: 'neshodne_ks' },
            { label: 'Vada', clmn: 'vada_kod' },
            { label: 'Zdroj', clmn: 'zdroj' },
            { label: 'Pracoviste', clmn: 'pracoviste' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    
    }


    onEdit(el:any, iswnd:boolean) {          
        super.editRecord(el.id, iswnd, '/vyroba/odvadeni/'+ el.id);
    } 
   
    onDrop(el:any){
        
        this.odvService.dropOdvadeni(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){       
        this.odvService.getOdvadeniTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      

    autocomplete(ev:string){

        var q = new TableQuery();
        if(ev){
            q.clmn.push({clmn: 'kod', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'nazev', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'tp_vyrobek', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});            
            q.q_join = TableQuery.JOIN_OR;
        }        

        this._filter = q;
        this.tab.setFilter(this._filter);
        this.reloadData(this.tab);
    }
    
}