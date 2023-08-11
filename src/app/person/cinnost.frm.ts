import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PersPracCinnost } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';


@Component({
  templateUrl : './_view/cinnost.frm.html',
  providers: []
})

export class PersCinnostForm implements OnInit  { 

    @Input() isSelector : boolean = false;
    @Input() rec: PersPracCinnost;
    
    constructor(private serv: ProhlidkyService,
                private route: ActivatedRoute) {              
                
        this.rec = null;
    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getPracCinnost(+params['id']);
        })).subscribe((rec: PersPracCinnost) => this.rec = rec);      
             
    }    
     
}