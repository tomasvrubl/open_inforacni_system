import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizaceService } from './_services/organizace.service';
import { Table, BaseListComponent} from '../core/module';
import { ObjMaterialDetail } from './objmat.detail';

@Component({
  selector: 'objmaterial-pol-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ ObjMaterialDetail ]
})

export class ObjMaterialPolList extends BaseListComponent  {
    
    getComponentName(): string {
        return "ObjMaterialPolList";
    } 
 
    constructor(private serv: OrganizaceService,  protected router: Router) {

        super(router, ObjMaterialDetail, serv);

        this.tab.header = [
            { label: 'ID', clmn: 'id', hidden: true },
            { label: 'Obj. ID', clmn: 'obj_mat_id' },
            { label: 'Datum obj.', clmn: 'm_datum_obj', type: 3 },            
            { label: 'Položka', clmn: 'popis', fulltext: true},
            { label: 'Množství', clmn: 'mnozstvi', type: 1},
            { label: 'Měr.j.', clmn: 'jednotka'},
            { label: 'Cena', clmn: 'predpokl_cena', type: 1},
            { label: 'Obj.stav', clmn: 'o_stav', type: 6, enum: [ { val: 0,  lbl: 'Vytvořen'}, { val: 1,  lbl: 'Čeká na schválení'}, { val: 2,  lbl: 'Odsouhlašen'}, { val: 3,  lbl: 'Objednáno'}] },
            { label: 'Objednáno', clmn: 'p_objednano', type: 2, css_class: 'center', enum: [ { val: false,  lbl: 'Ne'}, { val: true,  lbl: 'Ano'} ] },
            { label: 'Objednava', clmn: 'm_objednal', fulltext: true  },
            { label: 'Středisko', clmn: 'stredisko', fulltext: true },
            { label: 'Firma', clmn: 'firma', fulltext: true },
            { label: 'Poznámka', clmn: 'poznamka', fulltext: true },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];

        this.isDropButton = false;
        
    }

    getCustomButtons() : any[] {
        
    
        return [
            { icon: 'fa-solid fa-cart-shopping', label: '', title: "Označit záznam za objednáno",
            tocall: (idx:number, e:any) => {
                

                var pb = true;
                if(e.tmp_p_objednano){
                    pb = this.tab.data.list[idx].tmp_p_objednano = false;
                    this.tab.data.list[idx].p_objednano = { val: 'Ne', class: '' };
                }
                else{
                    pb = this.tab.data.list[idx].tmp_p_objednano = true;
                    this.tab.data.list[idx].p_objednano =  { val: 'Ano', class: 'objednano' }; 
                }

                this.serv.sendObjMaterialuPolObjednano(e.id, pb).then(resp => this.response = resp);
            }}
        ];
    }
    
  
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.obj_mat_id, iswnd, '/org/objmat/'+ el.obj_mat_id);
    } 

    
    reloadData(table: Table){
       this.serv.getObjMaterialuPolTable(table.getQuery()).then((data: any) => { 

            this.asyncSetTab(data);            
            var p;
            for (let i = 0; i < data.list.length; ++i){

                p = data.list[i];                
                if(p.o_stav == 0) {
                    p.o_stav = { val: 'Vytvořen', class: '' };  
                }
                else if(p.o_stav == 1) {
                    p.o_stav = { val: 'Čeká na schválení', class: '' };  
                }
                else if(p.o_stav == 2) {
                    p.o_stav = { val: 'Odsouhlašen', class: '' };  
                    p.trclass = 'green';
                }
                else if(p.o_stav == 3) {
                    p.o_stav = { val: 'Objednáno', class: '' };  
                    p.trclass = 'yellow';
                }

                p.tmp_p_objednano = p.p_objednano;

                if(p.p_objednano == true){
                    p.p_objednano = { val: 'Ano', class: '' };         
                    p.trclass = 'objednano';            
                }
                else{
                    p.p_objednano = { val: 'Ne', class: '' };  
                }

            }

       }); 
    }
    
}