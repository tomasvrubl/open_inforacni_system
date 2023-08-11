import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ReportPrint } from './_obj/common';
import { ReportService } from './_services/report.service';


@Component({
  selector: 'report-frm',
  templateUrl : './_view/report.frm.html',
  providers: []
})

export class ReportForm implements OnInit  { 

    
    @Input() urlrec: string = ""; //adresa pod kterou se povedou zaznamy 
    @Input() rec: ReportPrint = null;
    @Input() showSeznam: boolean = true;
    
    constructor(private serv: ReportService,
                private route: ActivatedRoute) {              
                
    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['printid']){                   
                this.showSeznam = true;
                return Promise.resolve(null);
            }

            this.showSeznam = false;
            return this.serv.getReport(+params['printid']);
        })).subscribe((rec: ReportPrint) => {
            
            this.rec = rec;            
            if(this.rec != null){
                this.urlrec = rec.url_rec;
            }
            
        });             
    }

}