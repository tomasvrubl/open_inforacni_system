import { Component, OnInit,  OnDestroy} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Zdroj, Pracoviste, CiselnikService, Kalendar } from '../ciselnik/module';
import { Response, TableQuery, TableData, Table, TabFilter } from '../core/module';
import {PlanService} from './_services/plan.service';
import { PlanPolozka, Plan } from './_obj/plan';
import * as moment from 'moment';
declare var jQuery : any;

@Component({
  selector: 'plan-detail',
  templateUrl : './_view/linka.detail.html',
  providers: [ ]
})

export class PlanLinkaForm implements OnInit, OnDestroy { 

     response : Response;  
     pracoviste: Pracoviste;
     cZdroj: number = -1;
     cKalendar: number = -1;
     lstZdroj: Zdroj[] = [];
     plan: Plan;
     lstKalendar: Kalendar[] = [];
     tabVZ: Table;    
     datum: any;
     search: string = "";
    
    constructor(private cisService: CiselnikService, private planService: PlanService, private route: ActivatedRoute) {                      
        this.response = new Response(); 
        this.pracoviste = new Pracoviste();
        this.plan = new Plan();
        this.datum = moment(Date()).format('YYYY-MM-DD');
        this.tabVZ = new Table();
        this.tabVZ.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Výrobek', clmn: 'nomenklatura' },
            { label: 'Poznámka', clmn: 'poznamka' },
            { label: 'Začátek', clmn: 'platnost_od', type: 3 },
            { label: 'Konec', clmn: 'platnost_do', type: 3 },
            { label: 'Plán [Ks]', clmn: 'mnozstvi' },
            { label: 'Odvedeno [Ks]', clmn: 'odvedeno' },
            { label: 'Zaplán. [Ks]', clmn: 'zaplanovano' },
            { label: 'Zbývá [Ks]', clmn: 'zbyva' }
        ];
        
