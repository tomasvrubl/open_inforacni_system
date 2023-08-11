import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HlaseniService} from './_services/hlaseni.service';
import { HlaseniTyp} from './_obj/hlaseni'



@Component({
  templateUrl : './_view/hlaseni.typ.frm.html',
  providers: []
})

export class HlaseniForm implements OnInit  { 

    @Input() isSelector : boolean = false;
    @Input() typ: HlaseniTyp;
    
    constructor(private serv: HlaseniService,
                private route: ActivatedRoute) {                              
        this.typ = null;
    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getHlaseniTyp(+params['id']);
        })).subscribe((typ: HlaseniTyp) => this.typ = typ);      
             
    }    
    
  
}