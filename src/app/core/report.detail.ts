import { Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { ReportPrint, iDetail, Response } from './_obj/common';
import { ReportService } from './_services/report.service';


@Component({
  selector: 'report-detail',
  templateUrl : './_view/report.detail.html',
  styleUrls: [ './_view/uploader.scss' ],
  providers: [ ]
})

export class ReportDetailComponent implements iDetail { 


    
    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    files: any[] = [];

    response : Response;  
    _det : ReportPrint = new ReportPrint();    
    @Output() reportChanged = new EventEmitter();
    _urlrec: string;
    _state: number = 0; // 0 - upload, 1 - progress, 2 - done
    
    constructor(private serv: ReportService) {                      
        this.response = new Response();    
    }
    
    @Input() 
    set detail(val : ReportPrint){       
        
        if(val == null){
            this._det = new ReportPrint();
        }
        else{
            this._det = val;
        }
        
        if(this._det.id > 0){
            this._state = 2;
        }
        else{
            this._state = 0;
        }
    } 

    
    get detail(): ReportPrint {
        return this._det;
    }

    @Input() 
    set urlrec(val : string){       
        
        if(val == null){
            this._urlrec = "";
        }
        else{
            this._urlrec = val;
        }

        this.detail.url_rec = this._urlrec;        
    } 

    
    get urlrec(): string {
        return this._urlrec;
    }


    saveme() {
        this.serv.updateReport(this._det).then((r: Response) => {
            this.response = r;
            this._det = r.data;
            this.reportChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }
    
    edit(id:number){
        this.serv.getReport(id).then((j: ReportPrint) => {
            this._det = j
            this._det.url_rec = this.urlrec;

            if(this._det.id > 0){
                this._state = 2;
            }
            else{
                this._state = 0;
            }

        });
    }
    
    dropme(){        
        this.serv.dropReport(this._det).then((r:Response) => {
            this.response = r;
            this.newone();
        });            
    }

    onFileDropped($event) {
        this.prepareFilesList($event);
    }

    prepareFilesList(files: Array<any>) {

        this._state = 1
        for(const item  of files){
            
            item.progress = 0;
            this.files.push(item);

            this.serv.upload(item, this._det.id, this.urlrec).subscribe(stav=>{
                item.progress = stav.progress;
                item.url = '';
                if(item.progress === 100 && stav.response){              
                    var d = stav.response.data;
                    item.url = d.url;  
                    
                    this._det.id = d.id
                    this._det.url = d.url;  
                    this._det.url_rec = d.url_rec;
                    this._det.path = d.path;
                    this._det.zmeneno = d.zmeneno;
                    this._det.zmenil = d.zmenil;
                    this._state = 2;
                }
            });          
            break;
        }

        this.fileDropEl.nativeElement.value = "";

    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return "0 Bytes";
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    fileBrowseHandler(files) {
        this.prepareFilesList(files);
    }
    
    clearFile(){
        this.files = [];
        this._state = 0;
    }
}