        this.datum = moment().format('YYYY-MM-DD');  
  
    }
    
    
    
    ngOnInit(): void { 
   
        this.route.data.pipe(switchMap((params: Params) => { 
                
       
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getPracoviste(+params['id']);
        })).subscribe((pracoviste: Pracoviste) => {
             this.pracoviste = pracoviste;
             this.loadZdroje();
             this.refreshView();
        });                   
    } 
    
    refreshView(){
       var t = this;
       
       jQuery(function(){           

            jQuery('#dt-picker-prac-' + t.pracoviste.id).datetimepicker({
              locale: 'cs',
              format: 'YYYY-MM-DD',
              inline: true
            }).on('dp.change', function(ev){
                t.changedDatum(ev.date);
            });
       }); 
       
    }

   loadZdroje(){       
       this.cisService.getZdrojList(this.pracoviste).then((lst: Zdroj[]) => {
            this.lstZdroj = lst;
            if (this.lstZdroj.length > 0){
                this.cZdroj = 0;
            }
            
            this.markCalendar();
            this.loadKalendar();
       });
   }
   
   markCalendar(){
       
       jQuery('#dt-picker-prac-' + this.pracoviste.id+' td').removeClass('marked'); 
       
       if(this.lstZdroj.length < 1)
            return;
            
       var rok = moment(this.datum).year();
       var mesic = moment(this.datum).month()+1;     
            
       var t = this;
       this.planService.getZaplanovaneDny(this.lstZdroj[this.cZdroj], mesic, rok).then((response:Response)=> {
            
           var x;
           for(var i=0; i< response.data.length; ++i){
               
                x = '#dt-picker-prac-' + t.pracoviste.id+' td[data-day="'+response.data[i]+'"]';             
                if(jQuery(x).hasClass('active')){
                    continue;
                }
                
                jQuery(x).addClass('marked');                               
           }           
       });
   }
   
   
   loadKalendar(){
       this.cisService.getKalendarList().then((lst: Kalendar[]) => {
            this.lstKalendar = lst;
            if (this.lstKalendar.length > 0){
                this.cKalendar = 0;
            }
            
            this.reloadPlan();
            this.reloadVZ();
            this.markCalendar();
       });
   }
   
   changedDatum(ev:any){
       this.datum = moment(ev).format('YYYY-MM-DD');    
       this.reloadPlan();
       this.markCalendar();
   }
    
    isNumeric(n) {
     return !isNaN(parseFloat(n)) && isFinite(n);
    }

   checkNumber(idx:number){
       
       if (!this.isNumeric(this.plan.polozky[idx].mnozstvi)){
           this.plan.polozky[idx].mnozstvi = 0;
       }
   }
   
   formatDatum(){
       return moment(this.datum).format('DD.MM.YYYY');
   }
   
   changedZdroj(ev:any){       
       this.cZdroj =ev;       
       this.reloadPlan();
       this.reloadVZ();
       this.markCalendar();
   }
   
   
   reloadPlan(){      
        
        if (this.lstZdroj.length == 0 || !this.lstZdroj[this.cZdroj]){
           this.plan =  new Plan();
           return;
        }
       
       this.planService.getPlan(this.lstZdroj[this.cZdroj], this.datum, this.lstKalendar[this.cKalendar].id).then((rec: Plan) => {
           this.plan = rec;
       });
   }
   
   
   saveme(){    
        this.plan.datum = moment(this.datum).format('YYYY-MM-DD');
        this.plan.zdroj_id = this.lstZdroj[this.cZdroj].id;
        this.plan.kalendar_id = this.lstKalendar[this.cKalendar].id;
        this.plan.pracoviste_id = this.pracoviste.id;
        this.planService.updatePlan(this.plan).then((response:Response) => {
           this.response = response;
           this.plan = response.data;
       });
   }
   
   dropPlan(){

        this.planService.dropPlan(this.plan).then((response:Response) => {
           this.response = response;
           
           if (this.response.kod == 0){
               this.plan = new Plan();
           }
       });    
   }

   reloadVZ(){
       
       if (this.lstZdroj.length == 0 || !this.lstZdroj[this.cZdroj]){
           this.tabVZ.data.page = 0;
           this.tabVZ.data.list = [];
           return;
       }
       
       var query = new TableQuery();       
       query.page = this.tabVZ.data.page;
       query.limit = this.tabVZ.data.limit;
       query.clmn = this.tabVZ.header;
       
       this.planService.getVyrobniPrikazy(this.lstZdroj[this.cZdroj], query).then((data: TableData) => this.tabVZ.data = data);
   }
   
   
   searchZP(ev:any){
       
       var query = new TableQuery();       
       query.page = 0;
       query.limit = this.tabVZ.data.limit;
       
       if (this.search.trim().length == 0){
            for(var i=0; i < this.tabVZ.header.length; ++i){

               if(this.tabVZ.header[i].clmn == 'nomenklatura'){
                  this.tabVZ.header[i].filter = [{operator: 0, value: null}];
                  break;
               }
           }
       }
       else{
            for(var i=0; i < this.tabVZ.header.length; ++i){

               if(this.tabVZ.header[i].clmn == 'nomenklatura'){
                  this.tabVZ.header[i].filter = [{operator: TabFilter.O_LIKE, value: this.search}];
                  break;
               }
           }   
       }
       
       
       query.clmn = this.tabVZ.header;
       this.planService.getVyrobniPrikazy(this.lstZdroj[this.cZdroj], query).then((data: TableData) => this.tabVZ.data = data);       
   }
   
   
   getCustomButtons(){
       var t = this;
       return [{icon: 'fa-open', label: '', tocall: function(data) {
           t.appendVZ(data);
       }}]
   }
   
   
   appendVZ(ev:any){
       
       var pol = new PlanPolozka();
       var cal = this.lstKalendar[this.cKalendar];
       
       pol.poradi = 0;
       if (this.plan.polozky.length > 0){
        pol.poradi = this.plan.polozky[this.plan.polozky.length-1].poradi + 1;    
       }
       
       pol.vyr_zakazka_kod = ev.kod;
       pol.nazev = ev.nazev;
       pol.pokyn = ev.pokyn;
       pol.kalendar_id = cal.id;
       pol.vyrobek = ev.nomenklatura;
       pol.mnozstvi = ev.zbyva;
       pol._plan = ev.mnozstvi;
       pol._odvedeno = ev.odvedeno;
       pol._zbyva = ev.zbyva;
       
       if (cal.smeny.length < 1){
           alert("Kalendář nemá definované směny. Alespoň jednu směnu musí mít.")
           return;
       }
       
       pol.kalendar_smena_id = cal.smeny[0].id;
       this.plan.polozky.push(pol);
   }
   
   dropRow(idx:number){
       
       if (this.plan.polozky.length < 1){
        return;      
       }
       
       this.plan.polozky.splice(idx, 1);
   }
   
   ngOnDestroy(): void {}
   
}