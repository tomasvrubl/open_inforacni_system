import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { TerminalService } from './_services/terminal.service';
import { TerminalUser } from './_obj/terminal';
import { Response } from './module';

declare var jQuery : any;

@Component({
  templateUrl : './_view/terminal.linka.html',
  providers: []
})

export class TerminalLinkaForm  implements OnInit, AfterViewChecked  { 

    scrHeight:any;
    scrWidth:any;
    zdroj_kod : string = '';
    user : TerminalUser | false;
    response: Response = new Response();

    
    constructor(protected srv: TerminalService, private route: ActivatedRoute) {       
      this.getScreenSize();  


    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
          this.ngAfterViewChecked();
    }


    ngAfterViewChecked(): void {
    
  
      const part = jQuery('#terminal-page');      
      const toolpartH = jQuery('#terminal-header');

      if(Number.isNaN(toolpartH) || toolpartH == undefined || toolpartH.height() == undefined){
        part.css('height', 'auto');  
        return;
      }

      

      const vv = Math.floor(this.scrHeight - toolpartH.height());


      if(vv  < 0){
        return;
      }
        

      part.css('height', vv);

    }

    
    ngOnInit(): void {             
      this.zdroj_kod = this.route.snapshot.paramMap.get('kod');   

      this.srv.userTerminalChanged.subscribe((r:any) =>  this.user = r);

      this.user = this.srv.userTerminal;        
      this.srv.responseChanged.subscribe((r:Response) =>  this.response = r);

    }    


    jePrihlasen(): boolean {

        if(this.user instanceof TerminalUser){
          return true;
        }
        return false;
    }
    
    odhlasitse(){
      this.srv.logoutTerminal();      
 
    }

}