import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TerminalService } from '../../_services/terminal.service';
import { TerminalLinkaPlan, TerminalSmena } from '../_obj/terminal';
import { Response } from '../../module';
import { ItemList, TableQuery } from 'src/app/core/module';
import { VyrZapisSmeny } from 'src/app/vyroba/module';



 
@Injectable()
export class TerminalLinkaService extends TerminalService {


  constructor(protected http:  HttpClient) {
    super(http);
  }
  
  getLinkaPlan(zdroj_kod: string, datum: Date) : Promise<TerminalLinkaPlan>  {            

    
    this.setResponse(0, 'Načítám data');

    return this.post( { kod: zdroj_kod, datum: datum, controller: 'ws\\Terminal\\LinkaController::getPlan' }).then((res:TerminalLinkaPlan)  => {
      this.setResponse(0, 'Data načtena');
      return res;
    });   
  }


  //zdroj nebo pracoviste muze byt -1
  getKalendarSmeny(zdrojkod:string) : Promise<ItemList[]> {
    
    return this.post({ zdrojkod: zdrojkod, controller: 'ws\\Ciselnik\\KalendarController::GetSmenyTerminalCBO' });
  }


  updateLinkaPlan(rec : TerminalLinkaPlan) : Promise<TerminalLinkaPlan> {
    
    this.setResponse(0, "Odesílám data...");

    var oscislo = this.userTerminal ? this.userTerminal.oscislo : '';

    return  this.post( {oscislo: oscislo, rec: rec, controller: 'ws\\Terminal\\LinkaController::odvadeniPlan' }).then((r : Response) => {      
      this.setResponse(r.kod, r.nazev);
      return r.data;
    });
  }

  

  updateZapisSmeny(odv : VyrZapisSmeny) : Promise<VyrZapisSmeny> {
    
    this.setResponse(0, "Odesílám data...");

    return this.update<Response>(odv, 'ws\\Vyroba\\ZapisSmenyController::Add').then((r : Response) => {      
      this.setResponse(r.kod, r.nazev);
      return r.data;
    });

  }


  getZapisSmeny(zdroj_kod: string, datum: Date, smena: number) : Promise<TerminalSmena>  {            
    return this.post({kod: zdroj_kod, smena: smena, datum: datum, controller: 'ws\\Terminal\\LinkaController::getZapisSmeny' });   
  }


  getZdroj(zdroj_kod: string){      
    return this.post({kod: zdroj_kod, controller: 'ws\\Ciselnik\\ZdrojController::getZdrojByKod' });   
  }


  getZapisSmenyTable(query?: TableQuery) {    
    return this.getTable(query, 'ws\\Terminal\\LinkaController::getZapisSmenyTable');                          
  }


}

