import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, Response, TableQuery, ItemList } from '../../core/module';
import { PostaAlias, PostaDomena, PostaUser } from '../_obj/posta';


@Injectable()
export class PostaService extends BaseService {


  constructor(protected http: HttpClient) {
      super(http);
  }

  getAliasTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Posta\\PostaController::getAliasTable');                          
  }

  getDomenyCBO() : Promise<ItemList[]> {
    return this.post({ controller: 'ws\\Posta\\PostaController::getDomainList' });      
  }
  
  getAlias(id:number){  
    return this.get<PostaAlias>(id,  'ws\\Posta\\PostaController::GetAlias', PostaAlias);
  }
  
  updateAlias(rec: PostaAlias){
    return this.update<Response>(rec, 'ws\\Posta\\PostaController::AddAlias'); 
  }

  dropAlias(firma: PostaAlias){
    return this.drop<Response>(firma.id, 'ws\\Posta\\PostaController::DropAlias');
  }

  getDomainTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Posta\\PostaController::getDomainTable');                          
  }

  getDomain(id:number){  
    return this.get<PostaDomena>(id,  'ws\\Posta\\PostaController::GetDomain', PostaDomena);
  }
  
  updateDomain(rec: PostaDomena){
    return this.update<Response>(rec, 'ws\\Posta\\PostaController::AddDomain'); 
  }

  dropDomain(firma: PostaDomena){
    return this.drop<Response>(firma.id, 'ws\\Posta\\PostaController::DropDomain');
  }


  getEmailTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Posta\\PostaController::getEmailTable');                          
  }

  getEmail(id:number){  
    return this.get<PostaUser>(id,  'ws\\Posta\\PostaController::GetEmail', PostaUser);
  }
  
  updateEmail(rec: PostaUser){
    return this.update<Response>(rec, 'ws\\Posta\\PostaController::AddEmail'); 
  }

  dropEmail(firma: PostaUser){
    return this.drop<Response>(firma.id, 'ws\\Posta\\PostaController::DropEmail');
  }

}

