import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService, Response, TableQuery, TableData, ItemList } from '../../core/module';
import { Pracoviste, Zdroj, Operace, Vada, Sklad, SkladKarta, Kalendar, KalendarSmena, MernaJednotka, Porucha } from '../_obj/ciselnik';



@Injectable()
export class CiselnikService extends BaseService {


  constructor(protected http:  HttpClient) {
      super(http);
  }

  
  getPracovisteTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\PracovisteController::getTable');                          
  }
  
  getPracoviste(id:number){      
      return this.get<Pracoviste>(id, 'ws\\Ciselnik\\PracovisteController::getPracoviste', Pracoviste);
  }

  searchPracoviste(kod:string, maxresult:number = 10) : Promise<Pracoviste[]>{
    var data = {kod: kod, maxresult: maxresult, controller: 'ws\\Ciselnik\\PracovisteController::searchPracoviste' };   
    return this.post<Pracoviste[]>(data);
  }
  
  updatePracoviste(prac: Pracoviste){            
    return this.update<Response>(prac, 'ws\\Ciselnik\\PracovisteController::Add');
  }
  
  dropPracoviste(prac: Pracoviste){
    return this.drop<Response>(prac.id, 'ws\\Ciselnik\\PracovisteController::Drop');
  }

  getOperaceTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\OperaceController::getTable');                          
  }
  
  getOperace(id:number){      
      return this.get<Operace>(id, 'ws\\Ciselnik\\OperaceController::getOperace', Operace);
  }
  
  updateOperace(prac: Operace){            
    return this.update<Response>(prac, 'ws\\Ciselnik\\OperaceController::Add');
  }
  
  dropOperace(prac: Operace){
    return this.drop<Response>(prac.id, 'ws\\Ciselnik\\OperaceController::Drop');
  }
  
  getOperaceZdrojTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\OperaceController::getTableZdroj');                          
  }

  getZdrojTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\ZdrojController::getTable');                          
  }

  getZdroj(id:number){      
      return this.get<Zdroj>(id, 'ws\\Ciselnik\\ZdrojController::getZdroj', Zdroj);
  }
  
  getZdrojList(pracoviste:Pracoviste): Promise<Zdroj[]> {      
      
      if(pracoviste.id < 0){
          return Promise.resolve([]);
      }

      var t = this;
      
      return this.post( {pid: pracoviste.id, controller: 'ws\\Ciselnik\\ZdrojController::getZdrojList' })
            .then(function(response : any){
                  var list : Zdroj[];
                  list = response;
                  for(var i=0; i < list.length; ++i){
                      
                    list[i] = t.cast<Zdroj>(list[i], Zdroj);                          
                  }
                  return list;   
        } );   
  }
  
  
  updateZdroj(zdroj: Zdroj){            
    return this.update<Response>(zdroj, 'ws\\Ciselnik\\ZdrojController::Add');
  }
  
  dropZdroj(zdroj: Zdroj){
    return this.drop<Response>(zdroj.id, 'ws\\Ciselnik\\ZdrojController::Drop');
  }

  linkZdrojPorucha(p: Zdroj, lst: Porucha[]) : Promise<Response> {
    var data = {id: p.id, list: lst, controller: 'ws\\Ciselnik\\PoruchaController::linkZdrojPorucha' };
    return this.post<Response>(data); 
  }

  getZdrojPoruchaTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\PoruchaController::getRelPoruchaTable');
  }



  /*** Jednotky v systemu */
  
  updateJednotka(jednotka: MernaJednotka){            
    return this.update<Response>(jednotka, 'ws\\Ciselnik\\JednotkaController::Add');
  }
  
  getJednotka(id:number){      
      return this.get<MernaJednotka>(id, 'ws\\Ciselnik\\JednotkaController::Get', MernaJednotka);
  }

  dropJednotka(jednotka: MernaJednotka){
    return this.drop<Response>(jednotka.id, 'ws\\Ciselnik\\JednotkaController::Drop');
  }
  
  getJednotkaTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\JednotkaController::getTable');                          
  }
  
  getJednotkaList(): Promise<any[]> {    
    var data = {controller: 'ws\\Ciselnik\\JednotkaController::GetJednotkyList' };    
      
    return this.post<any[]>(data);
  }
  
  updateVada(vada: Vada){            
    return this.update<Response>(vada, 'ws\\Ciselnik\\VadaController::Add');
  }
  
  getVada(id:number){      
      return this.get<Vada>(id, 'ws\\Ciselnik\\VadaController::Get', Vada);
  }

  dropVada(vada: Vada){
    return this.drop<Response>(vada.id, 'ws\\Ciselnik\\VadaController::Drop');
  }
  
  getVadaTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\VadaController::getTable');                          
  }
  
  getVadaList(): Promise<any[]> {    
    var data = {controller: 'ws\\Ciselnik\\VadaController::GetList' };          
    return this.post<any[]>(data);
  }
  
  getSklad(id:number){      
    return this.get<Sklad>(id, 'ws\\Ciselnik\\SkladController::getSklad', Sklad);
  }
  
  getSkladList(): Promise<Sklad[]> {    

      var t = this;
      
      return this.post({controller: 'ws\\Ciselnik\\SkladController::getSkladList' })
            .then(function(response : any){
              var list : Sklad[];
                      
              list = response;
              for(var i=0; i < list.length; ++i){                
                list[i] = t.cast<Sklad>(list[i], Sklad);                          
              }
              return list;   
        } );    
  }
  
  getSkladKarta(id:number){      
    return this.get<SkladKarta>(id, 'ws\\Ciselnik\\SkladController::getKarta', SkladKarta);
  }
  
  getSkladTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\SkladController::getTable');                          
  }
  
  getSkladKartaTable(query: TableQuery){
    return this.getTable(query, 'ws\\Ciselnik\\SkladController::getKartaTable');                          
  }
  
  dropSklad(sklad: Sklad){
    return this.drop<Response>(sklad.id, 'ws\\Ciselnik\\SkladController::Drop');
  }
  
  dropSkladKarta(karta: SkladKarta){
    return this.drop<Response>(karta.id, 'ws\\Ciselnik\\SkladController::DropKarta');
  }
  
  updateSklad(sklad: Sklad){            
    return this.update<Response>(sklad, 'ws\\Ciselnik\\SkladController::Add');
  }
  
  updateSkladKarta(karta: SkladKarta){            
    return this.update<Response>(karta, 'ws\\Ciselnik\\SkladController::AddKarta');
  }
  

  
  getKalendarTable(query: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\KalendarController::getTable');                          
  }

  getKalendar(id:number){     
      
      if(id < 0){
        return Promise.resolve(new Kalendar());
      }
      
      return this.get<Kalendar>(id, 'ws\\Ciselnik\\KalendarController::Get', Kalendar);
  }
  
  getKalendarList(){      
      
      var t = this;
      
      return this.post({controller: 'ws\\Ciselnik\\KalendarController::getKalendarList' })            
            .then(function(response : any){
                var list : Kalendar[];
                            
                list = response;
                for(var i=0; i < list.length; ++i){                
                  list[i] = t.cast<Kalendar>(list[i], Kalendar);                          
                }

                return list;   

              } );    
  }
  
  updateKalendar(kalendar: Kalendar){            
    return this.update<Response>(kalendar, 'ws\\Ciselnik\\KalendarController::Add');
  }
  
  dropKalendar(kalendar: Kalendar){
    return this.drop<Response>(kalendar.id, 'ws\\Ciselnik\\KalendarController::Drop');
  }
  
  getSmenaTable(id:number, query: TableQuery) : Promise<TableData> {    
    var data = {id: id, tabquery: query, controller: 'ws\\Ciselnik\\KalendarController::getSmenaTable' };        
    return this.post<TableData>(data);         
  }
    
  
  getSmena(id:number){      
      return this.get<KalendarSmena>(id, 'ws\\Ciselnik\\KalendarController::GetSmena', KalendarSmena);
  }
  
  updateSmena(smena: KalendarSmena){            
    return this.update<Response>(smena, 'ws\\Ciselnik\\KalendarController::AddSmena');
  }
  
  dropSmena(smena: KalendarSmena){
    return this.drop<Response>(smena.id, 'ws\\Ciselnik\\KalendarController::DropSmena');
  }

  //zdroj nebo pracoviste muze byt -1
  getKalendarSmeny(zdroj_id:number, pracoviste_id:number) : Promise<ItemList[]> {
    return this.post({ zdrojid: zdroj_id, pracovisteid: pracoviste_id, controller: 'ws\\Ciselnik\\KalendarController::GetSmenyCBO' });
  }

  
  getPracovistePlanovani(): Promise<Pracoviste[]> {      
      
      var t = this;
      
      return this.post({controller: 'ws\\Ciselnik\\PracovisteController::getPracovistePlanovani' })
            .then(function(response : any){
              var list : Pracoviste[];
              
              list = response;
              for(var i=0; i < list.length; ++i){                  
                list[i] = t.cast<Pracoviste>(list[i], Pracoviste);                          
              }

              return list;   
        } );   
  }
  
  unlinkPracovisteZdroj(zdrojid: number) : Promise<Response> {
      var data = { id: zdrojid, controller: 'ws\\Ciselnik\\PracovisteController::unlinkPracovisteZdroj' };    
        return this.post<Response>(data); 
  }
  
  linkPracovisteZdroj(prac: Pracoviste, zdroj: Zdroj[]) : Promise<Response> {
      var data = {id: prac.id, list: zdroj, controller: 'ws\\Ciselnik\\PracovisteController::linkPracovisteZdroj' };    
      return this.post<Response>(data); 
  }


  // poruchy stroju
  getPorucha(id:number){      
    return this.get<Porucha>(id, 'ws\\Ciselnik\\PoruchaController::Get', Porucha);
  }

  updatePorucha(rec: Porucha){            
    return this.update<Response>(rec, 'ws\\Ciselnik\\PoruchaController::Add');
  }

  dropPorucha(rec: Porucha){
    return this.drop<Response>(rec.id, 'ws\\Ciselnik\\PoruchaController::Drop');
  }

  getPoruchaTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\PoruchaController::getTable');
  }


  unlinkPoruchaZdroj(linkid: number) : Promise<Response> {
    var data = { id: linkid, controller: 'ws\\Ciselnik\\PoruchaController::unlinkPoruchaZdroj' };
      return this.post<Response>(data); 
  }

  linkPoruchaZdroj(p: Porucha, zdroj: Zdroj[]) : Promise<Response> {
      var data = {id: p.id, list: zdroj, controller: 'ws\\Ciselnik\\PoruchaController::linkPoruchaZdroj' };
      return this.post<Response>(data); 
  }

  getPoruchaZdrojTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Ciselnik\\PoruchaController::getRelZdrojTable');
  }


}

