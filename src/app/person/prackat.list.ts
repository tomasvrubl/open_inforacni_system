import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersPracKategorieDetail } from './prackat.detail';
import { PersonService } from './_services/person.service';
import { Table, BaseListComponent} from '../core/module';


@Component({
  selector: 'pers-prackat-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PersPracKategorieDetail],
  providers : [  ]
})

export class PersPracKategoireList extends BaseListComponent { 

    getComponentName(): string {
        return "PersPracKategoireList";
    } 

    constructor(private serv: PersonService,  protected router: Router) {
    
        super(router, PersPracKategorieDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Kód', clmn: 'kod', fulltext: true },
            { label: 'Název', clmn: 'nazev', fulltext: true },            
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/pers/prackat/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropPracovniKategorie(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.serv.getPracovniKategorieTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
  
    
   
}