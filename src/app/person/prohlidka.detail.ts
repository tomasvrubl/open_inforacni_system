import { Component} from '@angular/core';
import { PersPracCinnost, PersZdravProhlidka } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';
import { Response, ItemList, DetailComponent} from '../core/module';
import { OsobaListComponent } from './osoba.list';

@Component({
  selector: 'pers-zdrav-prohlidka-detail',
  templateUrl : './_view/prohlidka.detail.html',
  providers: [ ]
})

export class PersZdravProhlidkaDetail extends DetailComponent { 


    _typ : ItemList[] = [ {value: 0, label: 'Vstupní'}, {value: 1, label: 'Periodická'}, {value: 2, label: 'Mimořádná'}];
    _cinnostList : PersPracCinnost[] = [];
    _osobaList: any = OsobaListComponent;

    _busyDatumPlatnost : boolean = false;

    constructor(private serv: ProhlidkyService) {
        super();
    }

    ngOnInit(): void {
        
        this.serv.getPracCinnostList().then(r => {
            this._cinnostList = r;
        })
    }

    changeDruh(ev:number): void {

        this._rec.t1_0 = ev == 1;
    }

    saveme() {

        if(this._rec.osoba_id < 0){
            alert('Není zadána osoba !!!');
            return;
        }
        
        this._rec.duvod_pravidlo = '';
        this.serv.updatePersProhlidka(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }

    edit(id:number){
        
        this.serv.getPersProhlidka(id).then((j: PersZdravProhlidka) => {
            this._rec = j;
            this.detailChanged.emit(this);
        });


    }
    
    dropme(){        
        this.serv.dropPersProhlidka(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getPersProhlidka(-1).then((j: PersZdravProhlidka) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }


    isCinnostChecked(r:any){
        
        return this._rec.prohlidky_cinnost.includes(r.id);
    }

    cinnostCheckedChange(chk:any, r:any){

        if(chk){
            if(!this._rec.prohlidky_cinnost.includes(r.id)){
                this._rec.prohlidky_cinnost.push(r.id);
            }
        }
        else {            
            var lst = this._rec.prohlidky_cinnost.filter(function(value, index, arr){ 
                return value != r.id;
            });
            this._rec.prohlidky_cinnost = lst;
        }
        
    }
   
    datumProhlidkyChanged(datum:Date){
      

        var t = this;
        t._busyDatumPlatnost = true;



        this.serv.getProhlidkaLhuta(this._rec.osoba_id).then(response => {

            t.response = response;
            var data = response.data;
            t._rec.duvod_pravidlo = data.duvod_pravidlo;
            var nd = new Date(datum);
            nd.setFullYear(nd.getFullYear() + data.lhuta);
            t._rec.platnost_prohlidky = nd;
            t._busyDatumPlatnost = false;
        })

    }

    onOsobaChanged(ev: any){      
        
        if(ev == null){
            this._rec.osoba_id = -1;
            this._rec.osoba_oscislo = '';
            this._rec.osoba_osoba = '';
        }
        else{
            this._rec.osoba_id = ev.id;
            this._rec.osoba_oscislo = ev.oscislo;
            this._rec.osoba_osoba = ev.prijmeni + ' ' + ev.jmeno;
    
            this.serv.fillProhlidkaRizikyOsoby(this._rec).then(r => {
                this._rec = r;
            });
        }

    }
    
}