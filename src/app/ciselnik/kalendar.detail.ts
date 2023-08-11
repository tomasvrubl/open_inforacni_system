import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Kalendar, KalendarSmena } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { iDetail, Response } from '../core/module';

@Component({
  selector: 'kalendar-detail',
  templateUrl : './_view/kalendar.detail.html',
  providers: [ ]
})

export class KalendarDetail implements iDetail, OnInit { 

    response : Response;  
    isSeznamSmen: boolean = true; 
    _kalendar : Kalendar;   
    smena: KalendarSmena;

    

    constructor(private cisService: CiselnikService, private route: ActivatedRoute, private router: Router) {              
        this._kalendar = new Kalendar();            
        this.response = new Response(); 
        this.smena = new KalendarSmena();
    }
    

    @Input() 
    set detail(val : Kalendar){
        
        if(val == null){
            this._kalendar = new Kalendar();
        }
        else{
            this.cisService.getKalendar(val.id).then((j: Kalendar) => this._kalendar = j);   
        }            
        
    } 
        
    
    get detail(): Kalendar{
        return this._kalendar;
    }


    
    ngOnInit(): void {
    
        this.route.params.pipe(switchMap((params: Params) => { 
            
            if(!params['idc']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getSmena(+params['idc']);
        })).subscribe((smena: KalendarSmena) => {
            if(smena != null){
                this.smena = smena;
                this.isSeznamSmen = false;                
            }
        });    
        
    }        
  
    
    newone(){
       this.edit(-1);
    }

    saveme() {
        this.cisService.updateKalendar(this.detail).then(response => this.asyncSaveResponse(response));        
     }
    
    dropme(){        
        this.cisService.dropKalendar(this.detail).then(response => this.asyncDropResponse(response));            
    }

    edit(id:number){
        this.cisService.getKalendar(id).then((j: Kalendar) => this._kalendar = j);
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this.cisService.getKalendar(-1).then((j: Kalendar) => this._kalendar = j);            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this.detail = resp.data;
    }
  
    dateChange(ev: any){
        console.log(ev);
    }
    
    
    
    
}