import { Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { KalendarSmena } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { iDetail, Response } from '../core/module';

@Component({
  selector: 'kalendar-smena',
  templateUrl : './_view/kalendar-smena.detail.html',
  providers: [ ]
})

export class KalendarSmenaDetail implements iDetail, OnInit { 

    response : Response;  
    _smena : KalendarSmena;    
    @Input() kalendarid : number = -1;
    @Output() smenaChanged = new EventEmitter();

    constructor(private cisService: CiselnikService, private route: ActivatedRoute) {              
        this._smena = new KalendarSmena();            
        this.response = new Response();    
    }


    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['idc']){                   
                return Promise.resolve(null);
            }

            this.kalendarid = +params['id'];
            return this.cisService.getSmena(+params['idc']);
        })).subscribe((smena: KalendarSmena) => { this._smena = smena; });      
             
    }    
    

    @Input() 
    set detail(val : KalendarSmena){
        
        if(val == null){
            this._smena = new KalendarSmena();
            this._smena.kalendar_id = this.kalendarid;        
        }
        else{
            this._smena = val;
            this.kalendarid = val.kalendar_id;
        }            

        
    } 
        
    get detail(): KalendarSmena {
        return this._smena;
    }


    onSubmit() {}

    saveme() {

        this._smena.kalendar_id = this.kalendarid;
        this.cisService.updateSmena(this._smena).then((response :Response) =>  {
            this.response = response;
            this._smena = response.data;
            this.smenaChanged.emit(this);
       });  
     
    }
    
    newone(){
        this.cisService.getSmena(-1).then((j: KalendarSmena) => {this._smena = j;
            this._smena.kalendar_id = this.kalendarid;
        });
    }

    edit(id:number){
        this.cisService.getSmena(id).then((j: KalendarSmena) => {
            this._smena = j;
            this.kalendarid = this._smena.kalendar_id;
        });
    }
    

    dropme(){        
       this.cisService.dropSmena(this._smena).then(response => this.asyncDropResponse(response));            
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;        
        if (resp.kod == 0){
            this.cisService.getSmena(-1).then((j: KalendarSmena) => {this._smena = j});            
        }        
    }
    
    asyncSaveResponse(resp: Response){    
        this.response = resp;
        this._smena = resp.data;
    }
     
}