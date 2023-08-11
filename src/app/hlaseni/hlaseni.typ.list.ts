import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Response, TableQuery, TableData,Table } from '../core/module';
import { HlaseniService} from './_services/hlaseni.service';
import { HlaseniTyp} from './_obj/hlaseni'


@Component({
  selector: 'hlaseni-typ-list',
  templateUrl : './_view/hlaseni.typ.list.html',
  providers : [  ]
})

export class HlaseniTypList implements OnInit { 

    response : Response;  
    tab: Table;
    typ: HlaseniTyp;
    
    @Input() isSelector : boolean = false;
    @Output() onSelectedTyp = new EventEmitter();
    @Output() onSelectCancel = new EventEmitter();
    
    constructor(private serv: HlaseniService,  private router: Router) {
        this.response = new Response();
        this.tab = new Table();
        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Kod', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
        this.typ = new HlaseniTyp();
    }
    
    ngOnInit(): void {                
        this.serv.getHlaseniTypTable(null).then(response => this.asyncSetTab(response));          
    }
    
    asyncSetTab(data: TableData){
        this.tab.data = data;
    }
    
    
    onEdit(el:any, iswnd:boolean) {               
        if(iswnd){
            this.router.navigate(['/admin/hlaseni/'+ el.id]);
        }        
        this.typ = el;
    } 
   
    onDrop(el:any){
        this.serv.dropHlaseniTyp(el).then(response => this.asyncReloadData(response));
    }
    
    asyncReloadData(response: Response) {        
       this.response = response;
       this.reloadData(this.tab);       
    }
    
    reloadData(table: Table){
       var query = new TableQuery();       
       query.page = table.data.page;
       query.limit = table.data.limit;
       query.clmn = table.header;
       
       this.serv.getHlaseniTypTable(query).then(response => this.asyncSetTab(response)); 
    }
      
    onSelected(ev: any){     
        this.onSelectedTyp.emit(ev);        
    }

    
    onCancel(ev:any){
        this.onSelectCancel.emit(ev);        
    }
    
   
}