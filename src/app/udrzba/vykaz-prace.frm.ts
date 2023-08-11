import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { VykazPrace } from './_obj/udrzba';
import { UdrzbaService } from './_services/udrzba.service';


@Component({
  templateUrl : './_view/vykaz-prace.frm.html',
})

export class VykazPraceForm implements OnInit  { 

    urlrec : string = '/udrzba/vykaz-prace';

    _showSestavy: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() isSelector : boolean = false;
    @Input() detail: VykazPrace = null;
    
    constructor(private srv: UdrzbaService, private route: ActivatedRoute) {    

    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id']){           
                return Promise.resolve(null);
            }
                        
            return this.srv.getVykazPrace(+params['id']);
        })).subscribe((rec: VykazPrace) => {
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