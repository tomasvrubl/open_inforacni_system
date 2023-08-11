import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SecurityRole, UserService} from '../core/module';

@Component({
  templateUrl : './_view/role.frm.html',
  providers: []
})

export class SecurityRoleForm implements OnInit  { 

    @Input() role: SecurityRole;
    
    constructor(private userService: UserService, private route: ActivatedRoute) {              
        this.role = null;
    }
    
    ngOnInit(): void { 

        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.userService.getSecurityRole(+params['id']);
        })).subscribe((role: SecurityRole) => this.role = role); 
             
    }    
    
}