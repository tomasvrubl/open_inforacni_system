import { Component, Input, OnInit, NgModule} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SecurityUser, UserService} from '../core/module';

@Component({
  templateUrl : './_view/user.frm.html',
  providers: []
})

export class UserForm implements OnInit  { 

    @Input() user: SecurityUser;
    
    constructor(private userService: UserService, private route: ActivatedRoute) {              
        this.user = null;
    }
    
    ngOnInit(): void { 

        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.userService.getUser(+params['id']);
        })).subscribe((usr: SecurityUser) => this.user = usr); 
             
    }    
    
}