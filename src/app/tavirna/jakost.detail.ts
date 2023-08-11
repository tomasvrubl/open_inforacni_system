import { Component} from '@angular/core';
import { JakostKov, JakostKovSlozeni } from './_obj/tavirna';
import { TavirnaService } from './_services/tavirna.service';
import { DetailComponent, ItemList, Response } from '../core/module';
import { CiselnikService } from '../ciselnik/module';

@Component({
  selector: 'tav-jakost-detail',
  templateUrl : './_view/jakost.detail.html',
  providers: [ ]
})

export class JakostDetail extends DetailComponent { 

    _platnost : ItemList[] = [ {value: true, label: 'Platný'}, {value: false, label: 'Neplatný'}]; 
    jednotky : ItemList[] = [];
    showKarta:boolean = false;

    
    constructor(private srv: TavirnaService, private cisService: CiselnikService) {
        super();
     }

    ngOnInit(): void {                
        this.cisService.getJednotkaList().then((jednotky : any[]) =>  {
            this.jednotky = jednotky;
        });          
    }

    
    saveme() {
        this.srv.updateJakost(this._rec).then((response :Response) =>  {
            this.response = response;
            this._rec = response.data;
            this.detailChanged.emit(this);
       });        
    }
    

    edit(id:number){
        this.srv.getJakost(id).then((j: JakostKov) => {
            this._rec = j;
            this.detailChanged.emit(this);
        });
    }

    
    dropme(){        
        this.srv.dropJakost(this._rec).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.srv.getJakost(-1).then((j: JakostKov) => this._rec = j).then(()=>this.detailChanged.emit(this));            
            }  
        });            
    }

    dropKartaSlozeni(ev:any){


        if(!confirm('Opravdu odebrat materiálovou kartu ze složení?')){
            return;
        }

        
        for(var i=0; i < this._rec.slozeni.length; ++i){
            if(this._rec.slozeni[i].id == ev.id){
                this._rec.slozeni.splice(i, 1);
                this.srv.dropJakostSlozeni(ev.id).then((response: Response) => {
                    this.response = response;
                });
                break;
            }
        }

    }
    

    onSelectedKartaList(ev:any){

        console.log('onSelectedKartaList()');
        console.log(ev);

        var lst = [], e, c;

        for(var i=0; i < ev.length; ++i){
            c = ev[i];
            e = new JakostKovSlozeni();

            e.jakost_id = this._rec.id;
            e.karta_id = c. id;
            e.karta_nazev = c.nazev;
            e.jednotka_id = c.jednotka_id;

            lst.push(e);
        }

        if(lst.length > 0){
            this.srv.addJakostKarta(this._rec.id, lst).then((resp:Response)=>{
                this.response = resp;
                this._rec.slozeni = resp.data;
            });
        }
        

        this.showKarta = false;
    }   

    
}