import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Kalendar } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/kalendar.frm.html',
  providers: []
})

export class KalendarForm implements OnInit  { 

    _showDetail: boolean = false;
    _showList : boolean = false;
    @Input() isSelector : boolean = false;
    @Input() kalendar: Kalendar;
    
    constructor(private cisService: CiselnikService,
                private route: ActivatedRoute) {              
                
        this.kalendar = null;
    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.cisService.getKalendar(+params['id']);
        })).subscribe((rec: Kalendar) => {

            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }
            

            this.kalendar = rec;
        });      
             
    }    
    
  
}