import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { AuthenticationService} from '../core/module'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SecurityUser } from "../core/_obj/user";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _service: AuthenticationService, private _router: Router) {}

    canActivate(    route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot) : Promise<boolean>
    {
        var self = this;
        var prop = new Promise<boolean>((resolve, reject) =>
        {


            var ret = self._service.isLoggedIn();
            if (ret instanceof SecurityUser)
            {
                resolve(true);
            }
            else if (ret.then)
            {
                ret.then(m => {
                    if (m) {
                        resolve(true);
                    }
                    else {
                        resolve(false)
                    }
                });
            }
            else
            {
                resolve(false);
            }


        });

        return prop;
    }
}