import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Auto, AutoVykaz, AutoVykazSumar, AutoVykazTempl } from './_obj/cestak';
import { CestakService } from './_services/cestak.service';
import { Response, iDetail, ReportPrint } from '../core/module';
import { OsobaListComponent } from '../person/module';
import { AutoList } from './auto.list';

declare var AppLibrary : any;
declare var jQuery : any;
  
@Component({
  selector: 'auto-report-detail',
  templateUrl : './_view/report.detail.html'
})

export class AutoReportDetail implements iDetail, OnInit, AfterViewInit { 

    _printList: ReportPrint[] = [];
    _showPrintPopup: boolean = false;
    _printIDRec: number[] =  [];
    _urlrec: string = ""; 

    cauto : Auto;
    response : Response;  

    vykaz: AutoVykazSumar;
    cbocesta: string[] = [];
    lstcesta: AutoVykazTempl[] = [];
    cboostatni: string[] = [];
    inProgress: boolean = false;
    datum: Date = new Date();

    _osobaList: any = OsobaListComponent;
    _autoList : any = AutoList;
    
    
    constructor(private cestakService: CestakService, private router: Router) {
        
        this.cauto = new Auto();
        this.response = new Response(); 
        this.vykaz = new AutoVykazSumar();           
    }
    
    ngOnInit(): void {

    
        
        var e = this;
        this.cestakService.getAutoVykazUserTemplate().then(function(arr: AutoVykazTempl[]){     
            
            if(!arr || arr.length < 1){
                e.lstcesta = [];
                e.cbocesta = [];
                return;
            }

            e.lstcesta = arr;                      

            var l = [];
            for(var i=0;i < arr.length; ++i){
                l.push(arr[i].cesta);
                
            }   
            e.cbocesta = l;
                     
        });
  
    }
    
    ngAfterViewInit() {
                 
        this.headerTableFixed();
        
        jQuery(function(){          
            
            

            var tl = null;            
            var mvnext = function(e) {
                
                var hop = e.which == 37 ? -1 : 1;                
                if(e.which == 13 || e.which == 39 || e.which == 37) {
                                        
                    var focusable = jQuery('body').find('input, select').filter(':visible');
                    var next = focusable.eq(focusable.index(this)+hop);
                    if (next.length) {
                        next.focus();
                    }
                    return false;
                }
                else if(e.which == 40){ //dolu
                    
                    var tab = jQuery(this).closest("#tab-data");
                    
                    if(tab.length > 0){                        
                        var tdix = jQuery(this).closest('td').index();
                        var trix = +(jQuery(this).closest('tr').index()+1);
                        var tbody = jQuery('tbody', tab);
                        var trt = jQuery('tr', tbody).length;
                        
                        
                        if(trix < trt){
                            var tr = jQuery('tr', tbody).eq(trix);
                            jQuery('input', jQuery('td', tr).eq(tdix)).focus();
                        }
                        
                    }
                    
                    
                }
                else if(e.which == 38){
                    var tab = jQuery(this).closest("#tab-data");
                    
                    if(tab.length > 0){                        
                        var tdix = jQuery(this).closest('td').index();
                        var trix = +(jQuery(this).closest('tr').index()-1);
                        var tbody = jQuery('tbody', tab);
                        var trt = jQuery('tr', tbody).length;
                        
                        
                        if(-1 < trix){
                            var tr = jQuery('tr', tbody).eq(trix);
                            jQuery('input', jQuery('td', tr).eq(tdix)).focus();
                        }
                    }
                    
                }
                
                
                
            };
            jQuery('body').off('keydown','input.up-down, select', mvnext);              
            jQuery('body').on('keydown','input.up-down, select', mvnext);             
        });
    }
    
    @Input() 
    set urlrec(val : string){
        
        if(val == null){
            this._urlrec = "";
        }
        else{
           this._urlrec = val;
        }
    } 

    
    get urlrec(): string {
        return this._urlrec;
    }


