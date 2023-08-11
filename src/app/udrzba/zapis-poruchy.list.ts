import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UdrzbaService } from './_services/udrzba.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';
import { ZapisPoruchyDetail } from './zapis-poruchy.detail';


@Component({
    selector: 'zapis-poruchy-list',
    templateUrl : '../core/_gui/baselist/view.html',
    viewProviders: [ZapisPoruchyDetail],
    providers : [  ]
  })
  


export class ZapisPoruchyList extends BaseListComponent {
    
    getComponentName(): string {
        return "ZapisPoruchyList";
    } 


    constructor(private srv: UdrzbaService,  protected router: Router) {
    
        super(router, ZapisPoruchyDetail, srv);

        this.tab.header = [            
            { label: 'Datum', clmn: 'datum', type: TabColumn.TYPE_DATE },
            { label: 'Od', clmn: 'od', type: TabColumn.TYPE_TIME },
            { label: 'Do', clmn: 'do', type: TabColumn.TYPE_TIME },
            { label: 'Porucha', clmn: 'porucha', fulltext: true},            
            { label: 'Zdroj', clmn: 'zdroj', fulltext: true },
            { label: 'Poznámka', clmn: 'poznamka', fulltext: true },
            { label: 'Vytvořeno', clmn: 'vytvoreno', type: TabColumn.TYPE_DATETIME },
            { label: 'Vytvořil', clmn: 'vytvoril' },
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }            
        ];
        
        this.isDropButton = this.srv.isAdmin();
    }
    

    getCustomButtons() : any[] {
        var t = this;        

        return [{icon: 'fa fa-share', title: 'Vyřešit poruchu', tocall: function(idx) {            
                var rec = t.tab.data.list[idx];
                const url = t.router.serializeUrl( t.router.createUrlTree(['/pers/osoba/'+rec.osoba_id]));
                window.open(url, '_blank');
            }},
            
        ];
    }



    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/udrzba/hlaseni-poruchy/'+ el.id);    
    } 
   
    onDrop(el:any){
        this.srv.dropZapisPoruchy(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    

    reloadData(table: Table){
       this.srv.getZapisPoruchyTable(table.getQuery()).then(data => {


        var p;
        for (let i = 0; i < data.list.length; ++i){      
            p = data.list[i];
            if(p.stav == 0){
                p.stav = { val: 'Koncept', class: '' };  
            }
            else if(p.stav == 1){
                p.stav = { val: 'Porucha', class: '' };  
                p.trclass = 'red';
            }
            else if(p.stav == 2){
                p.stav = { val: 'Vyřešeno', class: '' };  
                p.trclass = 'green';
            }
            else if(p.stav == 3){
                p.stav = { val: 'Zrušeno', class: '' };  
                p.trclass = 'gray';
            }
        }

            
        this.asyncSetTab(data);
       }); 
    }
      
}