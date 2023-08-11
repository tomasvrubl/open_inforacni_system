import { Component,  Input, Output, EventEmitter } from '@angular/core';
import { Auto } from './_obj/cestak';
import { CestakService } from './_services/cestak.service';
import { Response, iDetail, UserService, TableQuery, TabFilter } from '../core/module';
import { OsobaListComponent } from '../person/module';

declare var AppLibrary : any;

@Component({
  selector: 'auto-detail',
  templateUrl : './_view/auto.html'
})

export class AutoDetail implements iDetail { 

    response : Response;  
    _osobaList: any = OsobaListComponent;
    
    _det: Auto;
    
    @Output() autoChanged = new EventEmitter();
    
    constructor(private cestakService: CestakService, private userService: UserService) {      
        
        this._det = new Auto();            
        this.response = new Response();        
    }
    
    @Input() 
    set detail(val : Auto){
        
        if(val == null){
            this._det = new Auto();
        }
        else{
            this._det = val;
        }            
        
    } 
        
    get detail(): Auto {
        return this._det;
    }
  
    saveme() {

       this.cestakService.updateAuto(this._det).then((response :Response) =>  {
            this.response = response;
            this._det = response.data;
            this.autoChanged.emit(this);
        });  
   
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.cestakService.getAuto(id).then((j: Auto) => this._det = j);
    }
    
    
    dropme(){        
        this.cestakService.dropAuto(this._det).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.cestakService.getAuto(-1).then((j: Auto) => this._det = j).then(()=>this.autoChanged.emit(this));            
            }  
        });            
    }
 
 
    changeSpotreba(event:any){
        this._det.prum_spotreba = AppLibrary.formatNumber(this._det.prum_spotreba);
    }   

    changeSpotrebaKWH(event:any){
        this._det.kwh_spotreba = AppLibrary.formatNumber(this._det.kwh_spotreba);
    }   


    

    onOsobaChanged(ev: any){      
        if(ev == null){
            this._det.osoba_id = -1;
            this._det.osoba_oscislo = '';
            this._det.osoba = '';
        }
        else{
            this._det.osoba_id = ev.id;
            this._det.osoba_oscislo = ev.oscislo;
            this._det.osoba = ev.prijmeni + ' ' + ev.jmeno;
        }
        
    }
}