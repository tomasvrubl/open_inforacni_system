import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'mw-time',
  styleUrls: [ './style.css' ],
  templateUrl: './time.html',
  providers: [],
})


export class MWTime { 


    id: string;
    _cas : string = '0:0';

    
    @Output() casChange = new EventEmitter();
    @Input() readonly : boolean = false;
    
    constructor(private _eref: ElementRef) { 
        this.id = this.makeid();
    }
    
    

    get cas(): string {
        return this._cas
    }

    @Input()
    set cas(val:string) {

        this._cas = val;
        this.casChange.emit(this._cas);
    }
    
    onChanged(ev:string){

        this._cas = ev;
        this.casChange.emit(this._cas);
    }

    makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}   