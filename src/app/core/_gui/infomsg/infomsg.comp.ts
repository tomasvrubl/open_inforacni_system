import { Component, Input, Output, ElementRef, EventEmitter} from '@angular/core';

  
@Component({  
  selector: 'mw-infobox',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html'
})


export class InfoMessage { 
      

    @Input() btnText: String;
    @Input() btnIcon: String;
    @Output() btnClick = new EventEmitter();
    
    constructor(private _eref: ElementRef) { 
        this.btnText = "";
        this.btnIcon = "fa fa-send";
    }

    zmacknuto(){

        this.btnClick.emit();
    }
    
}