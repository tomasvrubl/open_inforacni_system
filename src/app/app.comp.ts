import {Component} from '@angular/core';
import {AuthenticationService} from "./core/module";



@Component({
  selector: 'app-content',
  template: '<router-outlet></router-outlet>',
  providers: []
})

export class AppComponent
{
    
    constructor(private authService: AuthenticationService) {
        
    }
    
}