    @Input() 
    set detail(val : AutoVykazSumar){
        
        if(val == null){       
            this.cestakService.getAuto(-1).then(auto => {
                this.cauto = auto;
                var oid = this.cestakService.user  ? this.cestakService.user.osoba_id : -1;
                
                this.cestakService.getMesicniSumar(this.datum.getFullYear(), this.datum.getMonth()+1, this.cauto.id, oid)
                .then(r => { this.vykaz = r;
                    this.calcStatistika();
                });
            });
            
            return;
        }
        else{
            this.vykaz = val;
            this.datum = new Date(val.rok, val.mesic-1);
            this.calcStatistika();
        }            
                
        this.cestakService.getAuto(this.vykaz.autoid).then(auto => this.cauto = auto);
    } 

        
    get detail(): AutoVykazSumar {
        return this.vykaz;
    }


    onOsobaChanged(ev: any){     
        
        if(ev == null){
            this.vykaz.osobaid = -1;
            this.vykaz.osoba_oscislo = '';
            this.vykaz.osoba_osoba = '';
        }else{
            this.vykaz.osobaid = ev.id;
            this.vykaz.osoba_oscislo = ev.oscislo;
            this.vykaz.osoba_osoba = ev.prijmeni + ' ' + ev.jmeno;
        }
        
    }

    
    onAutoChanged(ev: any){      
        if(ev == null){
            this.vykaz.autoid = -1;
            this.vykaz.auto_nazev = '';
            this.vykaz.auto_spz = '';            
        }
        else{
            this.vykaz.autoid = ev.id;
            this.vykaz.auto_nazev = ev.nazev;
            this.vykaz.auto_spz = ev.spz;            
        }
        
        this.cestakService.getAuto(this.vykaz.autoid).then(auto=> {
            this.cauto = auto;

            this.vykaz.list.forEach(r=>{
                r.natural = r.kwh = r.diesel = r.lpg = false;

                switch(this.cauto.def_palivo){
                    case 1: r.natural = true; break;             
                    case 2: r.diesel = true; break;
                    case 3: r.lpg = true;  break;                        
                    case 4: r.kwh = true; break;
                }
            })


            console.log(this.vykaz.list);

        });
        
    }


    onZmenaMesice(ev:any){
        const rok = ev.getFullYear();
        const mesic = ev.getMonth()+1; //javascript mesic zacina 0

        if(this.vykaz.mesic != mesic || this.vykaz.rok != rok){
            this.cestakService.getMesicniSumar(rok, mesic, this.vykaz.autoid, this.vykaz.osobaid).then(r => {
                this.vykaz = r;
                this.calcStatistika();

            });
        }
        
    }


