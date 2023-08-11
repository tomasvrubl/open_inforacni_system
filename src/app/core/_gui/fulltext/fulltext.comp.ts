import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { Table } from '../../_obj/common';

declare var jQuery : any;

@Component({
  selector: 'mw-fulltext',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html',
  host: {
    '(document:click)': 'onClick($event)',
  }
})


export class Fulltext implements OnInit, OnDestroy { 
        
    _isPop : boolean;    
    _prevText :string = '';    
    
    @Input() autoitems: Table;
    @Input() textValue;
    
    _itemIndex: number = null;
    
    @Output() textValueChange = new EventEmitter();
    private delay = (function () {
            let timer ;
            return function (callback: any, ms: number) {
              clearTimeout(timer);
              timer = setTimeout(callback, ms);
            };
    })();
        
    
    constructor(private _eref: ElementRef) { 
        this.textValue = "";
    }
    
    
    ngOnInit(): void {    
        this._isPop = false;
        this._itemIndex = 0;
    }
    
    ngOnDestroy() {} 
    
    
    onClick(event : any) {        
        if (!this._eref.nativeElement.contains(event.target)) {
             this._isPop = false;        
        }
    }
    
    showPopup(event : any){        
        
        if(this._isPop){
            this._isPop = false;
        }
        else{
            this._isPop = true;    
            this.reloadList(event.target.value);
        }
    }
 
    
    inputElKeyHandler(evt){

       if(this.autoitems == null || this.autoitems.data == null || this.autoitems.data.list.length < 1)
          return;

        let totalNumItem = this.autoitems.data.list.length;

        switch (evt.keyCode) {
          case 27: // ESC, hide auto complete
            this._isPop = false;
            break;

          case 38: // UP, select the previous li el
            this._itemIndex = (totalNumItem + this._itemIndex - 1) % totalNumItem;
            this.scrollToView(this._itemIndex);
            break;

          case 40: // DOWN, select the next li el or the first one
            this._isPop = true;
            let sum = this._itemIndex;
            if (this._itemIndex === null) {
              sum = 0;
            } else {
              sum = sum + 1;
            }
            this._itemIndex = (totalNumItem + sum) % totalNumItem;
            this.scrollToView(this._itemIndex);
            break;

          case 9: // TAB, choose if tab-to-select is enabled
            
            if(!this._isPop || this.textValue.trim().length < 1){              

                this._isPop = false;
                break;
            }
            
            
            break;
          case 13: // ENTER, choose it!!
          
            if(!this._isPop){              
                break;
            }
            
            evt.preventDefault();   
            this.nextElement();
            break;
       }
    }
    
   
    
    reloadListInDelay = (evt: any): void  => {
        let delayMs = 10;
        let keyword = evt.target.value;

        
        // executing after user stopped typing
        this.delay(() => this.reloadList(keyword), delayMs);
    }
    
    focusOut(ev:any){
        
        if (this.textValue.localeCompare(this._prevText) == 0){
            return;
        }
       
        this.textValueChange.emit(this.textValue);    
    }

    focusIn(ev:any){
        this._prevText  = this.textValue;
        this.showPopup(ev);
    }



    reloadList(keyword: string)  {
        
      
      this.textValueChange.emit(keyword);   
    }
    
    selectOne(data: any) {
        
        this._isPop = false;                
        
        if (this.textValue.localeCompare(data) == 0){
              return;
        }
        
        this.textValue = data;
        this.textValueChange.emit(data);    
            
        
    }

    
    scrollToView(index: number) {
           this._isPop = true; 
           const container = this._eref.nativeElement;
           const ul = container.querySelector('ul');
           const li = ul.querySelector('li');
           const liHeight = li.offsetHeight;
           const scrollTop = ul.scrollTop;
           const viewport = scrollTop + ul.offsetHeight;
           const scrollOffset = liHeight * index;
           if (scrollOffset < scrollTop || (scrollOffset + liHeight) > viewport) {
             ul.scrollTop = scrollOffset;
           }
    }
    
    nextElement(){
        
        var focusable = jQuery('body').find('input, select').filter(':visible');       
        var index = focusable.index(this._eref.nativeElement.querySelector("#n_input"));
        var next = focusable.eq(index+1);        
        if (next.length) {
            next.focus();
        }
        
    }

    
}

