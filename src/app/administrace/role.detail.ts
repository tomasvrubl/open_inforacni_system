import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { iDetail, Response, UserService, SecurityRole, ItemList, SecuritySubRole } from '../core/module';




@Component({
  selector: 'role-detail',
  templateUrl : './_view/role.detail.html',
  providers: [ ]
})

export class SecurityRoleComponent implements iDetail, OnInit { 

    response : Response = new Response();  
    grpList: ItemList[] = [];
    @Input() _role : SecurityRole = new SecurityRole();  
    @Output() paramChanged = new EventEmitter();
    
    constructor(private userService: UserService) {              
                      
    }


    ngOnInit(): void {

        this.userService.getSecurityRoleGroupList().then(list => {
            this.grpList = list;
        });
        
    }


    @Input() 
    set detail(val : SecurityRole){
        
        if(val == null){
            this._role = new SecurityRole();
        }
        else{
            this.userService.getSecurityRole(val.id).then((j: SecurityRole) => this._role = j);            
        }            
        
    } 
        
    
    get detail(): SecurityRole{
        return this._role;
    }
 
    newone(){
        this.edit(-1);
    }
    
    edit(id:number){
        this.userService.getSecurityRole(id).then((j: SecurityRole) => this._role = j);
    }
    

    saveme() {
       this.userService.updateSecurityRole(this._role).then((resp :Response) => {
            this.response = resp;
            this._role = resp.data;
            this.paramChanged.emit(this);
       });        
    }
    
    dropme(){        
        this.userService.dropSecurityRole(this._role).then((resp :Response) => {
            this.response = resp;        
            if (resp.kod == 0){
                this.newone();
            }   
        });            
    }

    addSubRole() {
        console.log(this._role);
        this._role.params.push(new SecuritySubRole());
        console.log(this._role);
        return false;
    }
    
}