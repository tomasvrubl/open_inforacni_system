import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OsobaDetailComponent } from './osoba.detail';
import { PersonService } from './_services/person.service';
import { Table, BaseListComponent, TabFilter, TableQuery} from '../core/module';


@Component({
    selector: 'osoba-list',
    templateUrl : '../core/_gui/baselist/view.html',
    viewProviders: [OsobaDetailComponent],
    providers : [  ]
  })
  

export class OsobaListComponent extends BaseListComponent { 


    getComponentName(): string {
        return "OsobaList";
    } 

    constructor(private serv: PersonService,  protected router: Router) {
    
        super(router, OsobaDetailComponent, serv);

        this.tab.header = [
            { label: 'Osobní číslo', clmn: 'oscislo', fulltext:true },
            { label: 'Příjmení', clmn: 'prijmeni', fulltext: true },
            { label: 'Jméno', clmn: 'jmeno', fulltext: true },
            { label: 'Kód čipu', clmn: 'cip', fulltext: true },
            { label: 'Kód stř.', clmn: 'pracoviste_kod' },
            { label: 'Středisko', clmn: 'pracoviste' },
            { label: 'Věk', clmn: 'vek' },
            { label: 'Zařazení', clmn: 'pracovni_zarazeni' },
            { label: 'Prac. pozice', clmn: 'pracovni_rizikovost' },
            { label: 'ZP', clmn: 'zdravotni_pojistovna' },
            { label: 'Platnost', clmn: 'platnost', type: 2, enum: [ { val: true,  lbl: 'Ano'}, { val: false,  lbl: 'Ne'} ]},
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    onEdit(el:any, iswnd:boolean) {    
        super.editRecord(el.id, iswnd, '/pers/osoba/'+ el.id);              
    } 
   
    onDrop(el:any){
        this.serv.dropOsoba(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    
    reloadData(table: Table){
       this.serv.getOsobaTable(table.getQuery()).then((data: any) => { 
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