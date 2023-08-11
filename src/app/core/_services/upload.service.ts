import { Injectable }    from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { UploadStatus, Attachment, TableQuery, TableData, Response } from '../_obj/common';
import { map } from 'rxjs/operators';

declare var AppUrlWS : string;

@Injectable()
export class UploadService extends BaseService {


    constructor( http: HttpClient) { 
        super(http);
    }



    upload(file:any, modul?:string, urlrec?:string): Observable<UploadStatus> {

        const data  = new FormData();
        data.append('controller', 'ws\\Pomocne\\UploadFileController::uploadAttachment');
        data.append('modul', modul);
        data.append('urlrec', urlrec);
        data.append('file', file, file.name);
        
        
        return this.http.post(AppUrlWS, data, {
            reportProgress: true, 
            observe: 'events'
        }).pipe(map((resp: HttpEvent<any>) => {            
                if (resp.type === HttpEventType.Response) {                    
                    return new UploadStatus('DONE', 100, resp.body);
                }
                if (resp.type === HttpEventType.UploadProgress) {

                    var p = Math.round(100 * resp.loaded / resp.total);
                    return new UploadStatus('PROGRESS', p > 99 ? 99 : p);

                }                 
                return new UploadStatus('PENDING',0);
        }));
    }

    getAttachmentTable(query: TableQuery, urlrec: String) {    
        
        
        return this.post<TableData>({ tabquery: query, urlrec: urlrec, controller: 'ws\\Pomocne\\UploadFileController::getTable' });                     
    }

    updateAttachment(item: Attachment){
        return this.update<Response>(item, 'ws\\Pomocne\\UploadFileController::update');
    }
      
    getAttachment(id:number){
        return this.get<Attachment>(id, 'ws\\Pomocne\\UploadFileController::getAttachment', Attachment);
    }

    dropAttachment(item: Attachment){
        return this.drop<Response>(item.id, 'ws\\Pomocne\\UploadFileController::Drop');
    }
}