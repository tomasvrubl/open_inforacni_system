import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, Response, TableQuery, TableData } from '../../core/module';
import { Plan, PlanPolozka } from '../_obj/plan';
import { Zdroj } from '../../ciselnik/module';


@Injectable()
export class PlanService extends BaseService {


    constructor(protected http:HttpClient) {
        super(http);
    }
  
    getVyrobniPrikazy(zdroj: Zdroj, query: TableQuery) : Promise<TableData> {                
        return this.post<TableData>({ zdrojid: zdroj.id, query: query, controller: 'ws\\Vyroba\\PlanController::findVZ' });            
    }
    
    
    updatePlan(plan: Plan): Promise<Response> {      
        return this.update<Response>(plan, 'ws\\Vyroba\\PlanController::updatePlan');      
    }
    
    
    dropPlan(plan: Plan): Promise<Response> {            
        return this.drop<Response>(plan.id, 'ws\\Vyroba\\PlanController::dropPlan');       
    }
    
    
    getPlan(zdroj: Zdroj, datum: string, kalendar_id: number): Promise<Plan> {      
        
        if(zdroj == null || zdroj.id < 0){
            return Promise.resolve(new Plan());
        }
        
        var t = this;
        
        return this.post({datum: datum, zid: zdroj.id, kid: kalendar_id, controller: 'ws\\Vyroba\\PlanController::getPlan' })
                .then(function(response : any){

            var resp =  response.json();
                for(var i=0; i < resp.polozky.length; ++i){                
                resp.polozky[i] = t.cast<PlanPolozka>(resp.polozky[i], PlanPolozka);                          
                }

                return resp;   
            } );   
    }
    
    
    getZaplanovaneDny(zdroj:Zdroj, mesic: number, rok:number): Promise<Response> {
        
        return this.post<Response>({zid: zdroj.id, mesic: mesic, rok: rok, controller: 'ws\\Vyroba\\PlanController::getZaplanovaneDny' });
    }
  
  
}

