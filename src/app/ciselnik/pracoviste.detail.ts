import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { Pracoviste, Zdroj } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { Response, TableQuery, TabFilter, Table, iDetail } from '../core/module';
import { KalendarList } from './kalendar.list';

@Component({
  selector: 'pracoviste-detail',
  templateUrl : './_view/pracoviste.detail.html',
  providers: [ ]
})

export class PracovisteDetailComponent implements iDetail, OnInit { 

    response : Response = new Response();  
    _kalendarList : any = KalendarList;
    _pracoviste : Pracoviste = new Pracoviste();    
    @Output() pracovisteChanged = new EventEmitter();
    tabZdroj: Table = new Table();
    cZdroj: Zdroj = new Zdroj();

    showNovyZdroj:boolean = false;
    showSelectZdroj:boolean = false;

    
    constructor(private cisService: CiselnikService, private router: Router) {

        this.tabZdroj.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Výrobní kalendář', clmn: 'kalendar' },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    
    }
    
    @Input() 
    set detail(val :Pracoviste) {
        
        if(val == null){
            this._pracoviste = new Pracoviste();
        }
        else{
            this._pracoviste  = val;
        }
       
        this.reloadDataZdroj(null);
        
    }  
    
    get detail() : Pracoviste {
        return this._pracoviste;
    }  
    
    ngOnInit(): void { 
         this.reloadDataZdroj(null);
    }        
    
    saveme() {
       this.cisService.updatePracoviste(this._pracoviste).then(response => this.asyncSaveResponse(response));        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.cisService.getPracoviste(id).then((j: Pracoviste) => this.detail = j);
    }
    
    dropme(){        
        this.cisService.dropPracoviste(this._pracoviste).then(response => this.asyncDropResponse(response));            
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this.cisService.getPracoviste(-1).then((j: Pracoviste) => this.detail = j).then(()=>this.pracovisteChanged.emit(this));            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this.detail = resp.data;
        this.pracovisteChanged.emit(this);
        this.reloadDataZdroj(null);
    }
    
    
    newZdroj(){
        this.cZdroj = new Zdroj();
        this.cZdroj.pracoviste_kod = this.detail.kod;
        this.cZdroj.pracoviste = this.detail.nazev;
        this.cZdroj.pracoviste_id = this.detail.id;
        this.showNovyZdroj = true;
    }
    
    listZdroj(){
        this.showNovyZdroj = false;
        this.reloadDataZdroj(null);         
    }
    
    onSelectedZdrojList(ev:any){
        
        this.cisService.linkPracovisteZdroj(this._pracoviste, ev).then((response: Response) => {
            this.response = response;
            this.reloadDataZdroj(null);
        });
        
        
        this.showSelectZdroj = false;
    }   
    
    unlinkZdroj(ev:any){
        this.cisService.unlinkPracovisteZdroj(ev.id).then((response: Response) => {
            this.response = response;
            this.reloadDataZdroj(null);
        });
    }
    
    reloadDataZdroj(ev:any){

        if(this._pracoviste.id  < 1)
            return;
       
       var query = this.tabZdroj.getQuery();
       query.clmn.push({clmn: 'pracoviste_id', type: 1, filter: [{operator: 0, value: this.detail.id}]});
              
       this.cisService.getZdrojTable(query).then(response =>{
            this.tabZdroj.data = response;
       }).then(()=>query.clmn.splice(-1,1));  
    }
    

    onKalendarChanged(ev: any){

        if(ev == null){
            this._pracoviste.kalendar_id = -1;
            this._pracoviste.kalendar_kod = '';
            this._pracoviste.kalendar = '';
        }
        else{
            this._pracoviste.kalendar_id = ev.id;
            this._pracoviste.kalendar_kod = ev.kod;
            this._pracoviste.kalendar = ev.nazev;
        }

        
    
    }
    
}