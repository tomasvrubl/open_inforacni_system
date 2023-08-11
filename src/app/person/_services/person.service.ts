import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService, Response, TableQuery, Osoba, ItemList } from '../../core/module';
import { Odmena, PersPracKategorie } from '../_obj/person';
import * as moment from 'moment';

@Injectable()
export class PersonService extends BaseService {


  constructor(protected http:HttpClient) {
    super(http);
  }
  

  /** OSOBA */

  getOsobaTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Person\\OsobaController::getTable');                          
  }  

  getOsoba(id:number){      
    return this.get<Osoba>(id, 'ws\\Person\\OsobaController::getOsoba', Osoba).then(r =>  {
      r.datum_narozeni = moment(r.datum_narozeni).toDate();
      return r;
    });
  }

  updateOsoba(osoba: Osoba){            
    return this.update<Response>(osoba, 'ws\\Person\\OsobaController::Add');
  }

  dropOsoba(osoba: Osoba){
    return this.drop<Response>(osoba.id, 'ws\\Person\\OsobaController::Drop');
  }

  /*** pracovni kategorie */

  getPracovniKategorieTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Person\\PracKatController::getTable');                          
  }

  getPracovniKategorie(id:number){      
    return this.get<PersPracKategorie>(id, 'ws\\Person\\PracKatController::Get', PersPracKategorie);
  }

  updatePracovniKategorie(kat: PersPracKategorie){            
    return this.update<Response>(kat, 'ws\\Person\\PracKatController::Add');
  }

  dropPracovniKategorie(kat: PersPracKategorie){
    return this.drop<Response>(kat.id, 'ws\\Person\\PracKatController::Drop');
  }

  getPracovniKategorieCBO() : Promise<ItemList[]> {
    return this.post({ controller: 'ws\\Person\\PracKatController::GetCBO' });
  }


  /**** Odmeny */

  getOdmenyTable(query: TableQuery) {    

    return this.getTable(query, 'ws\\Person\\OdmenaController::getTable');                          
  }
  
  getOdmena(id:number){     
      
      if(id < 0){
        return Promise.resolve(new Odmena());
      }
       
      return this.get<Odmena>(id, 'ws\\Person\\OdmenaController::Get', Odmena);
  }
  
  updateOdmena(odv: Odmena){            
    return this.update<Response>(odv, 'ws\\Person\\OdmenaController::Add');
  }
  
  vyplacenoOdmena(odv: Odmena){            
    return this.update<Response>(odv, 'ws\\Person\\OdmenaController::Vyplatit');
  }


  dropOdmena(odv: Odmena){
    return this.drop<Response>(odv.id, 'ws\\Person\\OdmenaController::Drop');
  }
  
}

