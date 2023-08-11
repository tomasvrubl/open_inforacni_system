import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { VyrZapisSmeny } from './_obj/vyroba';
import { VyrobaService } from './_services/vyroba.service';


@Component({
  templateUrl : './_view/zapis-smeny.frm.html',
})

export class VyrZapisSmenyForm implements OnInit  { 

    _showSestavy: boolean = false;
    @Input() isSelector : boolean = false;
    @Input() detail: VyrZapisSmeny = null;
    
    constructor(private serv: VyrobaService, private route: ActivatedRoute) { 
                
    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getZapisSmeny(+params['id']);
        })).subscribe((r: VyrZapisSmeny) => this.detail = r);    
        
        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
             
    }    
    
  
}