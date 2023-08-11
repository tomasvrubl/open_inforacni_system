import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Attachment, iDetail, Response } from './_obj/common';
import { UploadService } from './_services/upload.service';


@Component({
  selector: 'attach-detail',
  templateUrl : './_view/attach.detail.html',
  providers: [ ]
})

export class AttachmentDetailComponent implements iDetail { 

    response : Response;  
    _att : Attachment = null;    
    @Output() attachmentChanged = new EventEmitter();
    @Input() modul: string;
    @Input() urlrec: string;
    
    constructor(private serv: UploadService) {                      
        this.response = new Response();    
    }
    
    @Input() 
    set detail(val : Attachment){        
        this._att = val;                  
    } 

    
    get detail(): Attachment{
        return this._att;
    }


    onSubmit() {}
    
    saveme() {
        this.serv.updateAttachment(this._att).then((r: Response) => {
            this.response = r;
            this._att = r.data;
            this.attachmentChanged.emit(this);
       });        
    }
    
    newone(){
        this._att = null;
    }
    
    edit(id:number){
        this.serv.getAttachment(id).then((j: Attachment) => {
            this._att = j
            if(this._att.id < 0){
                this._att = null;
            }
        });
    }
    
    dropme(){        
        this.serv.dropAttachment(this._att).then((r:Response) => {
             this.response = r;
            if (r.kod == 0){
                this._att = null;
            }  
        });            
    }
    
   
}