    calcStatistika(){
        
        this.vykaz.kon_stav = parseFloat(this.vykaz.poc_stav+'');
        this.vykaz._tmp_diesel_km = 
        this.vykaz._tmp_natural_km = 
        this.vykaz._tmp_lpg_km = 
        this.vykaz._tmp_kwh_km = 
        this.vykaz.ost_kc = 0;
        
        this.vykaz.lpg_palivo_nakup_prumkc= 
        this.vykaz.lpg_palivo_nakup_kc = 
        this.vykaz.lpg_palivo_nakup_l =    
        this.vykaz.diesel_palivo_nakup_prumkc= 
        this.vykaz.diesel_palivo_nakup_kc = 
        this.vykaz.diesel_palivo_nakup_l =        
        this.vykaz.natural_palivo_nakup_prumkc= 
        this.vykaz.natural_palivo_nakup_kc = 
        this.vykaz.natural_palivo_nakup_l = 
        this.vykaz.kwh_nabijeni_prumkc =
        this.vykaz.kwh_nabijeni_kc = 
        this.vykaz.kwh_nabijeni = 0;

        
        var ujeto = 0, p;
        for(var i=0; i < this.vykaz.list.length; ++i){
            p = this.vykaz.list[i];
            ujeto = parseFloat(p.km + '') + parseFloat(p.km_private +'');
            this.vykaz.kon_stav += ujeto;                 
            this.vykaz.ost_kc += parseFloat(AppLibrary.formatNumber(p.ovydkc)+'');
            
            if (p.diesel){
                this.vykaz._tmp_diesel_km += ujeto;
                this.vykaz.diesel_palivo_nakup_kc += parseFloat(AppLibrary.formatNumber(p.tankovanikc)+'');    
                this.vykaz.diesel_palivo_nakup_l += parseFloat(AppLibrary.formatNumber(p.tankovanil)+'');  
            }            
            else if (p.natural){
                this.vykaz._tmp_natural_km += ujeto;
                this.vykaz.natural_palivo_nakup_kc += parseFloat(AppLibrary.formatNumber(p.tankovanikc)+'');    
                this.vykaz.natural_palivo_nakup_l += parseFloat(AppLibrary.formatNumber(p.tankovanil)+'');  
            }            
            else if (p.lpg){
                this.vykaz._tmp_lpg_km += ujeto;
                this.vykaz.lpg_palivo_nakup_kc += parseFloat(AppLibrary.formatNumber(p.tankovanikc)+'');    
                this.vykaz.lpg_palivo_nakup_l += parseFloat(AppLibrary.formatNumber(p.tankovanil)+'');  
            }
            else if (p.kwh){
                this.vykaz._tmp_kwh_km += ujeto;
                this.vykaz.kwh_nabijeni_kc += parseFloat(AppLibrary.formatNumber(p.kwh_nabijeni_kc)+'');    
                this.vykaz.kwh_nabijeni += parseFloat(AppLibrary.formatNumber(p.kwh_nabijeni)+'');  
            }

       }
       
       if (this.cauto.diesel){
            p = this.vykaz.diesel_palivo_nakup_kc == 0 || this.vykaz.diesel_palivo_nakup_l == 0 ? NaN : this.vykaz.diesel_palivo_nakup_kc / this.vykaz.diesel_palivo_nakup_l;
            this.vykaz.diesel_palivo_nakup_prumkc =  isNaN(p) ? 0 : Math.round(p*100) / 100 ;
       }
       
       if (this.cauto.natural){            
            p = this.vykaz.natural_palivo_nakup_kc == 0 || this.vykaz.natural_palivo_nakup_l == 0 ? NaN : this.vykaz.natural_palivo_nakup_kc / this.vykaz.natural_palivo_nakup_l;
            this.vykaz.natural_palivo_nakup_prumkc =  isNaN(p) ? 0 : Math.round(p*100) / 100 ;
       }
       
       if (this.cauto.lpg){            
            p = this.vykaz.lpg_palivo_nakup_kc == 0 || this.vykaz.lpg_palivo_nakup_l == 0 ? NaN : this.vykaz.lpg_palivo_nakup_kc / this.vykaz.lpg_palivo_nakup_l;
            this.vykaz.lpg_palivo_nakup_prumkc =  isNaN(p) ? 0 : Math.round(p*100) / 100 ;  
       }

       if(this.cauto.kwh){            
        p = this.vykaz.kwh_nabijeni_kc == 0 || this.vykaz.kwh_nabijeni == 0 ? NaN : this.vykaz.kwh_nabijeni_kc / this.vykaz.kwh_nabijeni;
        this.vykaz.kwh_nabijeni_prumkc =  isNaN(p) ? 0 : Math.round(p*100) / 100 ;  
       }

       this.calcSpotrebaPHM();                
       this.calcPrumSpotreba();            
    }
    
    
    calcPrumSpotreba(){        
        var l;

        if (this.cauto.diesel){
            l =  this.vykaz.diesel_palivo_nakup_l + this.vykaz.diesel_poc_stav_l - parseFloat(AppLibrary.formatNumber(this.vykaz.diesel_kon_stav_l));
            if(l <=  0 || this.vykaz._tmp_diesel_km == 0) {
                this.vykaz.diesel_prum_spotreba = 0;    
            }
            else{
                this.vykaz.diesel_prum_spotreba = Math.round((l / this.vykaz._tmp_diesel_km) * 10000) / 100;           
            }
        }
        
        if (this.cauto.natural){
            l =  this.vykaz.natural_palivo_nakup_l + this.vykaz.natural_poc_stav_l - parseFloat(AppLibrary.formatNumber(this.vykaz.natural_kon_stav_l));
            if(l <=  0 || this.vykaz._tmp_natural_km == 0) {
                this.vykaz.natural_prum_spotreba = 0;    
            }
            else{
                this.vykaz.natural_prum_spotreba = Math.round((l / this.vykaz._tmp_natural_km) * 10000) / 100;           
            }
        }
        
        if (this.cauto.lpg){
            l =  this.vykaz.lpg_palivo_nakup_l + this.vykaz.lpg_poc_stav_l - parseFloat(AppLibrary.formatNumber(this.vykaz.lpg_kon_stav_l));
            if(l <=  0 || this.vykaz._tmp_lpg_km == 0) {
                this.vykaz.lpg_prum_spotreba = 0;    
            }
            else{
                this.vykaz.lpg_prum_spotreba = Math.round((l / this.vykaz._tmp_lpg_km) * 10000) / 100;           
            }
        }
        

        if (this.cauto.kwh){
            l =  this.vykaz.kwh_nabijeni + this.vykaz.kwh_pocatecni_stav - parseFloat(AppLibrary.formatNumber(this.vykaz.kwh_konecny_stav));
            if(l <=  0 || this.vykaz._tmp_kwh_km == 0) {
                this.vykaz.kwh_prum_spotreba = 0;    
            }
            else{
                this.vykaz.kwh_prum_spotreba = Math.round((l / this.vykaz._tmp_kwh_km) * 10000) / 100;           
            }
        }
    

    }
   
    
    
