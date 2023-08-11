import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AutoVykazSumar } from './_obj/cestak';
import { CestakService } from './_services/cestak.service';

@Component({
    templateUrl : './_view/report.frm.html',
    providers: []
})


export class AutoReportForm implements OnInit { 

    urlrec : string = '/auto/vykazjizd';
    
    _showSestavy: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() detail: AutoVykazSumar = null;

    constructor(private cestakService: CestakService, private route: ActivatedRoute) {        

    }

    ngOnInit(): void { 
    
        
        this.route.params.pipe(switchMap((params: Params) => { 
             
            if(!params['id']){                   
                return Promise.resolve(null);
            }

            return this.cestakService.getMesicniVykaz(+params['id']);
        })).subscribe((rec: AutoVykazSumar) => {
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