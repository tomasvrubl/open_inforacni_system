import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Response, SecurityUserRole, UserService, iDetail } from '../core/module';


@Component({
  selector: 'user-role-detail',
  templateUrl : './_view/user.role.detail.html',
  providers: [ ]
})

export class UserRoleDetailComponent implements iDetail   { 

    response : Response;  
    _role : SecurityUserRole;    
    @Output() roleChanged = new EventEmitter();
    
    constructor(private userService: UserService) {              
        this._role = new SecurityUserRole();            
        this.response = new Response();    
    }       

    @Input() 
    set detail(val : SecurityUserRole){
        
        if(val == null){
            this._role = new SecurityUserRole();
        }
        else{
           this._role = val;
        }            
        
    } 
        
    
    get detail(): SecurityUserRole {
        return this._role;
    }

     newone(){
         this.edit(-1);
     }
 
     edit(id:number){
         this.userService.getUserRole(id).then((j: SecurityUserRole) => this._role = j);
     }
     

   
    saveme() {
        this.userService.updateUserRole(this._role).then((resp : Response) => {
            this.response = resp;
            this._role = resp.data;            
            this.roleChanged.emit(this._role);   
       });        
    }

    
    dropme(){        
        this.userService.dropUserRole(this._role).then((resp : Response) => {
            this.response = resp;
            this.roleChanged.emit(this);
        });            
    }
    

    chkChangeSubrole(ev:any){

        if(ev.checked){
            this._role.params.push(ev.value);
        }
        else{
            this._role.params = this._role.params.filter(v => v !== ev.value);
        }
    }

    isCheckedSubrole(e:string){
        return this._role.params.includes(e);
    }
}