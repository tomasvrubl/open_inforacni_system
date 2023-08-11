import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizaceService } from './_services/organizace.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';
import { ObjMaterialDetail } from './objmat.detail';

@Component({
  selector: 'objmaterial-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ ObjMaterialDetail ]
})

export class ObjMaterialList extends BaseListComponent  {
    
    getComponentName(): string {
        return "ObjMaterialList";
    } 
 
    constructor(private serv: OrganizaceService,  protected router: Router) {

        super(router, ObjMaterialDetail, serv);

        this.tab.header = [
            { label: 'ID', clmn: 'id'},
            { label: 'Datum', clmn: 'datum', type: TabColumn.TYPE_DATE  },
            { label: 'Středisko', clmn: 'pracoviste', fulltext: true  },
            { label: 'Kód', clmn: 'pracoviste_kod', fulltext: true  },
            { label: 'Objednává', clmn: 'objednal', fulltext: true },
            { label: 'Předpokládaná cena', clmn: 'cena_celkem', type: 1 },
            { label: 'Stav', clmn: 'stav', type: TabColumn.TYPE_NUMBER, enum: [ { val: 0,  lbl: 'Vytvořen'}, { val: 1,  lbl: 'Čeká na schválení'}, { val: 2,  lbl: 'Odsouhlašen'}, { val: 3,  lbl: 'Objednáno'}] },
            { label: 'Odsouhlašeno', clmn: 'schvaleno', type: TabColumn.TYPE_DATE },
            { label: 'Odsouhlasil', clmn: 'schvalil', fulltext: true },
            { label: 'Vytvořeno', clmn: 'vytvoreno', type: 4 },
            { label: 'Vytvořil', clmn: 'vytvoril' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
  
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/org/objmat/'+ el.id);
    } 

    onDrop(el:any){
        this.serv.dropObjMaterialu(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
       this.serv.getObjMaterialuTable(table.getQuery()).then((data: any) => { 

            var p;
            for (let i = 0; i < data.list.length; ++i){      
                p = data.list[i];
                if(p.stav == 0){
                    p.stav = { val: 'Vytvořen', class: '' };  
                }
                else if(p.stav == 1){
                    p.stav = { val: 'Čeká na schválení', class: '' };  
                }
                else if(p.stav == 2){
                    p.stav = { val: 'Odsouhlašen', class: '' };
                    p.trclass = 'green';            

                }
                else if(p.stav == 3){
                    p.stav = { val: 'Objednáno', class: 'yellow' };  
                    p.trclass = 'yellow';            
                }
            }

            this.asyncSetTab(data);

       }); 
    }
    
}