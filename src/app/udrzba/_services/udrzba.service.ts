import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, Response, TableQuery } from '../../core/module';
import { ZapisPoruchy, VykazPrace } from '../_obj/udrzba';


@Injectable()
export class UdrzbaService extends BaseService {

  constructor(protected http:HttpClient) {
    super(http);
  }
  
  getZapisPoruchyTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Udrzba\\PoruchyController::getTable');                          
  }
  
  getZapisPoruchy(id:number){      
    
      return this.get<ZapisPoruchy>(id, 'ws\\Udrzba\\PoruchyController::Get', ZapisPoruchy);
  }
  
  updateZapisPoruchy(prac: ZapisPoruchy){            
    return this.update<Response>(prac, 'ws\\Udrzba\\PoruchyController::Add');
  }
  
  dropZapisPoruchy(prac: ZapisPoruchy){
    return this.drop<Response>(prac.id, 'ws\\Udrzba\\PoruchyController::Drop');
  }


  getVykazPraceTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Udrzba\\VykazPraceController::getTable');                          
  }
  
  getVykazPrace(id:number){      
    
      return this.get<VykazPrace>(id, 'ws\\Udrzba\\VykazPraceController::Get', VykazPrace);
  }
  
  updateVykazPrace(prac: VykazPrace){            
    return this.update<Response>(prac, 'ws\\Udrzba\\VykazPraceController::Add');
  }
  
  dropVykazPrace(prac: VykazPrace){
    return this.drop<Response>(prac.id, 'ws\\Udrzba\\VykazPraceController::Drop');
  }

 

}

