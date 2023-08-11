import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { iDetail, Response, Setting, CommonService } from '../core/module';


@Component({
  selector: 'setting-detail',
  templateUrl : './_view/setting.detail.html',
  providers: [ ]
})

export class SettingDetailComponent implements iDetail { 

    response : Response = new Response();  
    _detail : Setting = new Setting();    
    @Output() paramChanged = new EventEmitter();
    
    constructor(private comService: CommonService) {              
        this.response ;    
    }

    get detail(): Setting{
        return this._detail;
    }

    @Input() 
    set detail(val : Setting){
        
        if(val == null){
            this._detail = new Setting();
        }
        else{
            this._detail = val;
        }
        
    } 
    
   
    saveme() {
       this.comService.updateSettingParam(this._detail).then((resp :Response) => {
            this.response = resp;
            this._detail = resp.data;
            this.paramChanged.emit(this);
        });        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.comService.getSettingParam(id).then((j: Setting) => this._detail = j);
    }
    
    dropme(){        

        this.comService.dropSettingParam(this._detail).then((resp :Response) => {
            this.response = resp;        
            if (resp.kod == 0){
                this.newone();
            }   
        });    

    }
    
    

    
}