import { Component, Input, ViewChild} from '@angular/core';
import { ObjMaterial, ObjMaterialPol } from './_obj/organizace';
import { OrganizaceService } from './_services/organizace.service';
import { iDetail, Response, TableQuery, TabFilter, AttachmentForm } from '../core/module';
import * as moment from 'moment';
import { OsobaListComponent } from '../person/module';
import { PracovisteListComponent } from '../ciselnik/pracoviste.list';
import { FirmaList } from './firma.list';


@Component({
  selector: 'objmaterial-detail',
  templateUrl : './_view/objmat.detail.html',
  providers: [ ]
})


export class ObjMaterialDetail implements iDetail { 
    

    @ViewChild('attach') lst : AttachmentForm;

    response : Response;      
    _obj : ObjMaterial;   
    _osobaList: any = OsobaListComponent;
    _pracovisteList: any = PracovisteListComponent;
    _firmaList: any = FirmaList;

    _schvaluje: boolean = false;
    _showSchval: boolean = false;
    _showObjednano: boolean = false;

    constructor(private serv: OrganizaceService) {              
        this._obj = new ObjMaterial();            
        this.response = new Response();         

        this._schvaluje = this.serv.isAllowed('organizace', 'obj-mat', 'grant-schvalovat');
        this._showObjednano = this.serv.isAllowed('organizace', 'obj-mat', 'grant-objednano');
    }
    

    @Input() 
    set detail(val : ObjMaterial){
        
        if(val == null){
            this._obj = new ObjMaterial();
        }
        else{
            this.edit(val.id);            
        }            
        
    } 
        
    
    get detail(): ObjMaterial{
        return this._obj;
    }

    copy(){
        this._obj.id = -1;       
        this._obj.stav = 0;
        this._obj.datum = moment().toDate();
        for(var i=0; i < this._obj.polozky.length; ++i){
            this._obj.polozky[i].id = -1;
            this._obj.polozky[i].stav = 0;
        }

    }

    newone(){

       this.edit(-1);
    }

    saveme() {
        this.serv.updateObjMaterialu(this.detail).then(response => this.asyncSaveResponse(response));        
     }
    
    dropme(){        
        this.serv.dropObjMaterialu(this.detail).then(response => this.asyncDropResponse(response));            
    }

    dropPol(i:any){
        this._obj.polozky.splice(i, 1);
    }

    edit(id:number){
        this.serv.getObjMaterialu(id).then((j: ObjMaterial) => {
           // debugger;
            this._obj = j
           // this.lst.reloadData();
            this._showSchval = this._schvaluje && j.id > -1 && j.stav == 1;
        });
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this.edit(-1);            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this._obj = resp.data;
        this._showSchval = this._schvaluje && this._obj.id > -1 && this._obj.stav == 1;
    }
  
    dateChange(ev: any){
       // console.log(ev);
    }

    
    
    onPracovisteChanged(ev: any){      
        if(ev == null){
            this._obj.pracoviste_id = -1;
            this._obj.pracoviste_kod = '';
            this._obj.pracoviste_nazev = '';            
        }
        else{
            this._obj.pracoviste_kod = ev.kod;
            this._obj.pracoviste_nazev = ev.nazev;
            this._obj.pracoviste_id = ev.id;
        }
        
    }

    onPracovisteRowChanged(ev: any, r: ObjMaterialPol){
    
        if(ev == null){
            r.pracoviste_kod = '';
            r.pracoviste_nazev = '';
            r.pracoviste_id = -1;
        }
        else{
            r.pracoviste_kod = ev.kod;
            r.pracoviste_nazev = ev.nazev;
            r.pracoviste_id = ev.id;
        }
        
    }



    onFirmaRowChanged(ev: any, r: ObjMaterialPol){
        
        if(ev == null){
            r.firma_id = -1;
            r.firma_nazev = '';
            r.firma_adresa = '';
        }
        else{
            r.firma_id = ev.id;
            r.firma_nazev = ev.nazev;        
            r.firma_adresa = ev.adresa;
        }
        
    }


    recalcCelkem(){

        var celkem =  0;
        var p = this._obj.polozky;
        for(var i=0; i < p.length; ++i){
            celkem += p[i].cena * p[i].mnozstvi;
        }

        this._obj.cena_celkem = celkem;
    }



    onOsobaChanged(ev: any){      
       // console.log('onOsobaChanged() -- start')
        if(ev == null){
            this._obj.objednal = -1;
            this._obj.objednal_oscislo = '';
            this._obj.objednal_osoba = '';
        }
        else{
            this._obj.objednal = ev.id;
            this._obj.objednal_oscislo = ev.oscislo;
            this._obj.objednal_osoba = ev.prijmeni + ' ' + ev.jmeno;
             
        }

        //console.log(this._obj);
        //console.log('onOsobaChanged() -- end')           
    }

    
    addPol(){

        var pol = new ObjMaterialPol();

        pol.pracoviste_kod = this._obj.pracoviste_kod;
        pol.pracoviste_nazev = this._obj.pracoviste_nazev;
        pol.pracoviste_id = this._obj.pracoviste_id;

        this._obj.polozky.push(pol);

    }

    saveObjPolObjednano(r:ObjMaterialPol){
        this.serv.sendObjMaterialuPolObjednano(r.id, r.objednano).then(resp => this.response = resp);
    }


    getPolozkaStav(r:any){

        if(r.stav == 1){
            return "Zamítnuto";
        }
        
        return "Schváleno";
    }

    stavObjednavky(){

        var v = "chyba";
        switch(this._obj.stav){

            case 1:
                v = "Čeká na schválení";
                break;
            
            case 2:
                v = "Odsouhlašena";
                break;
            case 3:
                v = "Objednáno";
                break;

            default:
                v = "Vytvořena";
                break;
        }

        return v;

    }

    //poslat pozadavek ke schvaleni
    sendSchvalit(){       

        this._obj.stav = 1; //nastav priznak ke schvaleni
        this.serv.sendSchvaleniObjMaterialu(this.detail).then(response => this.asyncSaveResponse(response))
    }


    //Odsouhlasit a poslat k objednani
    odsouhlasit(){
        this._obj.stav = 2
        this.serv.sendOdsouhlaseniObjMaterialu(this.detail).then(response => this.asyncSaveResponse(response))

    }
    
    vratitNazpet(){
        this._obj.stav = 0
        this.serv.sendVraceniObjMaterialu(this.detail).then(response => this.asyncSaveResponse(response))
    }

    sendObjednano(){
        this.serv.sendObjednanoObjMaterialu(this.detail).then(response => this.asyncSaveResponse(response))
    }

}