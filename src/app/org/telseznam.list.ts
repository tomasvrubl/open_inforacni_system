import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TelseznamDetail } from './telseznam.detail';
import { OrganizaceService } from './_services/organizace.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';



@Component({
  selector: 'org-telefonni-seznam-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [TelseznamDetail],
  providers : [  ]
})

export class TelseznamList extends BaseListComponent { 

    getComponentName(): string {
        return "TelseznamList";
    } 

    constructor(private serv: OrganizaceService,  protected router: Router) {
    
        super(router, TelseznamDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Typ zaznamu', clmn: 'typ', hidden: true, type: TabColumn.TYPE_INT},
            { label: 'Název', clmn: 'nazev', fulltext:true},
            { label: 'Mobil', clmn: 'mobil', fulltext:true },
            { label: 'Telefón', clmn: 'telefon', fulltext:true },
            { label: 'E-mail', clmn: 'email', fulltext:true },
            { label: 'Datum narození', clmn: 'narozeni', type: TabColumn.TYPE_DATE },
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    

    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/org/telseznam/'+ el.typ+'/'+el.id);            
    } 
   
    onDrop(el:any){

        if(el.typ == 1){
            alert('Záznam je pouze ke čtení! Je načten z personalistiky.')
        }
        else{
            this.serv.dropKontakt(el).then(response => {
                this.response = response;
                this.reloadData(this.tab);       
            });
        }


        
    }
    
    reloadData(table: Table){
       this.serv.getTelefonniSeznamTable(table.getQuery()).then(data => {
            this.asyncSetTab(data);
       }); 
    }
  
    
   
}