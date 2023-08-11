import { Component, ComponentFactoryResolver} from '@angular/core';
import { Router } from '@angular/router';
import { TableQuery, Table, CommonService, BaseListComponent, TabFilter} from '../core/module';
import { MenuDefDetailComponent } from './menu.detail';


@Component({
  selector: 'adm-menu-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ MenuDefDetailComponent ]
})

export class MenuDefListComponent extends BaseListComponent { 

    getComponentName(): string {
        return "MenuDefListComponent";
    } 
    
    
    constructor(private commService: CommonService,  protected router: Router, protected componentFactoryResolver: ComponentFactoryResolver) {

        super(router, MenuDefDetailComponent, commService);

        this.tab.header = [
            { label: 'ID', clmn: 'id'},
            { label: 'Název', clmn: 'name', fulltext: true},
            { label: 'Icon', clmn: 'icon' },
            { label: 'Url', clmn: 'url' },
            { label: 'Nadřízené menu', clmn: 'parent', fulltext: true },
            { label: 'Skupina role', clmn: 'role_group' },
            { label: 'Role', clmn: 'role' },
            { label: 'Pořadí', clmn: 'sortorder' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        
    }
    
   
    onEdit(el:any, iswnd:boolean) {               
        super.editRecord(el.id, iswnd, '/admin/menu/'+ el.id);
    } 
   
    onDrop(el:any){
        this.commService.dropMenuItem(el).then(response =>  {
            this.response = response;
            this.reloadData(this.tab);       
        });
    }
    
    reloadData(table: Table){       
       this.commService.getMenuItemTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }

    autocomplete(ev:string){

        var q = new TableQuery();
        if(ev){
            q.clmn.push({clmn: 'nazev', filter: [ { value: ev, operator: TabFilter.O_LIKE }]});
            q.q_join = TableQuery.JOIN_OR;
        }        

        this._filter = q;
        this.tab.setFilter(this._filter);
        this.reloadData(this.tab);
    }

    
}