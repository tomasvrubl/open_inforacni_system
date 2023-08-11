import { Component, OnInit, Input, Output, EventEmitter, ElementRef, NgModule} from '@angular/core';


@Component({
  selector: 'mw-paginator',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html',
})


export class PaginatorComponent implements OnInit { 
   
    @Input() css : string; 
    @Input() numPages: number = 9;    
    @Input() btnclass: string = "";
    _page: number = 1;    
    _limit: number;
    _pages : number = 0;
    _total: number;
    a_pages: number[];
    
    
    @Input()
    set total(val) {
        this._total = val;        
        this.calcPages();
    }
    
    get total() {
        return this._total;
    }
    
    @Input()
    set limit(val){
        val = parseInt(val + '');
        val  = isNaN(val) ? 0 : val;
        
        this._limit = val;
        this.calcPages();
    }
    
    get limit(){
        return this._limit;
    }
    
    @Input()
    set page(val) {
        val = parseInt(val + '');
        val  = isNaN(val) ? 0 : val;
        this._page = val +1;        
        this.calcPages();
    }
    
    get page(){
        return this._page -1;
    }
    

    
    @Output() onPageChange = new EventEmitter();
    @Output() onLimitChange = new EventEmitter();

    constructor(private _eref: ElementRef) {
        this.a_pages = [];
    }
    
    ngOnInit(): void {}   
    ngOnDestroy() {} 
    
    
    calcPages() {        
        

        if (isNaN(this._total) || isNaN(this._limit) || this._total == 0 || this._limit == 0){
            this._pages = 1;
            this.a_pages = [1];        
            return;
        }
        
        this._pages = Math.round((this._total / this._limit) + 0.5);
        
        var n = Math.round(this.numPages/2);        
        var sb_page = this._page - n;
        var eb_page = this._page + (this.numPages - n);
        
        
        if(sb_page < 0){
            
            eb_page += sb_page * -1;            
            sb_page = 0;
            if (eb_page > this._pages){            
                eb_page = eb_page - (eb_page - this._pages);
            }                
        }
        else if(eb_page > this._pages) {
            
            var over = eb_page - this._pages;
            eb_page = eb_page - over;
            
            sb_page -= over;            
            sb_page = sb_page < 0 ? 0 : sb_page;            
        }
        
        
        this.a_pages = [];
        
        for(;sb_page < eb_page; ++sb_page){
            this.a_pages.push(sb_page+1);
        }
        
    }
    
    limitChanged(){
        this.onLimitChange.emit(this._limit);        
    }
    
    
    navPage(pg){

        if(pg < 1){
            pg = 1;
        }
        else if(pg > this._pages){
            pg = this._pages;
        }
        
        this._page = pg;
        this.onPageChange.emit(pg-1);
        this.calcPages();
                
    }
    
}
