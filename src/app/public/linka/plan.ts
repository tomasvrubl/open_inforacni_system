import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TerminalLinkaService } from './_services/terminal.service';
import { TerminalLinkaPlan } from './_obj/terminal';

import * as moment from 'moment';


@Component({
  templateUrl : './_view/plan.html',
  providers: []
})

export class TerminalLinkaPlanForm implements OnInit  { 


    linkaNazev: string = '';
    datum : Date = new Date();
    plan : TerminalLinkaPlan = new TerminalLinkaPlan();
    kod : string = ''; //zdroj kod


    constructor(private srv: TerminalLinkaService, private route: ActivatedRoute, private router: Router) {         

    }
    
    ngOnInit(): void {         


        var bSendData = false;
           
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['kod']){                   
                return Promise.resolve(null);
            }

            this.kod = params['kod'];

            if(params['backurl']){
                
                var e:any = localStorage.getItem('terminalOdvadeni')

                localStorage.removeItem('terminalOdvadeni'); 

                if(e){
                    bSendData = true;
                    return Promise.resolve(this.srv.cast<TerminalLinkaPlan>(JSON.parse(e), TerminalLinkaPlan));
                }

            }

            localStorage.removeItem('terminalOdvadeni');

            

            return this.srv.getLinkaPlan(this.kod, this.datum);
        })).subscribe((rec: TerminalLinkaPlan) => {

            if(bSendData){
                this.sendData();
            }
            else{
                this.plan = rec;
            }
             
        });      
             
    }    
    

    getAktualniDatum() : string {
        return  moment(this.datum).format("DD.MM.YYYY");
    }


    nastavDen(days:number){

        var r = new Date(this.datum);
        r.setDate(r.getDate() + days);
        this.datum = r;
        this.reloadPlan();
    }

    prihlasenaOsoba() {

        if(this.srv.userTerminal){
            return this.srv.userTerminal.osoba;
        }

        return '';
    }

    nastavDnes(){
        this.datum = new Date();
        this.reloadPlan();
    }

  
    reloadPlan(){
        this.srv.getLinkaPlan(this.kod, this.datum).then(res => this.plan = res);
    }

    sendData(){

        var hasValues = false;
        console.log(this.plan.seznam);

        this.plan.seznam.forEach(r=> {
            hasValues = r._hodnota > 0 || hasValues;
        });

        if(!hasValues){
            alert('Není zadáno množství pro odvádění.');
            return;        
        }
        
        //neni prihlasen presmeruj na prihlaseni
        if(!this.srv.userTerminal){
            localStorage.setItem('terminalOdvadeni', JSON.stringify(this.plan));
            this.router.navigate(['terminal/linka/'+this.kod + '/login', {'backurl': 'terminal/linka/'+this.kod}]);
        }

        
        this.srv.updateLinkaPlan(this.plan).then(r => this.plan = r);            

    }

}