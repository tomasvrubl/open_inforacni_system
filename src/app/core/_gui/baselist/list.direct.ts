import { Directive, HostListener, Output, EventEmitter, Input} from '@angular/core';
import { TableQuery} from '../../_obj/common';

@Directive({
    selector: '[listRef]'
  })

export class ListRefDirective {
  
    @Output() onSelected = new EventEmitter();
    @Input()  isSelector : boolean = false;    
    @Output() isSelectorChange: EventEmitter<any> = new EventEmitter();
    
    @Input() filter: TableQuery = new TableQuery();
    @Output() filterChange: EventEmitter<any> = new EventEmitter();


    @HostListener("onSelectedEvent", ['$event'])
    onListSelectedEvent(event:any){
        this.onSelected.emit(event);
    }


}