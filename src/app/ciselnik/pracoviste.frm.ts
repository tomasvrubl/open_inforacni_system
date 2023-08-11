import { Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Pracoviste } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/pracoviste.frm.html',
  providers: []
})

export class PracovisteForm implements OnInit  { 

    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() isSelector : boolean = false;
    @Input() pracoviste: Pracoviste;
    
    constructor(private cisService: CiselnikService, private route: ActivatedRoute) {              
        this.pracoviste = null;
    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getPracoviste(+params['id']);
        })).subscribe((rec: Pracoviste) => {

            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }


            this.pracoviste = rec;
        });      
             
    }    
    
  
}