import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BaseService } from '../../core/module';
import { TerminalUser } from '../_obj/terminal';
import { Response } from '../module';

var _termUserChanged: EventEmitter<any> = new EventEmitter<any>();
var _responseChanged: EventEmitter<any> = new EventEmitter<any>();

@Injectable()
export class TerminalService extends BaseService {



  constructor(protected http:  HttpClient) {
    super(http);    
    
  }

  protected setResponse(kod: number, text: string){

    var r  = new Response();
    r.kod = kod;
    r.nazev = text;

    this.responseChanged.emit(r);
  }

  public get userTerminal(): TerminalUser | false {

      var e:any = localStorage.getItem('terminalUser')

      if(e){
          e = JSON.parse(e);        
          return this.cast<TerminalUser>(e, TerminalUser);
      }
      
      return false;
  }

  public get userTerminalChanged(): EventEmitter<any> {
     return _termUserChanged;
  }


  public get responseChanged(): EventEmitter<any> {
    return _responseChanged;
  }


 


  logoutTerminal(){
    _termUserChanged.emit(false);
    localStorage.removeItem('terminalUser');

  }
  
  
  loginTerminal(oscislo:string): Promise<TerminalUser | false> {   
    var t = this;
    return this.post({ oscislo: oscislo, controller: 'ws\\Terminal\\TerminalController::getTerminalUser'}).then(r => {

      _termUserChanged.emit(r);
      localStorage.setItem('terminalUser', JSON.stringify(r));
      
      return r;
    });
  }


}

