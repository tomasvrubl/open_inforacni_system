import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Response, TableQuery, BaseService } from '../../core/module';
import { HlaseniTyp, Hlaseni } from '../_obj/hlaseni';

 
@Injectable()
export class HlaseniService extends BaseService {


  constructor(protected http:  HttpClient) {
    super(http);
  }

  
  getHlaseniTypTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\HlaseniController::getTableHlaseniTyp');                          
  }
  
  getHlaseniTyp(id:number){      
    return this.get<HlaseniTyp>(id, 'ws\\Ciselnik\\HlaseniController::getHlaseniTyp', HlaseniTyp);
  }
  
  updateHlaseniTyp(prac: HlaseniTyp){            
    return this.update<Response>(prac, 'ws\\Ciselnik\\HlaseniController::addHlaseniTyp');
  }
  
  dropHlaseniTyp(prac: HlaseniTyp){
    return this.drop<Response>(prac.id, 'ws\\Ciselnik\\HlaseniController::dropHlaseniTyp');
  }
 
  
  getHlaseniTypList(): Promise<any[]> {        
    return this.post<any[]>({controller: 'ws\\Ciselnik\\HlaseniController::GetHlaseniTypList' });
  }
  
  getHlaseni(stav: number[]) : Promise<Hlaseni[]> {
    return this.post<Hlaseni[]>({ stav: stav, controller: 'ws\\Ciselnik\\HlaseniController::GetHlaseni' });          
  }
  
  updateHlaseni(hlaseni: Hlaseni){            
    return this.update<Response>(hlaseni, 'ws\\Ciselnik\\HlaseniController::Add');
  }
  

  getHlaseniDet(id:number){      
      return this.get<Hlaseni>(id, 'ws\\Ciselnik\\HlaseniController::Get', Hlaseni);
  }
  
}

