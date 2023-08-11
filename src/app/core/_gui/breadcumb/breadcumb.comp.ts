import { Component, OnInit, Input, Output, EventEmitter, ElementRef, NgModule} from '@angular/core';


@Component({
  selector: 'mw-breadcrumb',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html',
})


export class BreadcrumbComponent implements OnInit { 
   
    @Input() path : any[]; 
    
    constructor(private _eref: ElementRef) {
      
    }
    
    ngOnInit(): void {}   
    ngOnDestroy() {} 
    
    
}
