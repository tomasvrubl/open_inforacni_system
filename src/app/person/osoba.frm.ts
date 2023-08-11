import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PersonService } from './_services/person.service';
import { Osoba} from '../core/module';

@Component({
  templateUrl : './_view/osoba.frm.html',
  providers: []
})

export class OsobaForm implements OnInit  { 
    
    _showSestavy: boolean = false;
    @Input() isSelector : boolean = false;
    @Input() detail: Osoba = null;
    
    constructor(private serv: PersonService,
                private route: ActivatedRoute) {              
                
    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getOsoba(+params['id']);
        })).subscribe((osoba: Osoba) => this.detail = osoba);    
        
        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
             
    }    
    
  
}