import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { AuthenticationService} from './core/module'
import { SecurityUser } from "./core/_obj/user";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { variableNameRedirect } from './auth.comp';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _service: AuthenticationService, private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<boolean>
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
                  resolve(m ? true: false);
                  if (!m)
                  {
                      var url = state.url;
                      localStorage.setItem(variableNameRedirect, url);
                      this._router.navigate(['/login']);
                  }
                });
            }
       });

       return prop;
  }
}