    getWeekDay(d:Date){                
        var dd = d.getDay() -1; 
        dd = dd < 0 ? 6 : dd;        
        return AppLibrary.dnyTyden[dd];
    }
    
    formatDay(d:Date){
        return d.getDate()+'. ' + (d.getMonth()+1)+'.';
    }
    
    
    saveme(){        
        
        this.inProgress = true;
        this.response.kod = 0;
        this.response.nazev = 'Zpracovávám data...';

        this.vykaz.rok = this.datum.getFullYear();
        this.vykaz.mesic = this.datum.getMonth()+1; //javascript mesic zacina 0
        
        for(var i=0; i < this.vykaz.list.length; ++i){                         
            try{
                if(!this.vykaz.list[i].diesel && !this.vykaz.list[i].lpg && !this.vykaz.list[i].natural && !this.vykaz.list[i].kwh){                      
                    this.vykaz.list[i].setPalivo(this.cauto.def_palivo);                
                }   
            }catch(ex) {}         
        }
        
        var t = this;
        this.cestakService.updateMesicniSumar(this.vykaz).then(function(resp: Response){
             t.inProgress = false;                          
             t.vykaz = resp.data;                          
        });        
    }
    
    newone(){
        this.edit(-1);
    }

    
    edit(id:number){
        this.cestakService.getMesicniVykaz(id).then((j: AutoVykazSumar) => {
            this.detail = j
            this.calcStatistika();
        });
    }
    
    dropme(){        
        this.cestakService.dropReportVykaz(this.vykaz).then(response => this.asyncDropResponse(response));            
    }
        
    asyncDropResponse(resp: Response){
        
        this.response = resp;        
        if (resp.kod == 0){
            this.edit(-1);
        }        
    }


    pocStavChanged(){
        
        this.vykaz.kon_stav = parseInt(this.vykaz.poc_stav+'');
                
        for(var i=0; i < this.vykaz.list.length; ++i){    
            this.vykaz.kon_stav += parseInt(this.vykaz.list[i].km + '') + parseInt(this.vykaz.list[i].km_private + '');  
        }
        
    }
    
    
    
    headerTableFixed(){
        
        jQuery(function(){
            
            if(!jQuery("#tab-data").offset()){
                return;
            }

            var tableOffset = jQuery("#tab-data").offset().top;
            var header = jQuery("#tab-data > thead").clone();
            var fixedHeader = jQuery("#header-fixed").append(header);
            
            jQuery(window).bind("scroll", function() {
                var offset = jQuery(this).scrollTop();

                if (offset >= tableOffset && fixedHeader.is(":hidden")) {
                    var w = jQuery("#tab-data").width();
                    jQuery("#header-fixed").width(w+10);
                    jQuery('#tab-data > thead th').each(function(index){
                        jQuery("th:eq("+index+")",fixedHeader).css( 'width', jQuery(this).outerWidth(true));                
                    });
                    fixedHeader.show();
                }
                else if (offset < tableOffset) {
                    fixedHeader.hide();
                }
            });    
            
        });
        
        
    }
    
