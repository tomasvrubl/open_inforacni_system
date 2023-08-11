import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Response, UserService, SecurityRoleGroup, iDetail } from '../core/module';

@Component({
  selector: 'role-group-detail',
  templateUrl : './_view/role.group.detail.html',
  providers: [ ]
})

export class SecurityRoleGroupComponent implements iDetail { 

    response : Response;  
    @Input() _d : SecurityRoleGroup;    
    @Output() paramChanged = new EventEmitter();
    
    constructor(private userService: UserService) {              
        this._d = new SecurityRoleGroup();            
        this.response = new Response();    
    }


    @Input() 
    set detail(val : SecurityRoleGroup){
        
        if(val == null){
            this._d = new SecurityRoleGroup();
        }
        else{
            this.userService.getSecurityRoleGroup(val.id).then((j: SecurityRoleGroup) => this._d = j);            
        }            
        
    } 
        
    
    get detail(): SecurityRoleGroup{
        return this._d;
    }

    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.userService.getSecurityRoleGroup(id).then((j: SecurityRoleGroup) => this._d = j);
    }

    
    saveme() {
       this.userService.updateSecurityRoleGroup(this._d).then((resp :Response) => {
            this.response = resp;
            this._d = resp.data;
            this.paramChanged.emit(this);
       });        
    }
    
    dropme(){        
        this.userService.dropSecurityRoleGroup(this._d).then((resp :Response) => {
            this.response = resp;        
            if (resp.kod == 0){
                this.newone();
            }   
        });            
    }

    
}