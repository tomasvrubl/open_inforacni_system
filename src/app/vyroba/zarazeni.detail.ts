import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Response, iDetail } from '../core/module';
import { VyrZarazeni } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';
import { PracovisteListComponent } from '../ciselnik/module';

@Component({
  selector: 'vyr-zarazeni-detail',
  templateUrl : './_view/zarazeni.detail.html',
  providers: [ ]
})

export class VyrZarazeniDetail implements iDetail { 

    response : Response = new Response();  
    _rec : VyrZarazeni = new VyrZarazeni();
    _strediskoList : any = PracovisteListComponent;    
    @Output() zarazeniChanged = new EventEmitter();
    
    constructor(private srv: VyrobaService) { }
    

    @Input() 
    set detail(val : VyrZarazeni){
        
        if(val == null){
            this._rec = new VyrZarazeni();
        }
        else{
            this._rec = val;
        }            
        
    } 
        
    get detail(): VyrZarazeni {
        return this._rec;
    }

    saveme() {
        this.srv.updateZarazeni(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.zarazeniChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.srv.getZarazeni(id).then((j: VyrZarazeni) => this._rec = j);
    }

    dropme(){        
        this.srv.dropZarazeni(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.srv.getZarazeni(-1).then((j: VyrZarazeni) => this._rec = j).then(()=>this.zarazeniChanged.emit(this));            
            }  
        });                    
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


}