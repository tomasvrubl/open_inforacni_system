import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Response , Table, BaseListComponent, CommonService} from '../core/module';
import  {SettingDetailComponent} from './setting.detail';

@Component({
  selector: 'setting-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [  SettingDetailComponent ]
})

export class SettingListComponent extends BaseListComponent { 

    
    constructor(private commService: CommonService,  protected router: Router) {

        super(router, SettingDetailComponent, commService);
        
        this.tab.header = [
            { label: 'Parametr', clmn: 'kod' },
            { label: 'Hodnota', clmn: 'param' },
            { label: 'Popis', clmn: 'poznamka' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];

    }

    getComponentName(): string {
        return "SettingListComponent";
    }

    onEdit(el:any, iswnd:boolean) {               

        super.editRecord(el.id, iswnd, '/admin/setting/'+ el.id);
    } 
   
    onDrop(el:any){
        this.commService.dropSettingParam(el).then((response:Response) => {
            this.response = response;
            this.reloadData(this.tab);                
        });
    }
    
    reloadData(table: Table){       
       this.commService.getSettingTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }


   
}