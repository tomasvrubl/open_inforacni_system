import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Response , Table, UserService, BaseListComponent, BaseService} from '../core/module';
import  {SecurityRoleComponent} from './role.detail';


@Component({
  selector: 'role-list',
  templateUrl : '../core/_gui/baselist/view.html',
  providers : [ SecurityRoleComponent  ]
})


export class SecurityRoleList extends BaseListComponent  { 
    
    constructor(private userService: UserService,  protected router: Router, protected baseService: BaseService) {

        super(router, SecurityRoleComponent, baseService);
        
        this.tab.header = [
            { label: 'ID', clmn: 'id' },
            { label: 'Skupina', clmn: 'skupina' },
            { label: 'Název role', clmn: 'tag' },
            { label: 'JS class', clmn: 'ts_class' },
            { label: 'Poznámka', clmn: 'note' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];

    }
    
    getComponentName(): string {
        return "SecurityRoleList";
    }

    
    onEdit(el:any, iswnd:boolean) {               

        super.editRecord(el.id, iswnd, '/admin/role/role/'+ el.id);
    } 
   
    onDrop(el:any){
        this.userService.dropSecurityRole(el).then((response:Response) => {
            this.response = response;
            this.reloadData(this.tab);               
        });
    }
    
    reloadData(table: Table){       
       this.userService.getSecurityRoleTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
}