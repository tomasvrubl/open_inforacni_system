import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TavirnaService } from './_services/tavirna.service';
import { Table, BaseListComponent} from '../core/module';
import { LabVzorekDetail } from './vzorek.detail';


@Component({
  selector: 'lab-vzorek-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ LabVzorekDetail ]
})

export class LabVzorekList extends BaseListComponent  { 

    getComponentName(): string {
        return "LabVzorekList";
    } 

    constructor(private serv: TavirnaService,  protected router: Router) {
        super(router, LabVzorekDetail, serv);

        this.tab.header = [
            { label: 'ID', clmn: 'id', hidden:true },
            { label: 'Datum', clmn: 'datum', type: 3 },
            { label: 'Číslo tavby', clmn: 'cislo_tavby', fulltext:true },
            { label: 'Pořadí', clmn: 'poradi' },
            { label: 'Buben', clmn: 'buben' },
            { label: 'Platnost', clmn: 'platnost', type: 2},
            { label: 'Tvárná', clmn: 'istvarna', type: 2},
            { label: 'C', clmn: 'lab_c' },
            { label: 'Si', clmn: 'lab_si' },
            { label: 'Mn', clmn: 'lab_mn' },
            { label: 'P', clmn: 'lab_p' },
            { label: 'Cr', clmn: 'lab_cr' },
            { label: 'Ni', clmn: 'lab_ni' },
            { label: 'Cu', clmn: 'lab_cu' },
            { label: 'Al', clmn: 'lab_al' },
            { label: 'Mg', clmn: 'lab_mg' },
            { label: 'S', clmn: 'lab_s' },
            { label: 'Zbyt. Mg', clmn: 'lab_zbyt_mg' },
            { label: 'Laborant', clmn: 'laborant' },
            { label: 'Norma', clmn: 'norma' },
            { label: 'Materiál', clmn: 'material' },
            { label: 'Eutekt.', clmn: 'eutekt_sc' },            
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {        
        super.editRecord(el.id, iswnd, '/laborator/vzorek/'+ el.id);       
    } 

    onDrop(el:any){
        this.serv.dropLabVzorek(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){
       this.serv.getLabVzorekTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      
  
   
}