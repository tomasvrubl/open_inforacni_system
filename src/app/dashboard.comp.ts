import { Component } from '@angular/core';
import { AuthenticationService } from './core/module'

@Component({
  templateUrl: './_view/dashboard.html',
  providers: []
})

export class DashboardComponent {
    
    constructor( private _service:AuthenticationService){  
    }
 
}