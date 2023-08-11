import {Component, OnInit, Injectable} from '@angular/core';
import {AuthenticationService, SecurityUser, UserService, Response} from "./core/module";
import { Pracoviste } from "./ciselnik/module";

declare var jQuery : any;

@Component({
    selector: 'app-content-comp',
    templateUrl: './_view/content.html',
    providers: []
})




@Injectable()
export class ContentComponent implements OnInit
{
    userResponse : Response;
    user: SecurityUser | false ;
    path: any[];
    menu: any;
    planovani: Pracoviste[] = [];

    opened: boolean;

    public constructor(private authService: AuthenticationService, private userService: UserService)
    {
        authService.onError.subscribe(msg => {
            alert(msg);
        })
    }
    
    ngOnInit(): void {                
        
        this.user = this.authService.user;             
        this.path = [];


        this.authService.getMenu().then((lst) => {
            this.menu = lst;             
            this.opened = true;
       });
        

        
        jQuery(function(){
            jQuery('body').removeClass('login');
        });

    
    }


    reloadGrantMenu(){

        this.authService.reloadAuthentication().then(val =>{
            this.user = val;  

            this.authService.getMenu().then((lst) => {
                this.menu = lst;  
                this.opened = true;
           });
        })


    }




    getUserDisplayname(){
   
        return this.user ? this.user.prijmeni + ' ' + this.user.jmeno: "";
    }


    getUsername(){
        return this.user ? this.user.username : "";
    }
  
    
    isAdmin(){
        return this.user && this.user.isAdmin();
    }
    
    addBreadcrumb(val: string){
        
        this.path = [{label: val}];
    }

    updateProfile(){
        this.userResponse = null;
        this.userService.updateUserProfile(<SecurityUser> this.user).then(response => this.asyncUserProfile(response))
    }

    sendSchvalit(){
        
    }
    
    asyncUserProfile(response: Response){
        
        this.user =  response.data;
        this.userResponse = response;        
    }

}