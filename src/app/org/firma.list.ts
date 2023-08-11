import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirmaDetail } from './firma.detail';
import { OrganizaceService } from './_services/organizace.service';
import { Table, BaseListComponent, TableQuery, TabFilter} from '../core/module';


@Component({
  selector: 'firma-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [FirmaDetail],
  providers : [  ]
})

export class FirmaList extends BaseListComponent { 

    getComponentName(): string {
        return "FirmaList";
    } 

    constructor(private serv: OrganizaceService,  protected router: Router) {
    
        super(router, FirmaDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Název', clmn: 'nazev', fulltext:true },
            { label: 'IČO', clmn: 'ico', fulltext:true},
            { label: 'DIČ', clmn: 'dic'},
            { label: 'Ulice', clmn: 'ulice', fulltext:true },
            { label: 'Obec', clmn: 'obec', fulltext:true },
            { label: 'PSČ', clmn: 'psc' },
            { label: 'Telefon', clmn: 'telefon' },
            { label: 'E-mail', clmn: 'email', fulltext:true },
            { label: 'WWW', clmn: 'www' },
            { label: 'Adresa', clmn: 'adresa', hidden: true},
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }

        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/org/firma/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropFirma(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.serv.getFirmaTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
  
    autocomplete(ev:string){

        var q = new TableQuery();
        if(ev){
            q.clmn.push({clmn: 'nazev', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'ico', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'ulice', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'obec', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.clmn.push({clmn: 'telefon', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.q_join = TableQuery.JOIN_OR;
        }        

        this._filter = q;
        this.tab.setFilter(this._filter);
        this.reloadData(this.tab);
    }
    
   
}