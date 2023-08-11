import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PersPracKategorie } from './_obj/person';
import { PersonService } from './_services/person.service';


@Component({
  templateUrl : './_view/prackat.frm.html',
  providers: []
})

export class PersPracKategorieForm implements OnInit  { 

    @Input() isSelector : boolean = false;
    @Input() detail: PersPracKategorie;
    
    constructor(private serv: PersonService,
                private route: ActivatedRoute) {              
                
        this.detail = null;
    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getPracovniKategorie(+params['id']);
        })).subscribe((rec: PersPracKategorie) => this.detail = rec);      
             
    }    
     
}