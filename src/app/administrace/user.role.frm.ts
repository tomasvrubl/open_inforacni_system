import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SecurityUserRole, UserService} from '../core/module';

@Component({
  templateUrl : './_view/user.role.frm.html',
  providers: []
})

export class UserRoleForm implements OnInit  { 

    @Input() detail: SecurityUserRole;
    
    constructor(private userService: UserService, private route: ActivatedRoute) {              
        this.detail = null;
    }
    
    ngOnInit(): void { 

        this.route.params.pipe(switchMap((params: Params) => { 
                            
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.userService.getUserRole(+params['id']);
        })).subscribe((role: SecurityUserRole) => this.detail = role); 
             
    }       
    
}