import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MernaJednotka } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/jednotky.frm.html',
})

export class JednotkyForm implements OnInit  { 

    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() isSelector : boolean = false;
    @Input() detail: MernaJednotka = null;
    
    constructor(private cisService: CiselnikService, private route: ActivatedRoute) {                              
        
    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getJednotka(+params['id']);
        })).subscribe((r: MernaJednotka) => {
            if(r == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }
            

            this.detail = r
        });      
             
    }    
    
  
}