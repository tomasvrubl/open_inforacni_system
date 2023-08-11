import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Response , TableQuery, TableData, Table, SecurityUserRole, UserService} from '../core/module';


@Component({
  selector: 'user-role-list',
  templateUrl : './_view/user.role.list.html',
  providers : [  ]

})


export class UserRoleListComponent { 

    response : Response;  
    tabRoles: Table = new Table();
    role: SecurityUserRole;
    _userid : number;
    _editIDX: number = -1;
    selectMenuList:boolean;
    @Input()
    get userid(){
        return this._userid;
    }
    
    set userid(val:number){
       this._userid = val;     
       this.reloadData(this.tabRoles);
    }
    
    constructor(private userService: UserService,  private router: Router) {
        this.response = new Response();
        this.tabRoles.header = [
            { label: 'ID', clmn: 'id' },
            { label: 'Role', clmn: 'role' },
            { label: 'Skupina', clmn: 'skupina' },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
        this._userid=-1;
        this.selectMenuList = false;
        this.role = new SecurityUserRole();
      
    }
    
 
    
   
    asyncSetTab(data: TableData){
       this.tabRoles.data = data;
    }
    
    
    onEdit(el:any, iswnd:boolean) {               
        if(iswnd){
            this.router.navigate(['/admin/user/role/'+ el.id]);
        }        

        this.userService.getUserRole(el.id).then((r: SecurityUserRole) => this.role = r);
        
    } 
   
    onDrop(el:any){
        this.userService.dropUserRole(el).then(response => this.asyncReloadData(response));
    }
    
    asyncReloadData(response: Response) {        
       this.response = response;
       this.reloadData(this.tabRoles);       
    }
    
    roleChanged(ev:any){
       
       var query = new TableQuery();       
       
       query.page = this.tabRoles.data.page;
       query.limit = this.tabRoles.data.limit;
       query.clmn = this.tabRoles.copyHeader();
       query.clmn.push({clmn: 'X.user_id', type: 1, filter: [{operator: 0, value: this._userid}]});       
       
       
       this.userService.getUserRoleTable(query).then(response => {
           this.asyncSetTab(response);
           
           if(!response.list)
                return; 
           
        
           let lst = response.list;
           for(var i=0; i < lst.length; ++i){
                
               if(lst[i].id == ev.id){
                    this._editIDX = i;
                    break;
               }
           }
       }); 
    }
    
    reloadData(table: Table){
    
       var query = new TableQuery();       
       
       query.page = table.data.page;
       query.limit = table.data.limit;
       query.clmn = table.copyHeader();
       query.clmn.push({clmn: 'X.user_id', type: 1, filter: [{operator: 0, value: this._userid}]});       
       this.userService.getUserRoleTable(query).then(response => this.asyncSetTab(response)); 
    }
}