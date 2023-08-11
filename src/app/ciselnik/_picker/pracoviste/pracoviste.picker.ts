import { Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';


@Component({
  selector: 'mw-pracoviste-picker',
  templateUrl: './view.html'
})


export class PracovistePicker { 
   
    @Input() public elid : string;
    @Input() public nazev: string;
    @Input() public kod: string;
    @Input() public id: number;
    @Output() public onChange = new EventEmitter();

    showPracovisteList: boolean;

   
    constructor(private _eref: ElementRef) {
        this.elid = "mwwnd-id-"+Math.floor(Math.random()*1000);        
        this.nazev = "";
        this.kod = "";
        this.id = -1;
        this.showPracovisteList = false;
    }
    

    onPracovisteChanged(ev: any){

        this.nazev = ev.nazev;
        this.kod = ev.kod;
        this.id = ev.id;

        this.onChange.emit({kod: ev.kod, nazev: ev.nazev, id: ev.id});
        this.showPracovisteList = false;
    }
    
}
