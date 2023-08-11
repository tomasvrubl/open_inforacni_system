import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalLinkaService } from './_services/terminal.service';
import { ItemList, TabColumn, TabFilter } from 'src/app/core/module';
import { VyrOsobaList, VyrZapisSmeny, VyrZapisSmenyZarazeni } from 'src/app/vyroba/module';
import { VyrobaService } from 'src/app/vyroba/_services/vyroba.service';
import { Zdroj } from 'src/app/ciselnik/module';


@Component({
  templateUrl : './_view/smena.html',
  providers: []
})

export class TerminalLinkaSmenaForm implements OnInit  { 

    
    _rec : VyrZapisSmeny = new VyrZapisSmeny();    
    _vyrOsobyList : any = VyrOsobaList;
    _extraFilter : any = [];
    validForm : any =  { kalendar: true, zarazeni: true};
    _smena : ItemList[] = [];
    _zdroj : Zdroj = null;

    constructor(private srv: TerminalLinkaService, private vyr: VyrobaService, private route: ActivatedRoute,  private router: Router) {         

    }
    
    ngOnInit(): void {

        var bSend = false;
        
        if(this.route.snapshot.paramMap.get('backurl')){

            var e:any = localStorage.getItem('terminalSmena')
            localStorage.removeItem('terminalSmena'); 

            if(e){                
                this._rec = this.srv.cast<VyrZapisSmeny>(JSON.parse(e), VyrZapisSmeny);
                bSend = true;
                
            }

        }

        var kod  = this.route.parent.snapshot.paramMap.get('kod');     
            
        var t = this;
        this.srv.getZdroj(kod).then(v => {
            
            this._zdroj = v;
            this._rec.pracoviste_id = v.pracoviste_id;
            this._rec.zdroj_id = v.id;
            this._rec.zdroj_kod = v.kod;
            this._extraFilter = [ {clmn: 'pracoviste_kod', value: v.pracoviste_kod, operator: TabFilter.O_EQ, type: TabColumn.TYPE_STRING } ]; //extra filtr filtruj pouze z pracoviste, ve kterem je stroj
            t.srv.getKalendarSmeny(v.kod).then(r=> this._smena = r);
            t.vyr.getZapisSmenaZarazeniList(this._rec.zdroj_id, this._rec.pracoviste_id, this._rec.id).then(r => {
                this._rec.polozky = r;

                if(bSend){
                    this.srv.updateZapisSmeny(this._rec).then(r => { this._rec = r;});   
                    this.novyZaznam();
                }
            });
        });      
        
    }    
    
    prihlasenaOsoba() {

        if(this.srv.userTerminal){
            return this.srv.userTerminal.osoba;
        }

        return '';
    }


    novyZaznam(){
        this._rec = new VyrZapisSmeny();
        this._rec.zdroj_id = this._zdroj.id;
        this._rec.zdroj_kod = this._zdroj.kod;
        this._rec.pracoviste_id = this._zdroj.pracoviste_id;
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

    sendData() {


        if(this._rec.kalendar_smena_id < 0){
            this.validForm.kalendar = false;
            return;
        }
        else{
            this.validForm.kalendar = true;
        }

        var polozek = 0;

        this._rec.polozky.forEach(el=>{
            if(el.osoba_id > -1){
                polozek++;
            }
        });
        

        if(polozek  == 0){
            this.validForm.zarazeni = false;
            return;
        }
        else{
            this.validForm.zarazeni = true;
        }


        //neni prihlasen presmeruj na prihlaseni
        if(!this.srv.userTerminal){
            localStorage.setItem('terminalSmena', JSON.stringify(this._rec));
            this.router.navigate(['terminal/linka/'+this._rec.zdroj_kod + '/login', {'backurl': 'terminal/linka/'+this._rec.zdroj_kod+'/smena'}]);
        }
        else{
            this._rec.termosoba = this.srv.userTerminal.osoba;
            this.srv.updateZapisSmeny(this._rec).then(r => { this._rec = r});   
        }

    }

}