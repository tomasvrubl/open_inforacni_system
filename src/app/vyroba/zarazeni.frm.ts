import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { VyrZarazeni } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';


@Component({
  templateUrl : './_view/zarazeni.frm.html',
})

export class VyrZarazeniForm implements OnInit  { 

    _showSestavy: boolean = false;
    @Input() isSelector : boolean = false;
    @Input() detail: VyrZarazeni = null;
    
    constructor(private serv: VyrobaService, private route: ActivatedRoute) { 
                
    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getZarazeni(+params['id']);
        })).subscribe((r: VyrZarazeni) => this.detail = r);    
        
        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
             
    }    
    
  
}