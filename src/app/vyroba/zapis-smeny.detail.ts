import { Component, Input, Output, EventEmitter} from '@angular/core';
import { ItemList, Response, iDetail } from '../core/module';
import { VyrZapisSmeny, VyrZapisSmenyZarazeni } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';
import { CiselnikService, PracovisteListComponent, ZdrojListComponent } from '../ciselnik/module';
import { VyrOsobaList } from './vyr-osoba.list';

@Component({
  selector: 'vyr-zapis-smeny-detail',
  templateUrl : './_view/zapis-smeny.detail.html',
  providers: [ ]
})

export class VyrZapisSmenyDetail implements iDetail { 

    _zdrojList : any = ZdrojListComponent;
    _pracovisteList : any = PracovisteListComponent;    
    _vyrOsobyList : any = VyrOsobaList;
    _smena : ItemList[] = [];
    response : Response = new Response();  
    _rec : VyrZapisSmeny = new VyrZapisSmeny();

    validForm : any =  { kalendar: true, };

    
    @Output() zapisChanged = new EventEmitter();
    
    constructor(private srv: VyrobaService, private cis: CiselnikService) { }
    

    @Input() 
    set detail(val : VyrZapisSmeny){
        
        if(val == null){
            this._rec = new VyrZapisSmeny();
        }
        else{
            this._rec = val;
        }            
        
        this.cis.getKalendarSmeny(this._rec.zdroj_id, this._rec.pracoviste_id).then(r=> this._smena = r);
        this.srv.getZapisSmenaZarazeniList(this._rec.zdroj_id, this._rec.pracoviste_id, this._rec.id).then(r => this._rec.polozky = r);
    } 
        
    get detail(): VyrZapisSmeny {
        return this._rec;
    }

    saveme() {


        if(this._rec.kalendar_smena_id < 0){
            this.validForm.kalendar = false;
            return;
        }

        this.srv.updateZapisSmeny(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.zapisChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.srv.getZapisSmeny(id).then((j: VyrZapisSmeny) =>  {
            this._rec = j
            this.cis.getKalendarSmeny(this._rec.zdroj_id, this._rec.pracoviste_id).then(r=> this._smena = r);
        });
    }

    dropme(){        
        this.srv.dropZapisSmeny(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.srv.getZapisSmeny(-1).then((j: VyrZapisSmeny) => this._rec = j).then(()=>this.zapisChanged.emit(this));                
            }  
        });                    
    }
    



    onZdrojChanged(ev: any){      
        if(ev == null){
            this._rec.zdroj_kod = '';
            this._rec.zdroj = '';
            this._rec.zdroj_id = -1;
            this._smena = [];
        }
        else{

            this._rec.zdroj_kod = ev.kod;
            this._rec.zdroj = ev.nazev;
            this._rec.zdroj_id = ev.id;

            this.cis.getKalendarSmeny(this._rec.zdroj_id, this._rec.pracoviste_id).then(r=> this._smena = r);
            this.srv.getZapisSmenaZarazeniList(this._rec.zdroj_id, this._rec.pracoviste_id, this._rec.id).then(r => this._rec.polozky = r);

        }
        
    }


    onZarazeniChanged(ev:any, z:VyrZapisSmenyZarazeni){

        if(ev == null){
            z.osoba = '';
            z.osoba_oscislo = '';
            z.osoba_id = -1;
        }
        else{
            z.osoba = ev.prijmeni + ' ' + ev.jmeno;
            z.osoba_oscislo = ev.oscislo;
            z.osoba_id = ev.id;
        }

    }

    onPracovisteChanged(ev: any){      
        if(ev == null){
            this._rec.pracoviste_kod = '';
            this._rec.pracoviste = '';
            this._rec.pracoviste_id = -1;
            this._smena = [];
        }
        else{
            this._rec.pracoviste_kod = ev.kod;
            this._rec.pracoviste = ev.nazev;
            this._rec.pracoviste_id = ev.id;

            this.cis.getKalendarSmeny(this._rec.zdroj_id, this._rec.pracoviste_id).then(r=> this._smena = r);
            this.srv.getZapisSmenaZarazeniList(this._rec.zdroj_id, this._rec.pracoviste_id, this._rec.id).then(r => this._rec.polozky = r);
        }
        
    }

}