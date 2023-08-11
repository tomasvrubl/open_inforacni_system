import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Operace } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/operace.frm.html',
  providers: []
})

export class OperaceForm implements OnInit  { 

    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() isSelector : boolean = false;
    @Input() rec: Operace;
    
    constructor(private cisService: CiselnikService,
                private route: ActivatedRoute) {              
                
        this.rec = null;
    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getOperace(+params['id']);
        })).subscribe((rec: Operace) =>{

            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }

            this.rec = rec
        });      
             
    }    
     
}