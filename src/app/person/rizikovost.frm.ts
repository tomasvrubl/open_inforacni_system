import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PersRizikovost } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';


@Component({
  templateUrl : './_view/rizikovost.frm.html',
  providers: []
})

export class PersRizikovostForm implements OnInit  { 

    @Input() isSelector : boolean = false;
    @Input() rec: PersRizikovost;
    
    constructor(private serv: ProhlidkyService,
                private route: ActivatedRoute) {              
                
        this.rec = null;
    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getPersRizikovost(+params['id']);
        })).subscribe((rec: PersRizikovost) => this.rec = rec);      
             
    }    
     
}