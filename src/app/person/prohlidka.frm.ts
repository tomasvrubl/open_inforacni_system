import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PersZdravProhlidka } from './_obj/prohlidky';
import { ProhlidkyService } from './_services/prohlidky.service';


@Component({
  templateUrl : './_view/prohlidka.frm.html',
  providers: []
})


export class PersZdravProhlidkaForm implements OnInit  { 

    urlrec : string = '/pers/prohlidky';

    _showSestavy: boolean = false;
    _showNastaveni: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() isSelector : boolean = false;
    @Input() detail: PersZdravProhlidka = null;
    
    constructor(private serv: ProhlidkyService, private route: ActivatedRoute) {    

    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id']){           
                return Promise.resolve(null);
            }
                        
            return this.serv.getPersProhlidka(+params['id']);
        })).subscribe((rec: PersZdravProhlidka) => {
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
            else if(data.nastaveni){
                this._showNastaveni = true;
            }
        })
       
    }    
     
}