    changeKm(ev: any, row: any){        
        row.km = parseInt(AppLibrary.formatNumber(row.km));        
        this.calcStatistika();
    }
    
    changeKmPrivate(ev: any, row: any){            
        row.km_private = parseInt(AppLibrary.formatNumber(row.km_private));
        this.calcStatistika();
    }
    
    changePocStavL_Natural(ev:any){        
        this.vykaz.natural_poc_stav_l = parseFloat(AppLibrary.formatNumber(this.vykaz.natural_poc_stav_l));
        this.calcStatistika();
    }
    
    changeKonStavL_Natural(ev:any){
        this.vykaz.natural_kon_stav_l = parseFloat(AppLibrary.formatNumber(this.vykaz.natural_kon_stav_l));
        this.calcPrumSpotreba();
    }
    
    changePocStavL_Diesel(ev:any){        
        this.vykaz.diesel_poc_stav_l = parseFloat(AppLibrary.formatNumber(this.vykaz.diesel_poc_stav_l));
        this.calcStatistika();
    }
    
    changeKonStavL_Diesel(ev:any){
        this.vykaz.diesel_kon_stav_l = parseFloat(AppLibrary.formatNumber(this.vykaz.diesel_kon_stav_l));
        this.calcPrumSpotreba();
    }
    
    
    changePocStavL_LPG(ev:any){        
        this.vykaz.lpg_poc_stav_l = parseFloat(AppLibrary.formatNumber(this.vykaz.lpg_poc_stav_l));
        this.calcStatistika();
    }
    
    changeKonStavL_LPG(ev:any){
        this.vykaz.lpg_kon_stav_l = parseFloat(AppLibrary.formatNumber(this.vykaz.lpg_kon_stav_l));
        this.calcPrumSpotreba();
    }

    changePocStav_KWH(ev:any){        
        this.vykaz.kwh_pocatecni_stav = parseFloat(AppLibrary.formatNumber(this.vykaz.kwh_pocatecni_stav));
        this.calcStatistika();
    }
    
    changeKonStav_KWH(ev:any){
        this.vykaz.kwh_konecny_stav = parseFloat(AppLibrary.formatNumber(this.vykaz.kwh_konecny_stav));
        this.calcPrumSpotreba();
    }

    
    changeTankovaniKc(ev:any, row:any){        
        row.tankovanikc = parseFloat(AppLibrary.formatNumber(row.tankovanikc));
        this.calcStatistika();
    }
    
