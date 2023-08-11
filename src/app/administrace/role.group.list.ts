import { Component } from '@angular/core';
import { Router } from '@angular/router';
import  { SecurityRoleGroupComponent } from './role.group.detail';
import {Table, UserService, BaseListComponent, BaseService} from '../core/module';


@Component({
  selector: 'role-group-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ SecurityRoleGroupComponent ]
})

export class SecurityRoleGroupList extends BaseListComponent { 

    
    constructor(private userService: UserService,  protected router: Router, protected baseService: BaseService) {

        super(router, SecurityRoleGroupComponent, baseService);
        
        this.tab.header = [
            { label: 'ID', clmn: 'id' },
            { label: 'Kód skupiny', clmn: 'name' },
            { label: 'Název', clmn: 'note' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];

    }

    getComponentName(): string {
        return "SecurityRoleGroupList";
    }

    onEdit(el:any, iswnd:boolean) {               

        super.editRecord(el.id, iswnd, '/admin/role/group/'+ el.id);
    } 
   
    onDrop(el:any){
        this.userService.dropSecurityRoleGroup(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);       
        });        
    }
    
    reloadData(table: Table){       
       this.userService.getSecurityRoleGroupTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }

}