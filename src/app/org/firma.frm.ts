import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Firma } from './_obj/firma';
import { OrganizaceService } from './_services/organizace.service';


@Component({
  templateUrl : './_view/firma.frm.html',
  providers: []
})

export class FirmaForm implements OnInit  { 

    
    _showSestavy: boolean = false;
    @Input() isSelector : boolean = false;
    @Input() detail: Firma = null;
    
    constructor(private serv: OrganizaceService,
                private route: ActivatedRoute) {              
                
    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getFirma(+params['id']);
        })).subscribe((rec: Firma) => this.detail = rec);      

        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
             
    }    
     


}