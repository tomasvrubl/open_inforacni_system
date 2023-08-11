import { Component, Input} from '@angular/core';
import { TavirnaPec } from './_obj/tavirna';
import { TavirnaService } from './_services/tavirna.service';
import { DetailComponent, Response, Table } from '../core/module';
import { ZdrojListComponent } from '../ciselnik/module';



@Component({
  selector: 'tav-pec-detail',
  templateUrl : './_view/pec.detail.html',
  providers: [ ]
})

export class PecDetail extends DetailComponent { 

    _zdrojList : any = ZdrojListComponent;
    tabHistorie : Table;

    constructor(private srv: TavirnaService) {
        super();

        this.tabHistorie = new Table();
        this.tabHistorie.header = [
            { label: 'Pec', clmn: 'pec' },
            { label: 'Fiskální rok', clmn: 'rok' },
            { label: 'Kampaň', clmn: 'kampan' },
            { label: 'Pořadí tavby', clmn: 'tavba' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
    }


    
    saveme() {
        this.srv.updatePec(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
            this.reloadHistorieKampani(null);
            
       });        
    }
    

    reloadHistorieKampani(ev:any){

        this.srv.getPecHistorieKampaniTable(this._rec.id, this.tabHistorie.getQuery()).then(resp => {
            this.tabHistorie.data = resp;
        })
    }

    @Input() 
    set detail(val : any){
        
        
        if(val == null){
           return;
        }
        else{
            this._rec = val;
            this.reloadHistorieKampani(null);
        }            
        
    } 
        
    get detail(): any {
        return this._rec;
    }


    edit(id:number){
        this.srv.getPec(id).then((j: TavirnaPec) => {
            this._rec = j;
            this.detailChanged.emit(this);
            this.reloadHistorieKampani(null);
        });
    }

    
    dropme(){        
        this.srv.dropPec(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.edit(-1);
            }  
        });            
    }


    onZdrojChanged(ev: any){

        if(ev == null){
            this._rec.zdroj_id = -1;
            this._rec.zdroj_kod = '';
            this._rec.zdroj_nazev = '';  
        }
        else{
            this._rec.zdroj_id = ev.id;
            this._rec.zdroj_kod = ev.kod;
            this._rec.zdroj_nazev = ev.nazev;  
        }
      
    }

    zalozNovouKampan(ev:any){

        var kampan = (parseInt(this._rec.kampan) + 1);        
        var skampan = kampan.toString();

        if(kampan < 10){
            skampan = "00" + skampan;
        }
        else if(kampan < 100){
            skampan = "0" + skampan;
        }

        this._rec.kampan = skampan;
        this._rec.tavba = "000";
        this._rec.rok = (new Date().getFullYear() % 2000).toString();
    }


    formatKampan(ev:any){

        var nv = this.formatCislo(ev);

        if(nv){
            this._rec.kampan = nv;
        }

    }

    formatTavba(ev:any){

        var nv = this.formatCislo(ev);
        if(nv){
            this._rec.tavba = nv;
        }
    }
 
    
    formatCislo(ev:any){

        var v = ev.trim();
        if(Number.isNaN(Number("001"))){
            alert("Zadej číselnou hodnotu");
            return null;
        }

        var sv = parseInt(v);

        if(sv < 100){
            v = "0" + v;
        }

        return v;
    }
}