import { Component } from '@angular/core';
import { UdrzbaService } from './_services/udrzba.service';
import { CustomButton, DetailComponent, Response } from '../core/module';
import { ZapisPoruchy } from './_obj/udrzba';
import { PoruchyList, ZdrojListComponent } from '../ciselnik/module';

@Component({
  selector: 'zapis-poruchy-detail',
  templateUrl : './_view/zapis-poruchy.detail.html',
  providers: [ ]
})

export class ZapisPoruchyDetail extends DetailComponent { 
    
    _zdrojList : any = ZdrojListComponent;
    _poruchaList : any = PoruchyList;

    _custButtons:  CustomButton[] = [ new CustomButton('Odeslat hlášení', (btn) => {         
                this._rec.stav = 1;
                this.saveme();
            }, null, null, () => { return this._rec && this._rec.stav == 0}),
            new CustomButton('Vyřešit poruchu', (btn) => {         
                this._rec.stav = 1;
                this.saveme();
            }, 'fa fa-share', null, () => { return this._rec && this._rec.stav == 1}),

            new CustomButton('Stornovat poruchu', (btn) => {         
                this._rec.stav = 3;
                this.saveme();
            }, 'fa fa-trash', 'storno', () => { return this.srv.isAdmin() ||  this.srv.isAllowed('udrzba', 'admin')}),
    ];

    
    constructor(private srv: UdrzbaService) {     
        super();         
        
    }
    
    pravoDelete() {
        return this.srv.isAdmin() ;
    }

    pravoSave() {

        if(this._rec.stav == 0 )
            return true;


        return this.srv.isAdmin() ||  this.srv.isAllowed('udrzba', 'admin');
    }

    
    saveme() {

        this.srv.updateZapisPoruchy(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }
    
    edit(id:number){
        
        this.srv.getZapisPoruchy(id).then((j: ZapisPoruchy) => {
            this._rec = j;
            this.detailChanged.emit(this);
        });


    }
    
    dropme(){        
        this.srv.dropZapisPoruchy(this._rec).then((response :Response) =>  {
            this.response = response;

           if (response.kod == 0){
                this.edit(-1);               
           }  
       });           
    }


    onZdrojChanged(ev: any){      
        if(ev == null){
            this._rec.zdroj_kod = '';
            this._rec.zdroj = '';
            this._rec.zdroj_id = -1;
        }
        else{

            this._rec.zdroj_kod = ev.kod;
            this._rec.zdroj = ev.nazev;
            this._rec.zdroj_id = ev.id;
        }
        
    }

    onPoruchaChanged(ev: any){      
        if(ev == null){
            this._rec.porucha_kod = '';
            this._rec.porucha = '';
            this._rec.porucha_id = -1;
        }
        else{

            this._rec.porucha_kod = ev.kod;
            this._rec.porucha = ev.nazev;
            this._rec.porucha_id = ev.id;
        }
        
    }
  
}