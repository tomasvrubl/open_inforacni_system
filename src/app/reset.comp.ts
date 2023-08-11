import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from './core/module'

import { Router} from '@angular/router';

import * as jQuery from 'jquery';


@Component({
  templateUrl: './_view/resetpass.html'  
})


export class ResetPassComponent implements OnInit {
    errorMsg = '';
    loading = false;
    email: string = "";
    respondMsg: string = null;

    constructor(private srv: AuthenticationService,  private router: Router) {
        this.email = "";
    }
    
    ngOnInit(): void {                
        jQuery(function(){
            jQuery('body').removeClass('login');
            jQuery('body').addClass('login');
            window.scrollTo(0, 0);
        });
    }

    resetPass(): void {

        if(!this.validateEmail(this.email)){
            this.errorMsg = "Nevalidní e-mailová adresa.";
        }
        else{

            this.srv.lostPassword(this.email).then(resp => {
                if(resp.kod == 1){
                    this.errorMsg = resp.nazev;
                }
                else{ //vse ok 
                    this.respondMsg = resp.nazev;
                }
            })
        }
    }

    validateEmail(mail:string): boolean {

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        {
            return true;
        }
        return false;
    }

}

