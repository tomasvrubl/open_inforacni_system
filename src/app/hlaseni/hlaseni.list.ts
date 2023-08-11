import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../core/module';
import { HlaseniService } from './_services/hlaseni.service';
import { Hlaseni } from './_obj/hlaseni'


@Component({
  selector: 'hlaseni-list',
  templateUrl : './_view/hlaseni.list.html',
  providers : [  ]
})

export class HlaseniList implements OnInit { 
 
    response : Response;  
    lst: Hlaseni[];
    fVytvoreno :boolean = true;
    fPrevzato :boolean = true;
    fUzavreno :boolean = false;
    
    
    constructor(private serv: HlaseniService,  private router: Router) {
        this.response = new Response();
        this.lst = [];
    }
    
    ngOnInit(): void {   
       this.serv.getHlaseni(this._getStav()).then((resp : Hlaseni[]) => this.lst = resp);          
    }
    
    newone() : void {
        this.router.navigate(['/hlaseni/-1']);
    }
    
    reloadData() : void {
        this.serv.getHlaseni(this._getStav()).then((resp : Hlaseni[]) => this.lst = resp);          
    }
    
    // 0 - VYTVORENO, 1 - PREVZATO, 2 - UZVRENO 
    _getStav() : number[] {
        
        let stav = [];
        
        if (this.fVytvoreno){
            stav.push(0);
        }
        
        if (this.fPrevzato){
            stav.push(1);
        }
        
        if (this.fUzavreno){
            stav.push(2);
        }
        
        return stav;        
    }
   
}