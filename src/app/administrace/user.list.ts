import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, BaseListComponent, TableQuery, Table, TabFilter } from '../core/module';
import { UserDetailComponent } from './user.detail';

@Component({
  selector: 'user-list',
  templateUrl : '../core/_gui/baselist/view.html',
  viewProviders: [UserDetailComponent],
  providers: [ UserService ]
})

export class UserListComponent extends BaseListComponent  { 

    
    constructor(private userService: UserService,  protected router: Router) {
    
    
        super(router, UserDetailComponent, userService);

        this.tab.header = [
            { label: 'id', clmn: 'id' },
            { label: 'Uživ. jméno', clmn: 'username', fulltext: true },
            { label: 'Příjmení', clmn: 'prijmeni', fulltext: true },
            { label: 'Jméno', clmn: 'jmeno', fulltext: true },
            { label: 'E-mail', clmn: 'email', fulltext: true },
            { label: 'Administrátor', clmn: '_isadmin' },
            { label: 'Platnost', clmn: '_platnost' },
            { label: 'Osoba ID', clmn: 'osoba_id'},
            { label: 'Změněno', clmn: 'zmeneno' },
            { label: 'Změnil', clmn: 'zmenil' }
        ];    

    }

    getComponentName(): string {
        return "UserListComponent";
    } 

    onEdit(el:any, iswnd:boolean) {          
        super.editRecord(el.id, iswnd, '/admin/user/'+ el.id);
    } 
   
    onDrop(el:any){
        
        this.userService.dropUser(el).then(response => {
            this.response = response;
            this.reloadData(this.tab);  
        });
    }
    
    reloadData(table: Table){       
        this.userService.getUserTable(table.getQuery()).then(response => this.asyncSetTab(response)); 
    }
      


   
}