import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Zdroj } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/zdroj.frm.html',
  providers: []
})

export class ZdrojForm implements OnInit  { 

    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() isSelector : boolean = false;
    @Input() zdroj: Zdroj = null;
    
    constructor(private cisService: CiselnikService,
                private route: ActivatedRoute) {              

    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getZdroj(+params['id']);
        })).subscribe((rec: Zdroj) => {

            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }
            
            this.zdroj = rec;
        });      
             
    }    
    
  
}