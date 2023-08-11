import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ElementRef } from '@angular/core';

declare var jQuery : any;
@Component({
  selector: 'mw-modal-common',
  template : 
        `<div class="modal modal-common" id="{{id}}" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="myModalLabel">{{title}}</h4>
                  <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body"><ng-content></ng-content></div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-bs-dismiss="modal">{{noLabel}}</button>
                  <button type="button" class="btn btn-primary" (click)="yes()"  data-bs-dismiss="modal">{{yesLabel}}</button>
                </div>
              </div>
            </div>
          </div>`
})

 
export class ModalCommonForm { 

    @Input() title: string;
    @Input() yesLabel: string;
    @Input() noLabel: string;
     
    @Output() onYes = new EventEmitter();
    @Output() onDismiss = new EventEmitter();
    
    _id : string;
    @Input()    
    set id(val){
        
        var prev = this._id;
        this._id = val;
        
        var t  = this;
        
        jQuery(function(){
            jQuery('#'+prev).off('show.bs.modal');
            
            jQuery('#'+t._id).on('show.bs.modal', function(e) {               
                t._val = jQuery(e.relatedTarget).attr('value');                
            });

        });
        
    }
    
    get id(){
        return this._id;
    }
    
    _val : any;
    
    constructor(private _eref: ElementRef) {
        
        this.yesLabel = "Ano";
        this.noLabel = "Ne";
        
    }
 
    yes() {  
        this.onYes.emit(this._val);
    }
    
    dismiss(){
        this.onDismiss.emit(this._val);
    }
    
}
