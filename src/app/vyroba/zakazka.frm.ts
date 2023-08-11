import { Component, Input, OnInit, NgModule} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Zakazka } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';


@Component({
  templateUrl : './_view/zakazka.frm.html',
  providers: []
})

export class ZakazkaForm implements OnInit  { 

    @Input() isSelector : boolean = false;
    @Input() zakazka: Zakazka = null;
    
    constructor(private vyrService: VyrobaService,
                private route: ActivatedRoute) {                              
    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.vyrService.getZakazka(+params['id']);
        })).subscribe((zakazka: Zakazka) => this.zakazka = zakazka);      
             
    }    
    
  
}