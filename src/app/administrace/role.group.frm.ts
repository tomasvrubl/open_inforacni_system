import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SecurityRoleGroup, UserService} from '../core/module';

@Component({
  templateUrl : './_view/role.group.frm.html',
  providers: []
})

export class SecurityRoleGroupForm implements OnInit  { 

    @Input() roleGroup: SecurityRoleGroup;
    
    constructor(private userService: UserService, private route: ActivatedRoute) {              
        this.roleGroup = null;
    }
    
    ngOnInit(): void { 

        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.userService.getSecurityRoleGroup(+params['id']);
        })).subscribe((role: SecurityRoleGroup) => this.roleGroup = role); 
             
    }    
    
}