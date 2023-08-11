import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Operace } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { Response, TableQuery, Table, iDetail } from '../core/module';

@Component({
  selector: 'operace-detail',
  templateUrl : './_view/operace.detail.html',
  providers: [ ]
})

export class OperaceDetailComponent implements iDetail, OnInit { 

    response : Response;  
    _operace : Operace = new Operace();    
    @Output() operaceChanged = new EventEmitter();
    tabZdroj: Table;
    showSelectZdroj:boolean = false;
    
    constructor(private cisService: CiselnikService) {      
                
        this.response = new Response();    
        
        this.tabZdroj = new Table();
        this.tabZdroj.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Výrobní kalendář', clmn: 'kalendar' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
         
    }
    
    @Input() 
    set detail(val: Operace) {
        
        if(val == null){
            this._operace = new Operace();
        }
        else{
            this._operace  = val;
        }
       
        this.reloadDataZdroj(null);        
    }  
    
    get detail() : Operace {
        return this._operace;
    }  
    
    ngOnInit(): void { 
         this.reloadDataZdroj(null);
    }        
    

    onSubmit() {}
    
    saveme() {
       this.cisService.updateOperace(this._operace).then(response => this.asyncSaveResponse(response));        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.cisService.getOperace(id).then((j: Operace) => this._operace = j);
    }
    
    dropme(){        
        this.cisService.dropOperace(this._operace).then(response => this.asyncDropResponse(response));            
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this.cisService.getOperace(-1).then((j: Operace) => this._operace = j).then(()=>this.operaceChanged.emit(this));            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this._operace = resp.data;
        this.operaceChanged.emit(this);
        this.reloadDataZdroj(null);
    }
    
    
    listZdroj(){
        this.reloadDataZdroj(null);         
    }
    
    
    reloadDataZdroj(ev:any){
       var query = new TableQuery();       
       query.page = this.tabZdroj.data.page;
       query.limit = this.tabZdroj.data.limit;
       query.clmn = this.tabZdroj.header;
       query.clmn.push({clmn: 'X.operace_id', type: 1, filter: [{operator: 0, value: this._operace.id}]});
              
       this.cisService.getOperaceZdrojTable(query).then(response =>{
            this.tabZdroj.data = response;
       }).then(()=>query.clmn.splice(-1,1));; 
    }
    


    unlinkZdroj(ev: any){
        console.log(ev);
    }
    
    onSelectedZdrojList(ev:any){
        console.log(ev);
    }
    
}