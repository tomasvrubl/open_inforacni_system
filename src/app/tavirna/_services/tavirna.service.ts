import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, Response, TableQuery, TableData } from '../../core/module';
import { JakostKov, JakostKovSlozeni, TavirnaPec,LabVzorek } from '../_obj/tavirna';


@Injectable()
export class TavirnaService extends BaseService {

  constructor(protected http:HttpClient) {
    super(http);
  }
  
  getJakostTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Tavirna\\TavirnaController::getTable');                          
  }
  
  getJakost(id:number){      
      return this.get<JakostKov>(id, 'ws\\Tavirna\\TavirnaController::GetJakost', JakostKov);
  }
  
  updateJakost(prac: JakostKov){            
    return this.update<Response>(prac, 'ws\\Tavirna\\TavirnaController::Add');
  }
  
  dropJakost(prac: JakostKov){
    return this.drop<Response>(prac.id, 'ws\\Tavirna\\TavirnaController::Drop');
  }

  getJakostSlozeni(jakostid: number) : Promise<JakostKovSlozeni[]>{
    
    var data = {jakostid: jakostid, controller: 'ws\\Tavirna\\TavirnaController::GetSlozeni' };   
    return this.post<JakostKovSlozeni[]>(data);
  }

  dropJakostSlozeni(id: number){
    return this.drop<Response>(id, 'ws\\Tavirna\\TavirnaController::DropSlozeni');
  }
  

  addJakostKarta(jakostid: number, lst:JakostKovSlozeni[]){    
    var data = {jakostid: jakostid, lst: lst, controller: 'ws\\Tavirna\\TavirnaController::AddKartaSlozeni' };   
    return this.post<Response>(data);
  }

  /*** Definice pece */

  getPecTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Tavirna\\PecController::getTable');                          
  }
  
  getPec(id:number){      
      return this.get<TavirnaPec>(id, 'ws\\Tavirna\\PecController::Get', TavirnaPec);
  }
  
  updatePec(prac: TavirnaPec){            
    return this.update<Response>(prac, 'ws\\Tavirna\\PecController::Add');
  }
  
  dropPec(prac: TavirnaPec){
    return this.drop<Response>(prac.id, 'ws\\Tavirna\\PecController::Drop');
  }

  getPecHistorieKampaniTable(pecid:number, query?: TableQuery) {    

    return this.post<TableData>({ pecid: pecid, tabquery: query, controller: 'ws\\Tavirna\\PecController::GetHistorieKampane' });
  }


  /*** Definice laboratorni vzorky */

  getLabVzorekTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Tavirna\\LabController::getTable');                          
  }
  
  getLabVzorek(id:number){      
      return this.get<LabVzorek>(id, 'ws\\Tavirna\\LabController::Get', LabVzorek);
  }
  
  updateLabVzorek(prac: LabVzorek){            
    return this.update<Response>(prac, 'ws\\Tavirna\\LabController::Add');
  }
  
  dropLabVzorek(prac: LabVzorek){
    return this.drop<Response>(prac.id, 'ws\\Tavirna\\LabController::Drop');
  }

}

