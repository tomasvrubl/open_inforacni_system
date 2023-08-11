import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Odvadeni } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';


@Component({
  templateUrl : './_view/odvadeni.frm.html',
  providers: []
})

export class OdvadeniForm implements OnInit  { 

    @Input() isSelector : boolean = false;
    @Input() odvadeni: Odvadeni;
    
    constructor(private vyrService: VyrobaService,
                private route: ActivatedRoute) {                              
        this.odvadeni = null;
    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.vyrService.getOdvadeni(+params['id']);
        })).subscribe((odvadeni: Odvadeni) => this.odvadeni = odvadeni);      
             
    }    
    
  
}