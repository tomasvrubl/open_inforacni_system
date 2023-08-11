import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutoDetail } from './auto.detail';
import { CestakService } from './_services/cestak.service';
import { Table, BaseListComponent, TableQuery, TabFilter} from '../core/module';


@Component({
  selector: 'auto-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [AutoDetail ],
  providers : [ ]
})

export class AutoList extends BaseListComponent { 
    
    getComponentName(): string {
        return "CestakAutoList";
    } 


    constructor(private cestakService: CestakService,  protected router: Router) {
    
        super(router, AutoDetail, cestakService);

        this.tab.header = [
            { label: 'id', clmn: 'id' },
            { label: 'Auto', clmn: 'nazev' },            
            { label: 'SPZ', clmn: 'spz' },               
            { label: 'Stav km', clmn: 'stavkm' }, 
            { label: 'Platnost', clmn: 'platnost', type: 2, enum: [ { val: false,  lbl: 'Ne'}, { val: true,  lbl: 'Ano'} ]},                    
            { label: 'Číslo karty', clmn: 'ciskarty' },
            { label: 'VS', clmn: 'vs' },
            { label: 'Naturál', clmn: 'natural', type: 2 },
            { label: 'Diesel', clmn: 'diesel', type:2 },
            { label: 'LPG', clmn: 'lpg', type:2 },
            { label: 'Elektro', clmn: 'kwh', type:2 },
            { label: 'Průměrná sp. L', clmn: 'prum_spotreba' },
            { label: 'Nádrž L', clmn: 'nadrz_l' },            
            { label: 'Průměrná sp. kWh', clmn: 'kwh_spotreba' },
            { label: 'Kapacita kWh', clmn: 'kwh_baterie' },
            { label: 'Osoba', clmn: 'osoba' },            
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }

    
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/cestak/auto/'+ el.id);    
    } 
    
    onDrop(el:any){
        this.cestakService.dropAuto(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }

    reloadData(table: Table){
        this.cestakService.getAutoTable(table.getQuery()).then((data:any) => {

            var p;
            for (let i = 0; i < data.list.length; ++i){      
                p = data.list[i];
                if(p.platnost == 0){
                    p.platnost = { val: 'Ne', class: 'neplatny' };  
                    p.trclass = 'neplatny';
                }
                else {
                    p.platnost = { val: 'Ano', class: '' };  
                }                
            }

            this.asyncSetTab(data);

        }); 
    }
    



    autocomplete(ev:string){

        var q = new TableQuery();
        if(ev){
            q.clmn.push({clmn: 'spz', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'nazev', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'ciskarty', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.q_join = TableQuery.JOIN_OR;
        }        

        this._filter = q;
        this.tab.setFilter(this._filter);
        this.reloadData(this.tab);
    }
   
}