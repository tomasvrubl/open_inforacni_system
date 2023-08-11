import { Component,  Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityUser, UserService, Response, iDetail,TableQuery, TabFilter } from '../core/module';
import { OsobaListComponent } from '../person/module';



@Component({
  selector: 'user-detail',
  templateUrl : './_view/user.detail.html',
  viewProviders: [],
})

export class UserDetailComponent implements iDetail  { 

    response : Response;  
    selectMenuList: boolean;
    
    _user : SecurityUser;
    _osobaList : any = OsobaListComponent;
    @Output() userChanged = new EventEmitter();
    
    constructor( private userService: UserService, private route: ActivatedRoute, private router: Router) {    
        this.selectMenuList = false;
        this._user = new SecurityUser();            
        this.response = new Response();        
    }


    @Input() 
    set detail(val : SecurityUser){
        
        if(val == null){
            this._user = new SecurityUser();
        }
        else{
            this.userService.getUser(val.id).then((j: SecurityUser) => this._user = j);   
        }            
        
    } 
        
    
    get detail(): SecurityUser{
        return this._user;
    }


        
    edit(id:number){
        this.userService.getUser(id).then((j: SecurityUser) => this._user = j);   
    }
   
    
    
    saveme() {
        this.userService.updateUser(this._user).then(response => this.asyncSaveResponse(response));  
    }
    
    newone(){
        this._user = new SecurityUser();
    }
    
    dropme(){        
        this.userService.dropUser(this._user).then(response => this.asyncDropResponse(response));      
    }
    
    
    asyncDropResponse(resp: Response){
        
        this.response = resp;
        
        if (resp.kod == 0){
            this._user = new SecurityUser();    
            this.userChanged.emit(this); 
        }
        
    }
    
    asyncSaveResponse(resp: Response){
    
        this.response = resp;
        this._user = resp.data;
        this.userChanged.emit(this);
    }
    
    onSelectedRoleMulti(arr){
        
        let ids = [];
        
        
        for(var i=0; i < arr.length; ++i){
            ids.push(arr[i].id);
        }
        
        this.userService.addUserRole(+this._user.id, ids).then((response: Response) => {
            this.response = response; 
        });
        
        this.selectMenuList=false;
    }
    

    onOsobaChanged(ev: any){      
        if(ev == null){
            this._user.osoba_id = -1;
            this._user.osoba_oscislo = '';
            this._user.osoba = '';
        }
        else{
            this._user.osoba_id = ev.id;
            this._user.osoba_oscislo = ev.oscislo;
            this._user.osoba = ev.prijmeni + ' ' + ev.jmeno;
        }
        
    }

    
    resetPassword(){
        this.userService.resetPassword(this._user.id).then((response: Response) => {
            this.response = response; 
        });
    }
}