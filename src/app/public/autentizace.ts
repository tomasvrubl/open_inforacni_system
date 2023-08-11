import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalService } from './_services/terminal.service';


@Component({
  selector: 'terminal-auth',
  templateUrl : './_view/autentizace.html',
  providers: []
})

export class TerminalAuthForm  implements OnInit { 

    oscislo : string = '';
    errmsg : string = '';
    backurl: string = null;
    kod : string = ''; //zdroj kod

    constructor(private srv: TerminalService, private route: ActivatedRoute, private router: Router) {         

    }


    ngOnInit(): void {         
        
      console.log('ngOnInit()');

      this.route.paramMap.subscribe(params => {         
          this.backurl = params.get('backurl');
          this.kod = params.get('kod');
      });      
           
  }    


   jePrihlasen(){

    return this.srv.userTerminal != false;

   }

   logout() {
      console.log('logout()');
      this.srv.logoutTerminal();
   }

  


    addCislo(cis:number){
      this.oscislo += cis + '';
    }
    

    delAll(){
      this.oscislo = '';
    }

    delLast(){

      if(this.oscislo.length > 0){
        this.oscislo = this.oscislo.slice(0,-1);
      }

    }

    async prihlasit(){
      this.oscislo = this.oscislo.trim();

      if(this.oscislo.length < 1){
        this.errmsg = "Zadej osobní číslo nebo kód";
      }
      else{
        this.errmsg = ""
      }

      var u = this.srv.loginTerminal(this.oscislo);

      if(!u || await u === false){
        this.errmsg = "Uživatel neexistuje!!! Neplatný kód.";
      }
      else{

        if(this.backurl != null){
          this.router.navigate([this.backurl, {backurl: true}]);
        }
        else{
          this.router.navigate(['/terminal/linka/'+this.kod]);
        }

      }

      console.log(this.errmsg);
      
      
    }
}