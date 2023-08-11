import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PersSkupina } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';


@Component({
  templateUrl : './_view/skupina.frm.html',
  providers: []
})

export class PersSkupinaForm implements OnInit  { 

    @Input() isSelector : boolean = false;
    @Input() rec: PersSkupina;
    
    constructor(private serv: ProhlidkyService,
                private route: ActivatedRoute) {              
                
        this.rec = null;
    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getPersSkupina(+params['id']);
        })).subscribe((rec: PersSkupina) => this.rec = rec);      
             
    }    
     
}