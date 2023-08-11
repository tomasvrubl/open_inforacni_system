import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Auto } from './_obj/cestak';
import { CestakService } from './_services/cestak.service';

@Component({
    templateUrl : './_view/auto.frm.html'
})

export class AutoForm implements OnInit { 

    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() isSelector : boolean = false;
    @Input() detail: Auto = null;

    constructor(private cestakService: CestakService, 
                private route: ActivatedRoute) {              
                
        
    }
    
        
    ngOnInit(): void { 
    
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cestakService.getAuto(+params['id']);
        })).subscribe((rec: Auto) => {

            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }

            this.detail = rec;  

        } );        
    }  
    
}