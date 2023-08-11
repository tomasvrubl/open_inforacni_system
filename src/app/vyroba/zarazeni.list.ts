import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Table, BaseListComponent} from '../core/module';
import { VyrZarazeniDetail } from './zarazeni.detail';
import { VyrobaService } from './_services/vyroba.service';


@Component({
    selector: 'vyr-zarazeni-list',
    templateUrl : '../core/_gui/baselist/view.html',
    viewProviders: [VyrZarazeniDetail],
    providers : [  ]
  })
  

export class VyrZarazeniList extends BaseListComponent {
    
  
    getComponentName(): string {
        return "VyrZarazeniList";
    } 

    constructor(private serv: VyrobaService,  protected router: Router) {
    
        super(router, VyrZarazeniDetail, serv);

        this.tab.header = [
            { label: 'Kód', clmn: 'kod', fulltext: true },
            { label: 'Název', clmn: 'nazev', fulltext: true },
            { label: 'Středisko kód', clmn: 'pracoviste_kod', fulltext: true },
            { label: 'Středisko', clmn: 'pracoviste', fulltext: true },
            { label: 'Platnost', clmn: 'platnost', type: 2, enum: [ { val: true,  lbl: 'Ano'}, { val: false,  lbl: 'Ne'} ]},
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {    
        super.editRecord(el.id, iswnd, '/vyroba/zarazeni/'+ el.id);              
    } 
   
    onDrop(el:any){
        this.serv.dropZarazeni(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){
       this.serv.getZarazeniTable(table.getQuery()).then((data: any) => { 
       var p;
       
       for (let i = 0; i < data.list.length; ++i){      
            p = data.list[i];
            if(p.platnost == true){
                p.platnost = { val: 'Ano', class: '' };  
            }
            else if(p.platnost == false){
                p.platnost = { val: 'Ne', class: '' };  
                p.trclass = "neplatny"; //nastvuji barvu na cely radek
            }
           
        }

        this.asyncSetTab(data);

       }); 
    }

   
}