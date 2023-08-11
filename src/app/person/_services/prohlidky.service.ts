import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, Response, Table, TableData, TableQuery } from '../../core/module';
import { PersPracCinnost, PersSkupina, PersRizikovost, PersZdravProhlidka} from '../_obj/prohlidky';

@Injectable()
export class ProhlidkyService extends BaseService {


      constructor(protected http:HttpClient) {
        super(http);
      }
      
      getPracCinnostTable(query: TableQuery) {    

        return this.getTable(query, 'ws\\Person\\ProhlidkyController::getPracCinnostTable');                          
      }

      getPracCinnostList(platne?:boolean) : Promise<PersPracCinnost[]>  {

        var t = this;
        var p = platne != null && platne;

        return this.post({platne: p,  controller: 'ws\\Person\\ProhlidkyController::getPracCinnostList' })
              .then(function(resp : any){

             var list : PersPracCinnost[];
             list = resp;
             for(var i=0; i < list.length; ++i){                
                 list[i] = t.cast<PersPracCinnost>(list[i], PersPracCinnost);
             }

             return list;   
          } );  
      }
      
      getPracCinnost(id:number){     
          
          if(id < 0){
            return Promise.resolve(new PersPracCinnost());
          }
          
          return this.get<PersPracCinnost>(id, 'ws\\Person\\ProhlidkyController::getPracCinnost', PersPracCinnost);
      }
      
      updatePracCinnost(odv: PersPracCinnost){            
        return this.update<Response>(odv, 'ws\\Person\\ProhlidkyController::updatePracCinnost');
      }
    

      dropPracCinnost(odv: PersPracCinnost){
        return this.drop<Response>(odv.id, 'ws\\Person\\ProhlidkyController::dropPracCinnost');
      }
      
      /*** skupina */

      getPersSkupinaList() : Promise<PersSkupina[]>  {

        var t = this;

        return this.post({ controller: 'ws\\Person\\ProhlidkyController::getPersSkupinaList' })
              .then(function(resp : any){

             var list : PersSkupina[];
             list = resp;
             for(var i=0; i < list.length; ++i){                
                 list[i] = t.cast<PersSkupina>(list[i], PersSkupina);                          
             }

             return list;   
          } );  
      }

      getPersSkupinaTable(query: TableQuery) {    

        return this.getTable(query, 'ws\\Person\\ProhlidkyController::getPersSkupinaTable');                          
      }
      
      getPersSkupina(id:number){     
          
          if(id < 0){
            return Promise.resolve(new PersSkupina());
          }
          
          return this.get<PersSkupina>(id, 'ws\\Person\\ProhlidkyController::getPersSkupina', PersSkupina);
      }
      
      updatePersSkupina(odv: PersSkupina){            
        return this.update<Response>(odv, 'ws\\Person\\ProhlidkyController::updatePersSkupina');
      }
    

      dropPersSkupina(odv: PersSkupina){
        return this.drop<Response>(odv.id, 'ws\\Person\\ProhlidkyController::dropPersSkupina');
      }


      /***** Zdravotni prohlidky */
      
      getPersProhlidkaTable(query: TableQuery) {    

        return this.getTable(query, 'ws\\Person\\ProhlidkyController::getProhlidkaTable');                          
      }
      
      getPersProhlidka(id:number){     
      
          if(id < 0){
            return Promise.resolve(new PersZdravProhlidka());
          }
          
          return this.get<PersZdravProhlidka>(id, 'ws\\Person\\ProhlidkyController::getProhlidka', PersZdravProhlidka);
      }
      
      updatePersProhlidka(odv: PersZdravProhlidka){            
        return this.update<Response>(odv, 'ws\\Person\\ProhlidkyController::updateProhlidka');
      }


      fillProhlidkaRizikyOsoby(odv: PersZdravProhlidka){            
        return this.update<PersZdravProhlidka>(odv, 'ws\\Person\\ProhlidkyController::fillProhlidkaRizikyOsoby');
      }
    

      dropPersProhlidka(odv: PersZdravProhlidka){
        return this.drop<Response>(odv.id, 'ws\\Person\\ProhlidkyController::dropProhlidka');
      }

      genNasledneProhlidkyTable(query: TableQuery){
        return this.getTable(query, 'ws\\Person\\ProhlidkyController::generujNasledneProhlidky');
      }

      genVytvorProhlidky(rows: any[]){
        return this.update<Response>(rows, 'ws\\Person\\ProhlidkyController::genVytvorProhlidky');
      }


    /*** rizikovost */

    getPersRizikovostTable(query: TableQuery) {    

      return this.getTable(query, 'ws\\Person\\ProhlidkyController::getPersRizikovostTable');                          
    }

    //ziskej lhutu dalsi prohlidky, jsou to roky 
    getProhlidkaLhuta(osobaid:number) : Promise<Response> {

      return this.post( { osobaid: osobaid, controller: 'ws\\Person\\ProhlidkyController::getProhlidkaLhuta' });
    }

    
    getPersRizikovost(id:number){     
        
        if(id < 0){
          return Promise.resolve(new PersRizikovost());
        }
         
        return this.get<PersRizikovost>(id, 'ws\\Person\\ProhlidkyController::getPersRizikovost', PersRizikovost);
    }
    
    updatePersRizikovost(odv: PersRizikovost){            
      return this.update<Response>(odv, 'ws\\Person\\ProhlidkyController::updatePersRizikovost');
    }
   
  
    dropPersRizikovost(odv: PersRizikovost){
      return this.drop<Response>(odv.id, 'ws\\Person\\ProhlidkyController::dropPersRizikovost');
    }

}

