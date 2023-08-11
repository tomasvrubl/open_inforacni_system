import { HttpClient } from '@angular/common/http';
import { Injectable }    from '@angular/core';
import { Response, Setting, TableQuery, MenuItem } from '../_obj/common';
import { BaseService } from './base.service';



@Injectable()
export class CommonService extends BaseService {


    constructor( http: HttpClient) { 
        super(http);
    }

  
  getSettingTable(query: TableQuery) {    
      return this.getTable(query, 'ws\\Pomocne\\CommonController::getSettingTable');                          
  }
  
  getSettingParamByCode(kod:string) : Promise<string> {   
       
    return this.post({ kod: kod, controller: 'ws\\Pomocne\\CommonController::getSettingParamByCode'})
            .then(response => response as string);
  }

  setSettingParamByCode(kod:string, value:string) : Promise<Response> {   
       
    return this.update<Response>({ kod: kod, param: value}, 'ws\\Pomocne\\CommonController::setSettingParamByCode');
  }
  
  getSettingParam(id:number){   
      return this.get<Setting>(id, 'ws\\Pomocne\\CommonController::getSettingParam', Setting);
  }
  
  updateSettingParam(param: Setting){            
      return this.update<Response>(param, 'ws\\Pomocne\\CommonController::updateSettingParam');
  }
  
  dropSettingParam(param: Setting){        
      return this.drop<Response>(param.id, 'ws\\Pomocne\\CommonController::dropSettingParam');
  } 
  
  getMenuItemTable(query: TableQuery) {    
      return this.getTable(query, 'ws\\Pomocne\\CommonController::getMenuItemTable');                          
  }
  
  getMenuItem(id:number){   
      return this.get<MenuItem>(id, 'ws\\Pomocne\\CommonController::getMenuItem', MenuItem);
  }
  
  getMenuItemList(parentid:number) : Promise<MenuItem[]> {      
        
        var t = this;

        return this.post( { parentid: parentid,  controller: 'ws\\Pomocne\\CommonController::getMenuItemList' })
              .then(function(response : any){
                    var list : MenuItem[];                    
                    list = response;

                    for(var i=0; i < list.length; ++i){                
                        list[i] = t.cast<MenuItem>(list[i], MenuItem);                          
                    }
                    
                    return list;   
          } );  
  }
  
  updateMenuItem(param: MenuItem){            
      return this.update<Response>(param, 'ws\\Pomocne\\CommonController::updateMenuItem');
  }
  
  dropMenuItem(param: MenuItem){        
      return this.drop<Response>(param.id, 'ws\\Pomocne\\CommonController::dropMenuItem');
  } 
  
  
  
}

