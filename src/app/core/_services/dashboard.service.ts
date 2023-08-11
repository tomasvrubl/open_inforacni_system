import { HttpClient } from '@angular/common/http';
import { Injectable }    from '@angular/core';

import { Widget, Response } from '../_obj/common';
import { BaseService } from './base.service';

 
@Injectable()
export class DashboardService extends BaseService {

  constructor( http: HttpClient) { 
    super(http);
  }

    
  getUserDashboard() : Promise<Widget[]> {
    
    var t = this;
    return this.post({ controller: 'ws\\Klient\\DashboardController::getWidgets' })
                .then(function(response : any){
                    var list: Widget[];                    
                    list = response;
                    for(var i=0; i < list.length; ++i){                       
                       list[i] = t.cast<Widget>(list[i], Widget);                                  
                    }
                    return list;
                            
                });  
  }

  saveUserDashboard(widget: Widget[]) : Promise<Response> {
     
    var t = this;
    return this.post({ widget: widget, controller: 'ws\\Klient\\DashboardController::updateWidgets' })
                .then(function(response : any){
                    var list: Widget[], resp: Response;
                    resp = response;
                    list = resp.data;
                    
                    for(var i=0; i < list.length; ++i){                       
                       list[i] = t.cast<Widget>(list[i], Widget);                                  
                    }
                    return resp;
                            
              });  
  }
  
  
  addToDashboard(widget: Widget) : Promise<Response> {
    var data = { widget: widget, controller: 'ws\\Klient\\DashboardController::addWidget' };  
    return this.post<Response>(data);    
  }

      
}

