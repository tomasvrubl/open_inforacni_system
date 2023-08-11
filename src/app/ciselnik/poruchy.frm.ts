import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MernaJednotka, Porucha } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';


@Component({
  templateUrl : './_view/poruchy.frm.html',
})

export class PoruchyForm implements OnInit  { 

    urlrec : string = '/ciselnik/poruchy';

    _showSestavy: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() isSelector : boolean = false;
    @Input() detail: Porucha = null;
    
    constructor(private srv: CiselnikService, private route: ActivatedRoute) {    

    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id']){           
                return Promise.resolve(null);
            }
                        
            return this.srv.getPorucha(+params['id']);
        })).subscribe((rec: Porucha) => {
            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }
            
            this.detail = rec;            
        });      

        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
       
    }    
     
}