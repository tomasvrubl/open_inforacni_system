import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ZapisPoruchy } from './_obj/udrzba';
import { UdrzbaService } from './_services/udrzba.service';


@Component({
  templateUrl : './_view/zapis-poruchy.frm.html',
})

export class ZapisPoruchyForm implements OnInit  { 

    urlrec : string = '/udrzba/hlaseni-poruchy';

    _showSestavy: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() isSelector : boolean = false;
    @Input() detail: ZapisPoruchy = null;
    
    constructor(private srv: UdrzbaService, private route: ActivatedRoute) {    

    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id']){           
                return Promise.resolve(null);
            }
                        
            return this.srv.getZapisPoruchy(+params['id']);
        })).subscribe((rec: ZapisPoruchy) => {
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