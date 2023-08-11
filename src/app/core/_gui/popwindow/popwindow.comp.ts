import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit} from '@angular/core';

declare var jQuery : any;

@Component({
  selector: 'mw-popwnd',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html'
})

export class PopWindowComponent implements AfterViewInit { 
   
    @Input() id : string;
    @Input() title: string;
    @Output() onCancel = new EventEmitter();
    @Input() centerScreen: boolean = false;
   
    constructor(private _eref: ElementRef) {
        this.id = "mwwnd-id-"+Math.floor(Math.random()*1000);        
        this.title = "";
    }
    
    useCancel(){
        this.onCancel.emit(this);        
    }
 

    ngAfterViewInit(){
        if(this.centerScreen){

           var p = jQuery('.popBrowser').parent();
           var w = p.width();
           var h = p.height();
           var hh = window.innerHeight;

           var top = h > hh ? 120 :  Math.ceil((hh - h) / 2);
           p.css({position: 'fixed', top: top+'px', 'z-index': 999, 'width': w+'px', 'height': h+'px'})
           
        }
    }
}
 