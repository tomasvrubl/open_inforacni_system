
import { Injectable }    from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { UploadStatus, ReportPrint, TableQuery, TableData, Response } from '../_obj/common';
import { map } from 'rxjs/operators';

declare var AppUrlWS : string;

@Injectable()
export class ReportService extends BaseService {


    constructor( http: HttpClient) { 
        super(http);
    }

    upload(file:any, id:number, urlrec?:string): Observable<UploadStatus> {

        const data  = new FormData();
        data.append('controller', 'ws\\Pomocne\\ReportController::upload');
        data.append('id', id+'');
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

    getTable(query: TableQuery, urlrec: String) {    
        return this.post<TableData>({ tabquery: query, urlrec: urlrec, controller: 'ws\\Pomocne\\ReportController::getTable' });                     
    }

    updateReport(item: ReportPrint){
        return this.update<Response>(item, 'ws\\Pomocne\\ReportController::update');
    }


    getReport(id:number){

        if(id < 0){
            let r = new ReportPrint();            
            return Promise.resolve(r);
        }

        return this.get<ReportPrint>(id, 'ws\\Pomocne\\ReportController::get', ReportPrint);
    }

    dropReport(item: ReportPrint){
        return this.drop<Response>(item.id, 'ws\\Pomocne\\ReportController::drop');
    }
}