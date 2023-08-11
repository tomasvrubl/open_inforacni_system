/***
 * Zakladni komponenta tiskove sestavy pro jednotlive formulare
 * 
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReportDetailComponent } from './report.detail';
import { ReportService } from './_services/report.service';
import { Table, Response } from './_obj/common';
import { BaseListComponent } from './_gui/baselist/base';


@Component({
  selector: 'report-list',
  templateUrl : './_gui/baselist/view.html',
  viewProviders: [ReportDetailComponent],
  providers : [  ]
})

export class ReportListComponent extends BaseListComponent { 

    
    getComponentName(): string {
        return "ReportList";
    } 
    
    constructor(private serv: ReportService,  protected router: Router) {
    
        super(router, ReportDetailComponent, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Poznámka', clmn: 'note' },
            { label: 'Url', clmn: 'url', type: 5  }, //url typ
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
     
        this.onUrlRecChangeEvent.subscribe(url => this.reloadData(this.tab));
    }

    onInitializedDetail(detail:any){
        detail.urlrec = this.urlrec;
    }
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/print/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropReport(el).then(( r: Response) => {
            this.response = r;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){
        this.serv.getTable(table.getQuery(), this._urlrec).then(response => this.asyncSetTab(response)); 
    }
  
}