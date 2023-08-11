import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AttachmentDetailComponent } from './attach.detail';
import { UploadService } from './_services/upload.service';
import { Table, Response } from './_obj/common';
import { BaseListComponent } from './_gui/baselist/base';


@Component({
  selector: 'attach-list',
  templateUrl : './_gui/baselist/view.html',
  viewProviders: [AttachmentDetailComponent],
  providers : [  ]
})

export class AttachmentListComponent extends BaseListComponent implements OnInit { 



    getComponentName(): string {
        return "AttachmentList";
    } 
    constructor(private serv: UploadService,  protected router: Router) {
    
        super(router, AttachmentDetailComponent, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Poznámka', clmn: 'note' },
            { label: 'Url', clmn: 'url', type: 5  }, //url typ
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    

    ngOnInit(): void {   
        this.reloadData(this.tab);
    }

    onInitializedDetail(detail:any){
        detail.urlrec = this.urlrec;
    }
    
    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/attachment/'+ el.id);            
    } 
   
    onDrop(el:any){
        this.serv.dropAttachment(el).then(( r: Response) => {
            this.response = r;
            this.reloadData(this.tab);       
        });
    }

    callReloadData(){        
        this.reloadData(this.tab);
    }
    
    reloadData(table: Table){
        this.serv.getAttachmentTable(table.getQuery(), this._urlrec).then(response => this.asyncSetTab(response)); 
    }
  
    
   
}