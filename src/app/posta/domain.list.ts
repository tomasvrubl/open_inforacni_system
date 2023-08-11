import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostaDomainDetail } from './domain.detail';
import { PostaService } from './_services/posta.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';



@Component({
  selector: 'posta-domain-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PostaDomainDetail],
  providers : [  ]
})

export class PostaDomainList extends BaseListComponent { 

    getComponentName(): string {
        return "PostaDomainList";
    } 

    constructor(private serv: PostaService,  protected router: Router) {
    
        super(router, PostaDomainDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },            
            { label: 'Název domény', clmn: 'name'},
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    

    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/posta/domain/'+el.id);            
    } 
   
    onDrop(el:any){

        this.serv.dropDomain(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
        
    }
    
    reloadData(table: Table){
       this.serv.getDomainTable(table.getQuery()).then(data => {
            this.asyncSetTab(data);
       }); 
    }
  
    
   
}