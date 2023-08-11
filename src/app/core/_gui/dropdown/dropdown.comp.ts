import { Component,  Input, Output, EventEmitter} from '@angular/core';


export interface ItemList {
  value: any;
  label: string;
}


@Component({
  selector: 'mw-dropdown',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html'
})
export class DropDown  { 

    _val : any = '';
    _lst : ItemList[] = [];
    
    @Output() valueChange = new EventEmitter<any>();
    @Output() change = new EventEmitter<any>();

    get items(): ItemList[] {
      return this._lst;
    }
  

    @Input()
    set items(val:ItemList[]){
        this._lst = val;
    }

  
    get value(): any {
        return this._val;
    }

    @Input()
    set value(val:any) {
        this._val = val;
        this.valueChange.emit(this._val);
        this.change.emit(this._val);
    }


    selectChanged(ev:any){      
      this.value  = ev.value;    
      this.change.emit(ev.value);
    }
    
}