import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostaAliasDetail } from './alias.detail';
import { PostaService } from './_services/posta.service';
import { Table, BaseListComponent, TabColumn} from '../core/module';



@Component({
  selector: 'posta-alias-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [PostaAliasDetail],
  providers : [  ]
})

export class PostaAliasList extends BaseListComponent { 

    getComponentName(): string {
        return "PostaAliasList";
    } 

    constructor(private serv: PostaService,  protected router: Router) {
    
        super(router, PostaAliasDetail, serv);

        this.tab.header = [
            { label: 'Id', clmn: 'id' },            
            { label: 'Alias', clmn: 'source', fulltext:true},
            { label: 'Doména', clmn: 'domena' },
            { label: 'Seznam e-mailů', clmn: 'destination', fulltext:true},
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    

    
    onEdit(el:any, iswnd:boolean) {       
        super.editRecord(el.id, iswnd, '/posta/alias/'+el.id);            
    } 
   
    onDrop(el:any){

        this.serv.dropAlias(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });
        
    }
    
    reloadData(table: Table){
       this.serv.getAliasTable(table.getQuery()).then(data => {
            this.asyncSetTab(data);
       }); 
    }
  
    
   
}