import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { JakostKov } from './_obj/tavirna';
import { TavirnaService } from './_services/tavirna.service';


@Component({
  templateUrl : './_view/jakost.frm.html',
  providers: []
})

export class JakostForm implements OnInit  { 

    urlrec : string = 'tavirna/jakost';

    _showSestavy: boolean = false;    
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() isSelector : boolean = false;
    @Input() detail: JakostKov = null;
    
    constructor(private srv: TavirnaService, private route: ActivatedRoute) {                              
    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.srv.getJakost(+params['id']);
        })).subscribe((r: JakostKov) => {
            if(r == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }
            

            this.detail = r
        });
        
        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
             
    }    
    
  
}