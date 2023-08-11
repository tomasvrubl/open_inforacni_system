import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Zdroj } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { DetailComponent, Response, Table } from '../core/module';
import { KalendarList } from './kalendar.list';
import { PracovisteListComponent } from './pracoviste.list';


@Component({
  selector: 'zdroj-detail',
  templateUrl : './_view/zdroj.detail.html',
  providers: [ ]
})

export class ZdrojDetailComponent extends DetailComponent { 

    response : Response;  

    _kalendarList : any = KalendarList;
    _strediskoList : any = PracovisteListComponent;
    @Output() zdrojChanged = new EventEmitter();


    tabPorucha: Table = new Table();
    showSelectPorucha:boolean = false;


    constructor(private cisService: CiselnikService) {       
        super();    
               
        this._rec = new Zdroj();             

        this.tabPorucha.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    
    }


    @Input() 
    set detail(val : Zdroj){
        
        if(val == null){
            this._rec = new Zdroj();
        }
        else{
            this.cisService.getZdroj(val.id).then((j: Zdroj) => {
                this._rec = j;
                this.reloadPorucha(null);
            });   
            
        }            
        
    } 
        
    
    get detail(): Zdroj{
        return this._rec;
    }

    saveme() {
       this.cisService.updateZdroj(this._rec).then(response => this.asyncSaveResponse(response));        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.cisService.getZdroj(id).then((j: Zdroj) => {         
            this._rec = j;
            this.listPorucha();
        });
    }
    
    dropme(){        
        this.cisService.dropZdroj(this._rec).then(response => this.asyncDropResponse(response));            
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this.cisService.getZdroj(-1).then((j: Zdroj) => this._rec = j).then(()=>this.zdrojChanged.emit(this));            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this._rec = resp.data;
        this.zdrojChanged.emit(this);
    }


    onPracovisteChanged(ev: any){      
        if(ev == null){
            this._rec.pracoviste_kod = '';
            this._rec.pracoviste = '';
            this._rec.pracoviste_id = -1;
        }
        else{
            this._rec.pracoviste_kod = ev.kod;
            this._rec.pracoviste = ev.nazev;
            this._rec.pracoviste_id = ev.id;
        }
        
    }
    

    
    onKalendarChanged(ev: any){
        
        if(ev == null){
            this._rec.kalendar_id = -1;
            this._rec.kalendar_kod = '';
            this._rec.kalendar = '';
        }
        else{
            this._rec.kalendar_id = ev.id;
            this._rec.kalendar_kod = ev.kod;
            this._rec.kalendar = ev.nazev;
        }
    }


    // definice poruch


    onSelectedPoruchaList(ev:any){
        
        this.cisService.linkZdrojPorucha(this._rec, ev).then((response: Response) => {
            this.response = response;
            this.reloadPorucha(null);
        });
        
        
        this.showSelectPorucha = false;
    }   

    listPorucha(){

        this.reloadPorucha(null);         
    }


    unlinkPorucha(ev:any){
        this.cisService.unlinkPoruchaZdroj(ev.id).then((response: Response) => {
            this.response = response;
            this.reloadPorucha(null);
        });
    }


    reloadPorucha(ev:any){

        if(this._rec.id  < 1)
            return;
       
  
       var query = this.tabPorucha.getQuery();
       query.clmn.push({clmn: 'zdroj_id', type: 1, filter: [{operator: 0, value: this.detail.id}]});
              
       this.cisService.getZdrojPoruchaTable(query).then(response =>{
            this.tabPorucha.data = response;
       }).then(()=>query.clmn.splice(-1,1));  
    }

}