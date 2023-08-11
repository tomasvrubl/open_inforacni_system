import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LabVzorek } from './_obj/tavirna';
import { TavirnaService } from './_services/tavirna.service';


@Component({
  templateUrl : './_view/vzorek.frm.html',
  providers: []
})

export class LabVzorekForm implements OnInit  { 

    urlrec : string = 'tavirna/laborator/vzorek';

    _showSestavy: boolean = false;    
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() isSelector : boolean = false;
    @Input() detail: LabVzorek = null;
    
    constructor(private srv: TavirnaService, private route: ActivatedRoute) {                              
    }
    
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.srv.getLabVzorek(+params['id']);
        })).subscribe((r: LabVzorek) => {
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