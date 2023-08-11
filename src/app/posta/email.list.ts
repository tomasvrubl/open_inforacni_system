import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostaDomainDetail } from './domain.detail';
import { PostaService } from './_services/posta.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';



@Component({
  selector: 'posta-email-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PostaDomainDetail],
  providers : [  ]
})

export class PostaEmailList extends BaseListComponent { 

    getComponentName(): string {
        return "PostaEmailList";
    } 

    constructor(private serv: PostaService,  protected router: Router) {
    
        super(router, PostaDomainDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },            
            { label: 'E-mail', clmn: 'email', fulltext: true},
            { label: 'Doména', clmn: 'domena' },
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    

    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/posta/e-mail/'+el.id);            
    } 
   
    onDrop(el:any){

        this.serv.dropEmail(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
        
    }
    
    reloadData(table: Table){
       this.serv.getEmailTable(table.getQuery()).then(data => {
            this.asyncSetTab(data);
       }); 
    }
  
    
   
}