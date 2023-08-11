import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { PersonService } from './_services/person.service';
import { ProhlidkyService } from './_services/prohlidky.service';
import { PersZdravProhlidka } from './_obj/prohlidky';
import { Response, Osoba, iDetail, TableQuery,TabFilter, ItemList } from '../core/module';
import { PracovisteListComponent } from '../ciselnik/module';
import { PersRizikovostList } from './rizikovost.list';
import * as moment from 'moment';

@Component({
  selector: 'osoba-detail',
  templateUrl : './_view/osoba.detail.html',
  providers: [ ]
})

export class OsobaDetailComponent implements iDetail, OnInit { 

    response : Response;  
    _osoba : Osoba;    
    _pracovisteList : any = PracovisteListComponent;
    _rizikovostList : any = PersRizikovostList;

    isSeznamProhlidky  :boolean = true;
    _prohlidka : PersZdravProhlidka = new PersZdravProhlidka();
    _prohlidkaFilter : TableQuery = new TableQuery();

    _zarazeni : ItemList[];

    @Output() osobaChanged = new EventEmitter();
    
    constructor(private serv: PersonService, private servprohl: ProhlidkyService) {              
        this._osoba = new Osoba();            
        this.response = new Response();    
        this._zarazeni = [];
    }

    ngOnInit(): void {

        this.serv.getPracovniKategorieCBO().then(r =>  {
            this._zarazeni = r;
        });        
    }
    
    @Input() 
    set detail(val : Osoba){
        
        if(val == null){
            this._osoba = new Osoba();
        }
        else{
           this._osoba = val;
        }

        this._prohlidkaFilter  = new TableQuery();
        this._prohlidkaFilter.clmn.push({clmn: 'osoba_id', filter: [ { value: this._osoba.id, operator: TabFilter.O_EQ }]});
    } 
        
    
    get detail(): Osoba {
        return this._osoba;
    }

    
    saveme() {
       this.serv.updateOsoba(this._osoba).then(response => this.asyncSaveResponse(response));        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.serv.getOsoba(id).then((j: Osoba) => {
            this._osoba = j;
            
            this._prohlidkaFilter  = new TableQuery();
            this._prohlidkaFilter.clmn.push({clmn: 'osoba_id', filter: [ { value: this._osoba.id, operator: TabFilter.O_EQ }]});
        });
    }
    
    dropme(){        
        this.serv.dropOsoba(this._osoba).then(response => this.asyncDropResponse(response));            
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this.serv.getOsoba(-1).then((j: Osoba) => this._osoba = j).then(()=>this.osobaChanged.emit(this));            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this._osoba = resp.data;
        this._prohlidkaFilter  = new TableQuery();
        this._prohlidkaFilter.clmn.push({clmn: 'osoba_id', filter: [ { value: this._osoba.id, operator: TabFilter.O_EQ }]});
        this.osobaChanged.emit(this);
    }
    
    onRizikovostChanged(ev:any){
        if(ev == null){
            this._osoba.rizikovost_id = -1;
            this._osoba.rizikovost_kod = '';
            this._osoba.rizikovost_druh_prace = '';  
        }
        else{
            this._osoba.rizikovost_id = ev.id;
            this._osoba.rizikovost_kod = ev.kod;
            this._osoba.rizikovost_druh_prace = ev.druh_prace;   
        }
    }

    
    onPracovisteChanged(ev: any){

        if(ev == null){
            this._osoba.pracoviste_id = -1;
            this._osoba.pracoviste_kod = '';
            this._osoba.pracoviste = '';  
        }
        else{
            this._osoba.pracoviste_id = ev.id;
            this._osoba.pracoviste_kod = ev.kod;
            this._osoba.pracoviste = ev.nazev;  
        }
      
    }
 
    
    getVek(){
        return moment().diff(this._osoba.datum_narozeni, 'years', false);
    }


    newProhlidka(){

        this._prohlidka = new PersZdravProhlidka();        
        this._prohlidka.osoba_id = this._osoba.id;
        this._prohlidka.osoba_oscislo = this._osoba.oscislo;
        this._prohlidka.osoba_osoba = this._osoba.jmeno + ' ' + this._osoba.prijmeni;

        this.servprohl.fillProhlidkaRizikyOsoby(this._prohlidka).then(r => {
            this._prohlidka = r;
        });

        this.isSeznamProhlidky = false;

        return this._prohlidka;
    }
}