    changeTankovaniL(ev:any, row:any){        
        row.tankovanil = parseFloat(AppLibrary.formatNumber(row.tankovanil));
        this.calcStatistika();
    }

    
    calcSpotrebaPHM(){
        var phm_d = this.vykaz.diesel_poc_stav_l;
        var phm_n = this.vykaz.natural_poc_stav_l;
        var phm_l = this.vykaz.lpg_poc_stav_l;
        var phm_kwh =  this.vykaz.kwh_pocatecni_stav;
        var ps = this.cauto.prum_spotreba;
        
        var p : any;
        for(var i=0; i < this.vykaz.list.length; ++i){           
            p = this.vykaz.list[i];       
            
            if(p.diesel){
                phm_d += p.tankovanil;      
                this.vykaz.list[i]._tmp_phm = phm_d - (Math.round( ((parseInt(p.km+'') + parseInt(p.km_private+''))/100  * ps) * 10) / 10) ; 
                this.vykaz.list[i]._tmp_phm =   Math.round(this.vykaz.list[i]._tmp_phm * 10) / 10;                             
                phm_d = this.vykaz.list[i]._tmp_phm;
            }
            else if(p.natural){
                phm_n += p.tankovanil;      
                this.vykaz.list[i]._tmp_phm = phm_n - (Math.round( ((parseInt(p.km+'') + parseInt(p.km_private+''))/100  * ps) * 10) / 10) ; 
                this.vykaz.list[i]._tmp_phm =   Math.round(this.vykaz.list[i]._tmp_phm * 10) / 10;                             
                phm_n = this.vykaz.list[i]._tmp_phm;
            }
            else if(p.lpg){
                phm_l += p.tankovanil;                          
                this.vykaz.list[i]._tmp_phm = phm_l - (Math.round( ((parseInt(p.km+'') + parseInt(p.km_private+''))/100  * ps) * 10) / 10) ; 
                this.vykaz.list[i]._tmp_phm =   Math.round(this.vykaz.list[i]._tmp_phm * 10) / 10;                             
                phm_l = this.vykaz.list[i]._tmp_phm;
            }
            else if(p.kwh){
                phm_kwh += p.tankovanil;                          
                this.vykaz.list[i]._tmp_phm = phm_kwh - (Math.round( ((parseInt(p.km+'') + parseInt(p.km_private+''))/100  * ps) * 10) / 10) ; 
                this.vykaz.list[i]._tmp_phm =   Math.round(this.vykaz.list[i]._tmp_phm * 10) / 10;                             
                phm_kwh = this.vykaz.list[i]._tmp_phm;
            }
            
        }
        
        this.vykaz.diesel_kon_stav_l = phm_d;
        this.vykaz.natural_kon_stav_l = phm_n;
        this.vykaz.lpg_kon_stav_l = phm_l;
        this.vykaz.kwh_konecny_stav = phm_kwh;
    }
    
    
    changeOstatniVydajeKc(ev:any, row:any){        
        row.ovydkc = parseFloat(AppLibrary.formatNumber(row.ovydkc));
        this.calcStatistika();

    }
    
    addRow(index:number){        
        
        var v = new AutoVykaz();        
        var e  = this.vykaz.list[index];        
        
        v.datum = e.datum;
        v.natural = e.natural;
        v.diesel = e.diesel;
        v.lpg = e.lpg;
        v.kwh = e.kwh;
        v.poradi = index + 1;        
        
        this.vykaz.list.splice(index+1, 0, v);
        for(var i=v.poradi+1; i < this.vykaz.list.length; ++i){            
            if(v.datum != this.vykaz.list[i].datum){
                break;
            }
            
            this.vykaz.list[i].poradi = i;
        }
        
        
        this.ngAfterViewInit();
    }
    
    dropRow(index:number){
                
        var datum = this.vykaz.list[index].datum;
        this.vykaz.list.splice(index, 1); 
        
        for(var i=index-1; i < this.vykaz.list.length; ++i){            
            if(datum != this.vykaz.list[i].datum){
                break;
            }
            
            this.vykaz.list[i].poradi = i;
        }
               
        this.calcStatistika();
        this.ngAfterViewInit();
    }
    
    autocomplete(){
        this.saveme();
        //this.router.navigate(['cestak/auto/vykaz/autocomplete']);

        const url = this.router.serializeUrl(
            this.router.createUrlTree(['cestak/auto/vykaz/autocomplete'])
        );

        window.open(url, '_blank');    

    }
    
    autocomplCestaChange(ev:any, idx:number){
        
        if(ev == null){
            return;
        }
        
        for(var i=0; i < this.lstcesta.length; i++){

            if (ev.toLowerCase().localeCompare(this.lstcesta[i].cesta.toLowerCase()) == 0){
                    
                this.vykaz.list[idx].km = this.lstcesta[i].km;
                this.vykaz.list[idx].km_private = this.lstcesta[i].km_private;                
                break;                
            }
            
        }
        
        this.calcStatistika(); 
    }
    
    printme(){

        var recid = this.vykaz.id;
                
        this._printIDRec = Array();
        this._printIDRec.push(recid);
        
        this.cestakService.getPrintReports(this._urlrec).then((list: ReportPrint[]) => {
            this._printList = list;
            this._showPrintPopup = false;

            if(list && list.length > 1){
                this._showPrintPopup = true;
            }
            else if(list && list.length > 0){
                this.printReport(list[0].id);
            }

        });        


    }


    printReport(id:number){
        this.cestakService.printReport(this._printIDRec, id);
    }
}