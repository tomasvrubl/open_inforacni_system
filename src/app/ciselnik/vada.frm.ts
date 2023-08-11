import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Vada } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/vada.frm.html',
  providers: []
})

export class VadaForm implements OnInit  {
     
    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() isSelector : boolean = false;
    @Input() vada: Vada = null;
    
    constructor(private cisService: CiselnikService,
                private route: ActivatedRoute) {                              
    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getVada(+params['id']);
        })).subscribe((rec: Vada) => {

            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }

            this.vada = rec;
        });      
             
    }    
    
  
}