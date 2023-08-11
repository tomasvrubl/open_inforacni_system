import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ElementRef } from '@angular/core';

declare var jQuery : any;
@Component({
  selector: 'mw-modal-drop',
  template : 
        `<div class="modal" id="{{_id}}" tabindex="-1" role="dialog" >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Odstranění záznamu</h4>  
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>                  
                </div>
                <div class="modal-body">{{note}}</div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-bs-dismiss="modal" (click)="dismiss()">Ne, nechci</button>
                  <button type="button" class="btn btn-primary" (click)="yes()"  data-bs-dismiss="modal">Ano, chci odstranit</button>
                </div>
              </div>
            </div>
          </div>`
}) 
 

export class ModalDropForm implements OnInit, OnDestroy { 
   
     
    @Output() onYes = new EventEmitter();
    @Output() onDismiss = new EventEmitter();
    @Input() note: string;

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
        this.note = 'Opravdu odstranit tento záznam na trvalo?';
        this._id = "dropModal";
        this._val = this;
        
    }
    
    ngOnInit(): void { }
    
    
    ngOnDestroy(): void {
        jQuery('#'+this._id).off('show.bs.modal');        
    }
 
    yes() {  
        console.log(this._val);
        this.onYes.emit(this._val);
    }
    
    dismiss(){
        this.onDismiss.emit(this._val);
    }
    
}
