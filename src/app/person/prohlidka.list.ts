import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersZdravProhlidkaDetail } from './prohlidka.detail';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';


@Component({
  selector: 'pers-zdrav-prohlidka-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PersZdravProhlidkaDetail],
  providers : [  ]
})

export class PersZdravProhlidkaList extends BaseListComponent { 

    getComponentName(): string {
        return "PersZdravProhlidkaList";
    } 

    constructor(private serv: ProhlidkyService,  protected router: Router) {
    
        super(router, PersZdravProhlidkaDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Osoba ID', clmn: 'osoba_id', hidden: true, type: TabColumn.TYPE_INT },
            { label: 'Osoba', clmn: 'osoba_osoba', fulltext: true },
            { label: 'Os. číslo', clmn: 'osoba_oscislo', fulltext: true },
            { label: 'Věk', clmn: 'vek' },
            { label: 'Žádost vystavena', clmn: 'zadost_vystavena', type: TabColumn.TYPE_DATE },
            { label: 'Žádost předána', clmn: 'zadanky_predany', type: TabColumn.TYPE_DATE },
            { label: 'Datum prohlídky', clmn: 'datum_prohlidky', type: TabColumn.TYPE_DATE },
            { label: 'Platnost', clmn: 'platnost_prohlidky', type: TabColumn.TYPE_DATE },            
            { label: 'Typ prohlídky', clmn: 'typ', type: 6, enum: [ { val: 0,  lbl: 'Vstupní'}, { val: 1,  lbl: 'Periodická'},{ val: 2,  lbl: 'Mimořádná'}] },
            { label: 'Generováno', clmn: 'generovano',  type: 2, enum: [ { val: true,  lbl: 'Ano'}, { val: false,  lbl: 'Ne'}] },
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
    getCustomButtons() : any[] {
        var t = this;        

        return [{icon: 'fa fa-gear', title: 'Vytvoř prohlídku', tocall: function(idx) {
            
                var rec = t.tab.data.list[idx];
            
                t.serv.genVytvorProhlidky([rec]).then(response  => {

                    t.response = response;
                    t.reloadData(t.tab);
                });

            }},
        
            {icon: 'fa fa-person', title: 'Detail osoby', tocall: function(idx) {
            
                var rec = t.tab.data.list[idx];
                const url = t.router.serializeUrl( t.router.createUrlTree(['/pers/osoba/'+rec.osoba_id]));
                window.open(url, '_blank');
                
            }},

        ];
   }


    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/prohlidky/id/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropPersProhlidka(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.serv.getPersProhlidkaTable(table.getQuery()).then(data => {

            
            var p;

            for (let i = 0; i < data.list.length; ++i){

                p = data.list[i];                
                if(p.typ == 0) {
                    p.typ = { val: 'Vstupní', class: '' };  
                }
                else if(p.typ == 1) {
                    p.typ = { val: 'Periodická', class: '' };  
                }
                else if(p.typ == 2) {
                    p.typ = { val: 'Mimořádná', class: '' };  
                }

                if(p.generovano == true){
                    p.trclass = "generated";
                 }

            }

            this.asyncSetTab(data);
       }); 
    }
  
    
   
}