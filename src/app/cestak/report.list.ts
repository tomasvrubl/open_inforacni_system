import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutoReportDetail } from './report.detail';
import { CestakService } from './_services/cestak.service';
import { Table, BaseListComponent } from '../core/module';

@Component({
  selector: 'auto-report-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders : [ AutoReportDetail ]
})

export class AutoReportList extends BaseListComponent  { 

    getComponentName(): string {
        return "AutoReportList";
    } 
    


    constructor(private cestakService: CestakService,  protected router: Router) {
    
        super(router, AutoReportDetail, cestakService);

        this.isPrint = true;

        this.tab.header = [
            { label: 'Rok', clmn: 'rok', type: 6 },
            { label: 'Měsíc', clmn: 'mesic', type: 6 },            
            { label: 'Auto', clmn: 'auto' },
            { label: 'SPZ', clmn: 'spz' },
            { label: 'Najeto km', clmn: 'total_km', type: 1 },
            { label: 'Palivo / nabíjení v Kč', clmn: 'palivo_nakup_kc', type: 1 },
            { label: 'Ostatní v Kč', clmn: 'ost_kc', type: 1 },            
            { label: 'Osoba', clmn: 'osoba' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
    }

    
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/cestak/auto/report/'+ el.id);    
    } 
    
    onDrop(el:any){
        this.cestakService.dropReportVykaz(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }

    reloadData(table: Table){
        this.cestakService.getReportVykazTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }

   
   
}