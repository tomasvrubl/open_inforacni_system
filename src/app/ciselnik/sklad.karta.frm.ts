import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SkladKarta, Sklad } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/sklad.karta.frm.html',
  providers: []
})

export class SkladKartaForm implements OnInit  { 

    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() karta: SkladKarta = null;
    sklad: Sklad = new Sklad();
    
    constructor(private cisService: CiselnikService,
                private route: ActivatedRoute) {                              
    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(params['skladid']){      
                this.cisService.getSklad(+params['skladid']).then((sklad : Sklad) => {                
                    this.sklad = sklad;
                });
            }
            
            
            if(!params['id']){                   
                return Promise.resolve(null);
            }
            
            return this.cisService.getSkladKarta(+params['id']);
        })).subscribe((karta: SkladKarta) => this.karta = karta);      
             
    }    
    
}