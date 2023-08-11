import { Component, Output, EventEmitter, Input} from '@angular/core';
import { Router } from '@angular/router';
import { KalendarSmenaDetail } from './kalendar-smena.detail';
import { CiselnikService } from './_services/ciselnik.service';
import { Table, BaseListComponent} from '../core/module';


@Component({
  selector: 'kalendar-smena-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [  ]
})

export class KalendarSmenaList extends BaseListComponent { 

    getComponentName(): string {
        return "KalendarSmenaList";
    } 

    @Output() onSelectedSmena = new EventEmitter();
    @Output() onSelectCancel = new EventEmitter();
    @Input() _kalendarid : number = -1;

    constructor(private ciselnikService: CiselnikService,  protected router: Router) {
    
        super(router, KalendarSmenaDetail, ciselnikService);

        this.tab.header = [
            { label: 'Název', clmn: 'nazev' },
            { label: 'Začátek směny', clmn: 'smena_zacatek', type: 0, sort: 1 },
            { label: 'Konec směny', clmn: 'smena_konec', type: 0 },
            { label: 'Po', clmn: 'pondeli', type: 2 },
            { label: 'Út', clmn: 'utery', type: 2 },
            { label: 'St', clmn: 'streda', type: 2 },
            { label: 'Čt', clmn: 'ctvrtek', type: 2 },
            { label: 'Pá', clmn: 'patek', type: 2 },
            { label: 'So', clmn: 'sobota', type: 2 },
            { label: 'Ne', clmn: 'nedele', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno' },
            { label: 'Změnil', clmn: 'zmenil' }
        ];

    }
    
    @Input() 
    set kalendarid(val : number){
        
        if(val == null){
            this._kalendarid = -1;
        }
        else{
            this._kalendarid = val;                        
        }            

        this.ciselnikService.getSmenaTable(this._kalendarid, this.tab.getQuery()).then(response => this.asyncSetTab(response));    

    } 
        
    
    get kalendarid(): number {
        return this._kalendarid;
    }
    

    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, 'ciselnik/kalendar/' + this._kalendarid + '/' + el.id);    
    } 

   
    onDropSmena(el:any){


        this.ciselnikService.dropSmena(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });


    }
    
    
    reloadData(table: Table){
       this.ciselnikService.getSmenaTable(this.kalendarid, table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      
    onSelected(ev: any){     
        this.onSelectedSmena.emit(ev);        
    }
    
    
    onCancel(ev:any){
        this.onSelectCancel.emit(ev);        
    }
    
   
}