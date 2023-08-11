import { Component, ViewChild, Input, ElementRef, Output, EventEmitter} from '@angular/core';
import { UploadService } from './_services/upload.service';


@Component({
  selector: 'mw-uploader',
  styleUrls: [ './_view/uploader.scss' ],
  templateUrl: './_view/uploader.html'
})


export class UploaderComponent { 
      
    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    files: any[] = [];

    @Input()
    public modul:string = "modul";
    @Input()
    public urlrec:string = "";

    @Output() uploadDone = new EventEmitter();
    
    
    constructor(private serv: UploadService) { 
        
    }

    onFileDropped($event) {
      this.prepareFilesList($event);
    }

    prepareFilesList(files: Array<any>) {
      for (const item of files) {
        item.progress = 0;
        this.files.push(item);

        var lst = this.files;

        this.serv.upload(item, this.modul, this.urlrec).subscribe(stav=>{
            item.progress = stav.progress;
            item.url = '';
            if(item.progress === 100 && stav.response){              
              item.url = stav.response.data.url;  
                          
              this.uploadDone.emit(stav.response);
              setTimeout(()=>{                  
                var index = lst.indexOf(item);
                if (index !== -1) {
                  lst.splice(index, 1);
                }
              }, 300);
            }
        });
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


    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
      this.prepareFilesList(files);
    }
  
    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number) {
      if (this.files[index].progress < 100) {
        return;
      }
      this.files.splice(index, 1);
    }    
        
}