import { Input, Output, EventEmitter, Component} from '@angular/core';
import { iDetail, Response } from '../../_obj/common';


//definice detailu komponenty je pouzita pro formular
@Component({
    selector: 'detail-component',
    template : '',
    viewProviders: [],
    providers : [ ]
})
export class DetailComponent implements iDetail {

    _rec : any = null;
    _urlrec : string = "nenidefinovano";
    response : Response = new Response();  
    @Output() detailChanged = new EventEmitter();
    @Output() onUrlRecChangeEvent = new EventEmitter();

    

    saveme() { }

    newone() { 
        this.edit(-1);
    }

    edit(id:number) {
        this.detailChanged.emit(this);    
    }

    dropme() {}

    
    @Input() 
    set detail(val : any){
        
        
        if(val == null){
           return;
        }
        else{
            this._rec = val;
        }            
        
    } 
        
    get detail(): any {
        return this._rec;
    }


    @Input() 
    set urlrec(val : string){
        
        if(val == null){
            this._urlrec = "";
        }
        else{
           this._urlrec = val;
        }

        this.onUrlRecChangeEvent.emit(this._urlrec);
    } 

    
    get urlrec(): string {
        return this._urlrec;
    }


}
