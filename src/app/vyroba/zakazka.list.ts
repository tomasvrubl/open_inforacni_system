import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VyrobaService } from './_services/vyroba.service';
import { Table, BaseListComponent} from '../core/module';
import { ZakazkaDetail } from './zakazka.detail';


@Component({
  selector: 'zakazka-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [ZakazkaDetail],
  providers : [  ]
})

export class ZakazkaList extends BaseListComponent { 

    getComponentName(): string {
        return "ZakazkaList";
    } 

    constructor(private vyrService: VyrobaService,  protected router: Router) {
    
        super(router, ZakazkaDetail, vyrService);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Výrobek', clmn: 'tp_vyrobek' },
            { label: 'Název', clmn: 'nazev' },            
            { label: 'Začátek', clmn: 'datum_od' },
            { label: 'Ukončení', clmn: 'datum_do' },
            { label: 'Plán ks', clmn: 'plan_ks' },
            { label: 'Odvedeno ks', clmn: 'odvedeno_ks' },
            { label: 'Zbývá ks', clmn: 'zbyva_ks' },
            { label: 'Extérní kód', clmn: 'extern_kod' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    
    }


    onEdit(el:any, iswnd:boolean) {          
        super.editRecord(el.id, iswnd, '/vyroba/zakazka/'+ el.id);
    } 
   
    onDrop(el:any){
        
        this.vyrService.dropZakazka(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){       
       this.vyrService.getZakazkaTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
  

}