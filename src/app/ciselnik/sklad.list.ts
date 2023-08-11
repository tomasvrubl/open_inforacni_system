import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Sklad } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { Response, TableData,Table} from '../core/module';


@Component({
  selector: 'sklad-list',
  templateUrl : './_view/sklad.list.html',
  providers : [  ]
})

export class SkladList implements OnInit { 


    response : Response;  
    tabSklad: Table;
    sklad: Sklad;
    
    @Input() isSelector : boolean = false;
    @Input() isMultiSelect : boolean = false;
    @Output() onSelectedSklad = new EventEmitter();
    @Output() onSelectedSkladList = new EventEmitter();
    @Output() onSelectCancel = new EventEmitter();
    
    constructor(private ciselnikService: CiselnikService,  private router: Router) {
        this.response = new Response();
        this.tabSklad = new Table();
        this.tabSklad.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Externí kód', clmn: 'extern_kod' },            
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
        this.sklad = new Sklad();
    }
    
    ngOnInit(): void {                
        this.ciselnikService.getSkladTable(null).then(response => this.asyncSetTab(response));          
    }
    
    asyncSetTab(data: TableData){
        this.tabSklad.data = data;
    }
    
    
    onEdit(el:any, iswnd:boolean) {               
        if(iswnd){
            this.router.navigate(['/ciselnik/sklad/sklad/'+ el.id]);
        }        
        this.sklad = el;
    } 
   
    onDrop(el:any){
        this.ciselnikService.dropSklad(el).then(response => this.asyncReloadData(response));
    }
    
    asyncReloadData(response: Response) {        
       this.response = response;
       this.reloadData(this.tabSklad);       
    }
    
    reloadData(table: Table){
       this.ciselnikService.getSkladTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      
    onSelected(ev: any){     
        this.onSelectedSklad.emit(ev);        
    }
    
    onMultiSelect(ev:any){
        this.onSelectedSkladList.emit(ev);
    }
    
    onCancel(ev:any){
        this.onSelectCancel.emit(ev);        
    }
    
    getCustomButtons(){        
        var t = this;        
        return [{icon: 'fa-regular fa-rectangle-list', label: 'Karty', tocall: function(data) {
            t.showInfo(data); 
        }}];
    }
   
    showInfo(ev){
        this.router.navigate(['/ciselnik/sklad/'+ev.id+'/karta/list/']);
    } 
  
   
   
}