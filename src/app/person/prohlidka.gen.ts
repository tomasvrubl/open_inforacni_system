import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PersZdravProhlidkaDetail } from './prohlidka.detail';
import { Response, Table, TabColumn, SecurityUserParams, TableComponent } from '../core/module';
import { ProhlidkyService } from './_services/prohlidky.service';

@Component({
    selector: 'pers-gen-prohlidky',
    templateUrl: './_view/prohlidka.gen.html',
    viewProviders: [],
    providers : [ ]
  })

  
export class PersProhlidkaGenerator implements OnInit { 

    @ViewChild('detail')  detail!: PersZdravProhlidkaDetail; 

    @ViewChild("seznam") seznam!: TableComponent;
    id:string = "";
    tab: Table = new Table();
    response:Response = new Response();

    _selPolozky = [];

    getComponentName(): string {
        return "PersProhlidkaGenerator";
    }

    getCompKey(): string {
        return this.router.url + ':' + this.getComponentName();
    }


    constructor(protected router:Router, protected srv : ProhlidkyService) {         

        this.tab.header = [
            { label: 'Os. číslo.', clmn: 'oscislo', fulltext:true },
            { label: 'Příjmení', clmn: 'prijmeni',fulltext:true },
            { label: 'Jméno', clmn: 'jmeno', fulltext:true },
            { label: 'Datum narození', clmn: 'datum_narozeni', type: TabColumn.TYPE_DATE },
            { label: 'Věk', clmn: 'vek', type: TabColumn.TYPE_INT },            
            { label: 'Žádost vystavena', clmn: 'zadost_vystavena', type: TabColumn.TYPE_DATE },
            { label: 'Datum prohlídky', clmn: 'datum_prohlidky', type: TabColumn.TYPE_DATE },
            { label: 'Platnost prohlídky', clmn: 'platnost_prohlidky', type: TabColumn.TYPE_DATE },
            { label: 'Mimořádná', clmn: 'mimoradna_prohlidka', type: TabColumn.TYPE_DATE },
            { label: 'Platnost končí za dnů', clmn: 'zbyva_dnu', type: TabColumn.TYPE_INT },
            { label: 'Pracoviště', clmn: 'nazev' },
            { label: 'Pracoviště kód', clmn: 'kod_pracoviste' },
            { label: 'Zařazení', clmn: 'prac_zarazeni' },
            { label: 'Kod rizik.', clmn: 'kod' },
            { label: 'Práce', clmn: 'druh_prace' },
            { label: 'Generováno', clmn: 'generovano',  type: 2, enum: [ { val: true,  lbl: 'Ano'}, { val: false,  lbl: 'Ne'}] },
            { label: 'Prohlídka ID', clmn: 'id',  type: TabColumn.TYPE_INT, hidden: true },
            { label: 'Osoba ID', clmn: 'osoba_id', type: TabColumn.TYPE_INT, hidden: true },
        ];


    }

    ngOnInit(): void {      
        this.id = this.router.url + ':' + this.getComponentName();                

        if(this.srv.user){
            var tab = this.srv.user.getSetting(this.id);
            if(tab != null){
                tab.__proto__ = Table.prototype;
                this.tab = tab;
            }
        }

        this.reloadData(this.tab);
    }



   onEdit(el:any, iswnd:boolean) {   
    
        if(el.id == null){
            alert('Osoba nemá vygenerovanou zdravotní prohlídku. Nelze zobrazit záznam prohlídky.');
            return;

        }        

        if(iswnd){

            const url = this.router.serializeUrl(
                this.router.createUrlTree(['/prohlidky/id/'+el.id])
            );

            window.open(url, '_self');
            return;
        }  
        
        this.detail.edit(el.id);
   } 

   getCustomButtons() : any[] {
        var t = this;        

        return [{icon: 'fa fa-gear', title: 'Vytvoř následnou prohlídku', tocall: function(idx) {
            
                var rec = t.tab.data.list[idx];
            
                t.srv.genVytvorProhlidky([rec]).then(response => {

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

   onSaveSetting(ev:Table){

        if(ev == null){ //zrus filter            

            this.srv.removeUserParam(this.id).then((resp : Response) => {
                this.response = resp;
                this.srv.localUserDropSetting(this.id);
            });
        }
        else{ //uloz nastaveni filtru
            var pp = new SecurityUserParams();
            pp.param = this.id;
            pp.data = ev.getAsParam();
        
            this.srv.updateUserParam(pp).then((resp : Response) => {
                this.response = resp;                
                this.srv.localUserUpdateSetting(resp.data);
            });
        }

    }



    reloadData(table: Table){
        this.srv.genNasledneProhlidkyTable(table.getQuery()).then((data: any) => { 
 
            this.tab.data = data;
            var p;
            for (let i = 0; i < data.list.length; ++i){      
                p = data.list[i];
                if(p.zbyva_dnu  < 1){
                    p.zbyva_dnu = { val: p.zbyva_dnu, class: '' };  
                    p.trclass = "warning";
                }
                else if(p.generovano == true){
                    p.trclass = "generated";
                }
                else {
                    p.zbyva_dnu = { val: p.zbyva_dnu, class: '' };  
                }
                
            }
 
        }); 
     }


   generujSeznam() : void {
       
        var lst = this.seznam.getSelected();

        if(lst == null || lst.length < 1){
            alert("Nejprve vyber osoby, pro které se má vygenerovat zdravotní prohlídka.");
            return;
            
        }

        this.srv.genVytvorProhlidky(lst).then((r:Response) => {

            this.response = r;
            this.reloadData(this.tab);
        });

   }

}