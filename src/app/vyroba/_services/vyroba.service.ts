import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService, Response, TableQuery } from '../../core/module';
import { Odvadeni, VyrZapisSmeny, VyrZapisSmenyZarazeni, VyrZarazeni, Zakazka } from '../_obj/vyroba';
import * as moment from 'moment';

@Injectable()
export class VyrobaService extends BaseService {


  constructor(protected http:HttpClient) {
    super(http);
  }
  
  getVyrOsobaTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Vyroba\\CiselnikController::getOsobaTable');                          
  }


  getOdvadeniTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Vyroba\\OdvadeniController::getTable');                          
  }
  
  getOdvadeni(id:number){     
      
      if(id < 0){
        let odv = new Odvadeni();
        odv.datum = moment().format('DD.MM.YYYY');
        
        return Promise.resolve(odv);
      }
       
      return this.get<Odvadeni>(id, 'ws\\Vyroba\\OdvadeniController::Get', Odvadeni);
  }
  
  updateOdvadeni(odv: Odvadeni){            
    return this.update<Response>(odv, 'ws\\Vyroba\\OdvadeniController::Add');
  }
  
  dropOdvadeni(odv: Odvadeni){
    return this.drop<Response>(odv.id, 'ws\\Vyroba\\OdvadeniController::Drop');
  }


  getZakazkaTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Vyroba\\ZakazkaController::getTable');                          
  }
  
  getZakazka(id:number){      
      return this.get<Zakazka>(id, 'ws\\Vyroba\\ZakazkaController::Get', Zakazka);
  }
  
  updateZakazka(odv: Zakazka){            
    return this.update<Response>(odv, 'ws\\Vyroba\\ZakazkaController::Add');
  }
  
  dropZakazka(odv: Zakazka){
    return this.drop<Response>(odv.id, 'ws\\Vyroba\\ZakazkaController::Drop');
  }
  

  // vyroba zarazeni zamestnance na pozici, pracovni zarazeni
  getZarazeniTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Vyroba\\ZarazeniController::getTable');                          
  }
  
  getZarazeni(id:number){      
      return this.get<VyrZarazeni>(id, 'ws\\Vyroba\\ZarazeniController::Get', VyrZarazeni);
  }
  
  updateZarazeni(odv: VyrZarazeni){            
    return this.update<Response>(odv, 'ws\\Vyroba\\ZarazeniController::Add');
  }
  
  dropZarazeni(odv: VyrZarazeni){
    return this.drop<Response>(odv.id, 'ws\\Vyroba\\ZarazeniController::Drop');
  }

  getZarazeniList(zdroj_id:number, pracoviste_id:number): Promise<VyrZarazeni[]>  {
    return this.post({ zdrojid: zdroj_id, pracovisteid: pracoviste_id, controller: 'ws\\Vyroba\\ZarazeniController::GetZarazeniList' });
  }

  // vyroba zapis smeny
  getZapisSmenyTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Vyroba\\ZapisSmenyController::getTable');                          
  }
  
  getZapisSmeny(id:number){      
      return this.get<VyrZapisSmeny>(id, 'ws\\Vyroba\\ZapisSmenyController::Get', VyrZapisSmeny);
  }
  
  updateZapisSmeny(odv: VyrZapisSmeny){            
    return this.update<Response>(odv, 'ws\\Vyroba\\ZapisSmenyController::Add');
  }
  
  dropZapisSmeny(odv: VyrZapisSmeny){
    return this.drop<Response>(odv.id, 'ws\\Vyroba\\ZapisSmenyController::Drop');
  }

  getZapisSmenaZarazeniList(zdroj_id:number, pracoviste_id:number, zapisid:number): Promise<VyrZapisSmenyZarazeni[]>  {
    return this.post({ zdrojid: zdroj_id, pracovisteid: pracoviste_id, zapisid, controller: 'ws\\Vyroba\\ZapisSmenyController::getZapisZarazeniList' });
  }



}

