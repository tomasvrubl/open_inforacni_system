import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Odmena } from './_obj/person';
import { PersonService } from './_services/person.service';


@Component({
  templateUrl : './_view/odmena.frm.html',
  providers: []
})

export class OdmenaForm implements OnInit  { 

    _showSestavy: boolean = false;
    @Input() isSelector : boolean = false;
    @Input() detail: Odmena = null;
    
    constructor(private srv: PersonService,
                private route: ActivatedRoute) {                              

    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.srv.getOdmena(+params['id']);
        })).subscribe((r: Odmena) => this.detail = r);      
             
    }    
    
  
}