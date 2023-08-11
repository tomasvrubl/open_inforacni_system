import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AttachmentListComponent } from './attach.list';
import { Attachment } from './_obj/common';
import { UploadService } from './_services/upload.service';


@Component({
  selector: 'attach-frm',
  templateUrl : './_view/attach.frm.html',
  providers: []
})

export class AttachmentForm implements OnInit  { 

    @ViewChild('attlist') lst : AttachmentListComponent;
    
    _urlrec: string = ""; //adresa pod kterou se povedou zaznamy 
    @Input() modul: string = "modul";
    @Input() rec: Attachment = null;
    @Input() showSeznam: boolean = true;
    
    constructor(private serv: UploadService,
                private route: ActivatedRoute) {              
                
    }
        

        
    @Input() 
    set urlrec(val: string) {

        console.log('AttachmentForm:urlrec SETTER : ' + val);        
        this._urlrec = val;
        if(this._urlrec != null && this._urlrec.length > 0){
            this.reloadData();
        }
    }


    get urlrec() : string {

        return this._urlrec;
    }

    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 

            if(!params['id']){                   
                return Promise.resolve(null);
            }
            
            return this.serv.getAttachment(+params['id']);
        })).subscribe((rec: Attachment) => { 
                this.rec = rec;

        });

    }


    reloadData() {
        
        if(!this.lst || !this._urlrec)
            return;

        this.lst.urlrec = this._urlrec;
        this.lst.callReloadData();
    }
}