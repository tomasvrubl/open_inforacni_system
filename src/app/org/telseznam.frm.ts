import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Telkontakt } from './_obj/organizace';
import { OrganizaceService } from './_services/organizace.service';


@Component({
  templateUrl : './_view/telseznam.frm.html',
  providers: []
})


export class TelseznamForm implements OnInit  { 

    urlrec : string = '/org/telseznam';
    
    _showSestavy: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() detail: Telkontakt = null;
    
    constructor(private serv: OrganizaceService, private route: ActivatedRoute) {    

    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id'] || !params['typ']){           
                return Promise.resolve(null);
            }
                        
            return this.serv.getKontakt(+params['id'], +params['typ']);
        })).subscribe((rec: Telkontakt) => {
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