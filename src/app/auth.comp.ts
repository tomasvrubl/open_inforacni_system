import { Component, OnInit, Injectable } from '@angular/core';
import {AuthenticationService} from './core/module'
import { Router} from '@angular/router';
import { SecurityUser } from './core/_obj/user';
import * as jQuery from 'jquery';


export const variableNameRedirect:string = 'after_login_redirect';


@Component({
  selector: 'app-auth',
  templateUrl: './_view/login.html',
})

@Injectable()
export class AuthComponent implements OnInit {
    errorMsg = '';
    loading = false;
    remember = 1;
    password: string = '';
    username: string = '';
    


    constructor(private _service: AuthenticationService,  private _router: Router) {
        if (_service.user != false) {
            this._service.logout().then(ret =>
            {
                if (!ret)
                {
                    localStorage.removeItem(variableNameRedirect)
                    _router.navigate(['/']);
                }
            });
        }
        else {
            localStorage.removeItem(variableNameRedirect);
            _router.navigate(['/']);
        }
    }

    login() {

        this.loading = true;
        this.errorMsg = "";

        var self = this;
        this._service.login(this.username, this.password).then(what=> {
            this.loading = false;
            this.errorMsg = '';
            if (what instanceof SecurityUser)
            {
                var kam = localStorage.getItem(variableNameRedirect);
                localStorage.removeItem(variableNameRedirect);
                this._router.navigate([kam || '/']);
            }
        }).catch(err => {
            self.loading = false;
            self.errorMsg = err.message;          
        });

    }
    
    ngOnInit(): void {                
        jQuery(function(){
            jQuery('body').removeClass('login');
            jQuery('body').addClass('login');
            window.scrollTo(0, 0);
        });
    }

}

