import { HttpClient } from '@angular/common/http';
import {Injectable, EventEmitter} from '@angular/core';
import { TableQuery,TableData } from '../module';
import {SecurityUser, SecurityUserParams} from "../_obj/user";
import { Response, ReportPrint} from "../_obj/common";
import { catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';

 
declare var AppUrlWS : string;
var _userChanged: EventEmitter<any> = new EventEmitter<any>();
var _errorEvent: EventEmitter<any> = new EventEmitter<any>();
var _user: Promise<SecurityUser| false> | SecurityUser | false = false;
 
@Injectable()
export class BaseService {

    protected http: HttpClient;
    
    constructor( http: HttpClient) { 
        this.http = http;
    }

    public getUrlWS():string {
        return AppUrlWS;
    }

    public get onError(): EventEmitter<any> {
        return _errorEvent;
    }


    public get userChanged(): EventEmitter<any> {
        return _userChanged;
    }

    public get user(): SecurityUser | false {
        if (_user instanceof SecurityUser)
            return _user;
        return false;
    }


    public localUserDropSetting(param:string){

        if(this.user)
            this.user.dropSetting(param);

    }

    public localUserUpdateSetting(st: SecurityUserParams){
        if(this.user)
            this.user.updateSetting(st);
    }


    public updateUserParam(uparam: SecurityUserParams) : Promise<Response>  {          
        return this.update<Response>(uparam, 'ws\\Security\\UserController::updateUserParam'); 
    }

    public removeUserParam(param: string) : Promise<Response>  {          
        return this.post( { kod: param, controller: 'ws\\Security\\UserController::dropUserParam' }); 
    }



    public printReport(id:any[], report_id: number){


        var sid = "";

        for(var i=0; i < id.length; ++i){
            sid += "id[]="+id[i]+"&";
        }

        window.open(AppUrlWS + "?report_id="+ report_id+"&controller=" + encodeURI('ws\\Pomocne\\PrintReportController::pdf')+"&"+sid);    
    }


    public getPrintReports(recurl: string) : Promise<ReportPrint[]> {      
        var data = { recurl: recurl,  controller: 'ws\\Pomocne\\PrintReportController::getList' };    
        var t = this;

        return this.post(data)
              .then(function(response : any){
                    var list : ReportPrint[];
                    list = response;
                    for(var i=0; i < list.length; ++i){                
                        list[i] = t.cast<ReportPrint>(list[i], ReportPrint);                          
                    }
             return list;   
          } );  
    }


    public getMenu() : Promise<any> {
        
        if(!this.isLoggedIn()){
            return Promise.resolve({});
        }

        return this.post<any>({ controller: 'ws\\Security\\UserController::getAuthUserMenu' });   
   
    }


    public reloadAuthentication() : Promise<SecurityUser> {

        var oldUserValue : Promise<SecurityUser|false> | SecurityUser | false = _user;

        return _user = this.post({
            controller: 'ws\\Security\\UserController::reloadAuthentication'
        }).then(ret => {
            ret = this.cast<SecurityUser>(ret, SecurityUser);
            _user = ret;
            
            _userChanged.emit(ret);
            return ret;
        }).catch(ret =>
        {  _user = oldUserValue;
            throw ret;
        });

    } 


    public isAllowed(group: string, role: string, subrole?: string){


        if(!this.isLoggedIn() || !this.user){
            return false;
        }

        if(this.user && this.user.isAdmin()){
            return true;
        }

        return this.user.isAllowed(group, role, subrole);
    }

    isAdmin() {

        if(this.user && this.user.isAdmin()){
            return true;
        }

        return false;
    }
    

    logout():Promise<SecurityUser|boolean> {

        var oldUserValue:Promise<SecurityUser|false> | SecurityUser | false = _user;


        return _user = this.post({controller: 'ws\\Security\\UserController::logout'})
            .then(ret => {

                try{
            
                    if (!ret) {
                        _user = false;
                        _userChanged.emit(false);
                        return false;
                    }

                }catch(ex){
                    ret = null;
                }

                
                return oldUserValue;
            });
    }

    login(username, password): Promise<SecurityUser> {

        return _user = this.post({
            controller: 'ws\\Security\\UserController::login',
            username,
            password
        }).then(ret => {
            ret = this.cast<SecurityUser>(ret, SecurityUser);
            _user = ret;
            _userChanged.emit(ret);
            return ret;
        });
    }
   

    checkCredentials() {
        return;
    }


    isLoggedIn(): Promise<SecurityUser|false> | SecurityUser {
    
        if (_user === false)
        {
            return _user =  this.post({controller: 'ws\\Security\\UserController::isLoggedIn'})
            .then(ret => {
               
                
                if (!ret)
                {
                    _user =false;
                    _userChanged.emit(_user);
                }
                else
                {
                    _user =this.cast<SecurityUser>(ret, SecurityUser);
                    _userChanged.emit(_user);

                }
                return _user;
            });
        }
        else if (_user instanceof Promise)
        {
            return _user;
        }
        return _user;

    }


  
    cast<T>(obj:any, cl:any): T {
       obj.__proto__ = cl.prototype;
       return obj;
    }
 
    
    castJson<T>(jsonlist:any, cl:any) : T[] {
        
        var r : T[] = [];
        var a : any[] = jsonlist.json();
        
        for(let i=0; i < a.length; ++i){        
            r.push(this.cast<T>(a[i], cl));
        }
        
        return r;
    } 
    
    static createInstance<T>(type:{new():T;}):T{
        return new type();
    }
    
    protected getTable(query: TableQuery, controller: string) : Promise<TableData> {
    
        return this.post<TableData>({ tabquery: query, controller: controller });
    }


    async post<T>(data?: any) : Promise<any> {
               
        return await firstValueFrom(this.http.post(AppUrlWS, data).pipe(
            catchError(this.handleError)
        ));
    }



    get<T>(id:number, controller: string, typ: any) : Promise<T> {
        
        if (id == null || id < 1){                  
            return Promise.resolve(BaseService.createInstance(typ));
        }

        return this.post<T>({ id: id, controller: controller});        
    }

    update<T>(rec: any, controller: string) : Promise<T> {
        return this.post( { rec: rec, controller: controller });        
    }


    drop<T>(id: number, controller: string) : Promise<T> {        
        return this.post( { id: id, controller: controller });        
    }
    

    protected handleError(ma: any) {    
        
        var msg = ma.error.error || ma.message || ma;
        console.log("CHYBA:")
        console.log("---- ZACATEK---");
        console.log(ma);
        console.log("Zprava: " + msg);
        console.log("---- KONEC ---");

        _errorEvent.emit(msg);

        return throwError(() => new Error(msg));
    }
    
}
