import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, NgModule} from '@angular/core';

declare var jQuery : any;

@Component({
  selector: 'mw-autocomplete',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html',
  host: {
    '(document:click)': 'onClick($event)',
  }
}) 

export class Autocomplete implements OnInit, OnDestroy { 
        
    _isPop : boolean;    
    _prevText :string = '';
    
    @Input() autoitems: any[];
    @Input() textValue;
    
    _filteredList: any[] = [];
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
        let totalNumItem = this._filteredList.length;

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
                    
            var word = this._filteredList[this._itemIndex];
            
            if(typeof word == 'undefined'){
                
                if(this.textValue.trim().length > 0 && this.autoitems.indexOf(this.textValue) < 0){
                    this.autoitems.push(this.textValue);    
                }                
                word = this.textValue;
            }
            
            this.selectOne(word);
            break;
          case 13: // ENTER, choose it!!
          
            if(!this._isPop){              
                break;
            }
            var word = this._filteredList[this._itemIndex];
                        
            if(typeof word == 'undefined'){
                
                if(this.textValue.trim().length > 0 && this.autoitems.indexOf(this.textValue) < 0){
                    this.autoitems.push(this.textValue);    
                }                
                word = this.textValue;
            }
            
            this.selectOne(word);  
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

        this._filteredList = [];
        this._filteredList = this.autoitems.filter(
          el => {
            let objStr = el.toLowerCase();
            keyword = keyword.toLowerCase();            
            return objStr.indexOf(keyword) !== -1;
          }
        );
        
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

    
    dropValue(val:string){
        
        this._isPop = false;

        for (var i = 0; i < this.autoitems.length; ++i){                
            if(this.autoitems[i].localeCompare(val) == 0){
                this.autoitems.splice(i, 1);    
                this._isPop = false;
                break;
            }
        }
        
        for (var i = 0; i < this._filteredList.length; ++i){                
            if(this._filteredList[i].localeCompare(val) == 0){
                this._filteredList.splice(i, 1);    
                break;
            }
        }
        
        this._itemIndex = 0;
                
    }
}

