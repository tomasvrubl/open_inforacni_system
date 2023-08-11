import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Sklad } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/sklad.frm.html',
  providers: []
})

export class SkladForm implements OnInit  { 

    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() isSelector : boolean = false;
    @Input() sklad: Sklad;
    
    constructor(private cisService: CiselnikService,
                private route: ActivatedRoute) {                              
        this.sklad = null;
    }
    
    ngOnInit(): void { 

        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getSklad(+params['id']);
        })).subscribe((rec: Sklad) => {

            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }

            this.sklad = rec;
        });      
             
    }    
    
  
}