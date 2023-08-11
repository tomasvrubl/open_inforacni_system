import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, Response, TableQuery } from '../../core/module';
import { ObjMaterial, Telkontakt  } from '../_obj/organizace';
import { Firma  } from '../_obj/firma';

@Injectable()
export class OrganizaceService extends BaseService {


  constructor(protected http: HttpClient) {
      super(http);
  }

  getObjMaterialuTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Organizace\\OrganizaceController::getObjMaterialuTable');                          
  }

  getObjMaterialuPolTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Organizace\\OrganizaceController::getObjMaterialuPolTable');                          
  }

  getObjMaterialu(id:number){          
    return this.post<ObjMaterial>({ id: id, controller: 'ws\\Organizace\\OrganizaceController::getObjMaterialu'}).then(m => {
      return this.cast<ObjMaterial>(m, ObjMaterial);
    }); 
  }

  dropObjMaterialu(prac: ObjMaterial){
    return this.drop<Response>(prac.id, 'ws\\Organizace\\OrganizaceController::dropObjMaterialu');
  }

  updateObjMaterialu(prac: ObjMaterial){
    return this.update<Response>(prac, 'ws\\Organizace\\OrganizaceController::addObjMaterialu'); 
  }

  
  sendSchvaleniObjMaterialu(prac: ObjMaterial){
    return this.update<Response>(prac, 'ws\\Organizace\\OrganizaceController::setKSchvaleniObjMaterialu'); 
  }

  sendObjMaterialuPolObjednano(id: number, objednano: boolean){
    return this.update<Response>({id: id, objednano: objednano}, 'ws\\Organizace\\OrganizaceController::setObjMaterialuObjednano'); 
  }



  sendOdsouhlaseniObjMaterialu(prac: ObjMaterial){
    return this.update<Response>(prac, 'ws\\Organizace\\OrganizaceController::setOdsouhlaseniObjMaterialu'); 
  }

  sendVraceniObjMaterialu(prac: ObjMaterial){
    return this.update<Response>(prac, 'ws\\Organizace\\OrganizaceController::setVraceniObjMaterialu'); 
  }


  sendObjednanoObjMaterialu(prac: ObjMaterial){
    return this.update<Response>(prac, 'ws\\Organizace\\OrganizaceController::setObjednanoObjMaterialu'); 
  }


  getFirma(id:number){          
    return this.get<Firma>(id,  'ws\\Organizace\\FirmaController::Get', Firma);
  }
  

  dropFirma(firma: Firma){
    return this.drop<Response>(firma.id, 'ws\\Organizace\\FirmaController::Drop');
  }

  getFirmaTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Organizace\\FirmaController::getTable');                          
  }

  updateFirma(rec: Firma){
    return this.update<Response>(rec, 'ws\\Organizace\\FirmaController::Add'); 
  }

  

  getTelefonniSeznamTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Organizace\\TelefonController::getTable');                          
  }
  
  getKontakt(id:number, typ:number){  

    if (id == null || id < 1){                  
        return Promise.resolve(new Telkontakt());
    }

    return this.post<Telkontakt>({ id: id, typ: typ, controller: 'ws\\Organizace\\TelefonController::Get'});
  }
  
  updateKontakt(rec: Telkontakt){
    return this.update<Response>(rec, 'ws\\Organizace\\TelefonController::Add'); 
  }

  dropKontakt(firma: Telkontakt){
    return this.drop<Response>(firma.id, 'ws\\Organizace\\TelefonController::Drop');
  }

}

