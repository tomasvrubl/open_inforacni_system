import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService, Response, TableQuery } from '../../core/module';
import { Auto, AutoVykaz, AutoVykazSumar, AutoVykazTempl } from '../_obj/cestak';


@Injectable()
export class CestakService extends BaseService {


  constructor(protected http: HttpClient) {
    super(http);
  }

  getAutoTable(query: TableQuery) {      
    return this.getTable(query, 'ws\\Cestak\\AutaController::autoTable');                                     
  }
  
  getAuto(id: number) {      
    return this.get<Auto>(id, 'ws\\Cestak\\AutaController::getAuto', Auto);
  }
  
 
  updateAuto(auto: Auto){            
    return this.update<Response>(auto, 'ws\\Cestak\\AutaController::autoAdd');
  }
  
  dropAuto(auto: Auto){      
    return this.drop<Response>(auto.id, 'ws\\Cestak\\AutaController::autoDrop');
  }
  
  getAutaOsoby(osoba_id: number): Promise<Auto[]>{      
    var data = { osobaid: osoba_id, controller: 'ws\\Cestak\\AutaController::autoOsoba' };    
    return this.post<Auto[]>(data); 
  }
  
  
  getMesicniVykaz(id:number) : Promise<AutoVykazSumar> {
      
      var t = this;
      
      return this.post({ id: id, controller: 'ws\\Cestak\\CestakController::getMesicniVykaz' })
            .then(function(response : any){

           var list : AutoVykaz[];
           var sumar : AutoVykazSumar;

           sumar = t.cast<AutoVykazSumar>(response, AutoVykazSumar);
           list = sumar.list;

            var d : string[];
            for(var i=0; i < list.length; ++i){
               d = (list[i].datum + '').split('-');

               list[i].datum = new Date(parseInt(d[0]), parseInt(d[1])-1, parseInt(d[2])); 
               list[i] = t.cast<AutoVykaz>(list[i], AutoVykaz);  
               list[i].genHash();                        
            }

            return sumar;   
        } );   
  }
  
  getMesicniSumar(rok:number, mesic:number, autoid:number, osobaid: number) : Promise<AutoVykazSumar> {
          
      var t = this;
      
      return this.post({ rok: rok, mesic: mesic, autoid: autoid, osobaid: osobaid, controller: 'ws\\Cestak\\CestakController::getVykazSumar' })
                        .then(function(response : any){

                          var list : AutoVykaz[];
                          var sumar : AutoVykazSumar;
                        
                          sumar = t.cast<AutoVykazSumar>(response, AutoVykazSumar);
                          list = sumar.list;
                          
                          var d : string[];
                          for(var i=0; i < list.length; ++i){
                              d = (list[i].datum + '').split('-');

                              list[i].datum = new Date(parseInt(d[0]), parseInt(d[1])-1, parseInt(d[2])); 
                              list[i] = t.cast<AutoVykaz>(list[i], AutoVykaz);                          
                              list[i].genHash();
                          }

                          return sumar;   

                    } );                  
  }
  
  updateMesicniSumar(o: AutoVykazSumar) : Promise<Response> {
      
    var t = this;

    return this.post({ vykaz: o, controller: 'ws\\Cestak\\CestakController::updateVykazSumar'})
                        .then(function(resp : any){
                    
                       var list : AutoVykaz[];
                       var sumar : AutoVykazSumar;
                     
                       sumar = t.cast<AutoVykazSumar>(resp.data, AutoVykazSumar);
                       list = sumar.list;
                       
                        var d : string[];
                        for(var i=0; i < list.length; ++i){
                           d = (list[i].datum + '').split('-');

                           list[i].datum = new Date(parseInt(d[0]), parseInt(d[1])-1, parseInt(d[2])); 
                           list[i] = t.cast<AutoVykaz>(list[i], AutoVykaz);   
                           list[i].genHash();                       
                        }

                        return resp;   
                    } );  
  }
  
  clearMesicniVykaz(osobaid: number, rok: number, mesic:number, autoid: number): Promise<Response> {
           
    var t = this;

    return this.post({ userid: osobaid, mesic: mesic, rok: rok, autoid: autoid, controller: 'ws\\Cestak\\CestakController::clearVykazSumar' })
                        .then(function(resp : any){
                    
                       var list : AutoVykaz[];
                       var sumar : AutoVykazSumar;
                     
                       sumar = t.cast<AutoVykazSumar>(resp.data, AutoVykazSumar);
                       list = sumar.list;
                       
                        var d : string[];
                        for(var i=0; i < list.length; ++i){
                           d = (list[i].datum + '').split('-');

                           list[i].datum = new Date(parseInt(d[0]), parseInt(d[1])-1, parseInt(d[2])); 
                           list[i] = t.cast<AutoVykaz>(list[i], AutoVykaz); 
                           list[i].genHash();                         
                        }

                        return resp;   
                    } );    
  }
  


  getReportVykazTable(query: TableQuery) {      
    return this.getTable(query, 'ws\\Cestak\\CestakController::reportVykazTable');                                     
  }
  
  
  dropReportVykaz(el: any){
     return this.drop<Response>(el.id, 'ws\\Cestak\\CestakController::dropReportVykaz');
  }
  
  getAutoVykazUserTemplate() : Promise<AutoVykazTempl[]>{
      
    var data = { controller: 'ws\\Cestak\\CestakController::getAutoVykazUserTemplate' };          
    return this.post<AutoVykazTempl[]>(data); 
  }
  
  generateAutoVykazUserTemplate() : Promise<AutoVykazTempl[]>{
      
    var data = { controller: 'ws\\Cestak\\CestakController::generateAutoVykazUserTemplate' };         
    return this.post<AutoVykazTempl[]>(data); 
  }
  
  
  udateAutoVykazUserTemplate(list: AutoVykazTempl[]) : Promise<Response> {
      
    var data = { list: list, controller: 'ws\\Cestak\\CestakController::udateAutoVykazUserTemplate' };        
    return this.post<Response>(data); 
  }
  
  
  dropAutoVykazUserTemplate(list: AutoVykazTempl[]) : Promise<Response> {
    var data = { list: list, controller: 'ws\\Cestak\\CestakController::dropAutoVykazUserTemplate' };          
    return this.post<Response>(data); 
  }
  
}

