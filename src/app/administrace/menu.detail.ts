import { Component, OnInit, Input} from '@angular/core';
import { Response, MenuItem, CommonService, UserService, ItemList} from '../core/module';

@Component({
  selector: 'adm-menu-item',
  templateUrl : './_view/menu.detail.html',
  providers: [ ]
})

export class MenuDefDetailComponent implements OnInit { 

    response : Response;  
    grpList: ItemList[] = [];
    roleList: ItemList[] = [];
    parentList: MenuItem[];
    _menuitem : MenuItem;   
    
    _domeny : ItemList[] = [];

    constructor(private commonService: CommonService, private userService: UserService) {              
           
        this.response = new Response();            
        this.menuitem = new MenuItem();  
        this.parentList = [];
        
        this.userService.getSecurityRoleGroupList().then(list => {
            this.grpList = list;
            
            if (list.length > 0){
                this.userService.getSecurityRoleList(this._menuitem.role_group_id).then(rolelist => {
                    this.roleList = rolelist; 
                });
            }
        });

        this.commonService.getMenuItemList(-1).then((list: MenuItem[]) => {
            this.parentList = list;
        });
        
    }
    
    @Input() 
    set menuitem(val){        
        this._menuitem = val;
        this.userService.getSecurityRoleList(this._menuitem.role_group_id).then(list => {
            this.roleList = list; 
        });
    }
    
    get menuitem(){
        return this._menuitem;
    }
    
    
    ngOnInit(): void { }        
    newone(){
        this.commonService.getMenuItem(-1).then((j: MenuItem) => {
            this.menuitem = j;
        });
    }
    
    saveme() {
        this.commonService.updateMenuItem(this.menuitem).then((resp :Response) => {
            this.response = resp;
            this.menuitem = resp.data;
       });        
    }
    
    dropme(){        
        this.commonService.dropMenuItem(this.menuitem).then((resp :Response) => {
            this.response = resp;        
            if (resp.kod == 0){
                this.newone();
            }   
        });            
    }
    
    selectGroupRoleChange(val:any){            
        this.userService.getSecurityRoleList(val).then(list => {
            this.roleList = list; 
        });
    }
    
    
}