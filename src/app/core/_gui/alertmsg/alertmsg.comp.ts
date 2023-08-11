import { Component, Input, OnInit} from '@angular/core';
import { Response } from '../../_obj/common'


@Component({  
  selector: 'mw-alert-message',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html'
})


export class AlertMessage { 
      
    @Input() public response : Response = new Response();


    isDisplayed(){
        
        
        var t = this;

        if(this.response && this.response.kod > -1){
            
            setTimeout(function(){
                t.response = new Response();
            }, 2000);
            
            return true;
        }   
        
        return false; 
    }
    
}