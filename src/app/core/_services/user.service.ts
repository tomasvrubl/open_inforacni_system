import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response, TableQuery, TableData, ItemList } from '../module';
import { AuthenticationService } from './auth.service';
import { SecurityUser, SecurityUserRole, SecurityRoleGroup, SecurityRole } from '../_obj/user';


 
@Injectable()
export class UserService extends AuthenticationService   {

    constructor(http: HttpClient) { 
        super(http);
    }

    getCurrentUser() : SecurityUser {

      if (this.user instanceof SecurityUser){
          return this.user;
      }

      return new SecurityUser();
    }

    updateUser(user: SecurityUser){
      return this.post<Response>({ rec: user, controller: 'ws\\Security\\UserController::updateUser' });  
    }
    
    getUser(id:number){      
        return this.get<SecurityUser>(id, 'ws\\Security\\UserController::getUser', SecurityUser);
    }

    updateUserProfile(user:SecurityUser){      
      return this.post<Response>({ rec: user, controller: 'ws\\Security\\UserController::updateUserProfile' }).then(resp =>{
        resp.data = this.cast<SecurityUser>(resp.data, SecurityUser)
        return resp;
      });    
    }

    resetPassword(id:number){        
      return this.update<Response>(id, 'ws\\Security\\UserController::resetPassword');
    } 


    dropUser(user: SecurityUser){
      return this.post<Response>({ userid: user.id, controller: 'ws\\Security\\UserController::dropUser' });  
    }


    getUserTable(query: TableQuery) : Promise<TableData> {
      return this.post<TableData>({ tabquery: query, controller: 'ws\\Security\\UserController::userTable' });
    }
    
    getSecurityRoleGroup(id:number){      
        return this.get<SecurityRoleGroup>(id, 'ws\\Security\\UserRoleController::getRoleGroup', SecurityRoleGroup);
    }
    
    dropSecurityRoleGroup(param: SecurityRoleGroup){        
        return this.drop<Response>(param.id, 'ws\\Security\\UserRoleController::dropRoleGroup');
    } 
    
    updateSecurityRoleGroup(param: SecurityRoleGroup){        
        return this.update<Response>(param, 'ws\\Security\\UserRoleController::addRoleGroup');
    } 
    
    getSecurityRoleGroupTable(query: TableQuery) : Promise<TableData> {

        return this.post<TableData>({ tabquery: query, controller: 'ws\\Security\\UserRoleController::getRoleGroupTable' });
    }

    getSecurityRoleGroupList() : Promise<ItemList[]> {
      return this.post({ controller: 'ws\\Security\\UserRoleController::getSecurityRoleGroupList' });      
    }
  
    
    getSecurityRole(id:number){      
        return this.get<SecurityRole>(id, 'ws\\Security\\UserRoleController::getRole', SecurityRole);
    }

    getSecurityRoleList(groupid:number) : Promise<ItemList[]> {
      return this.post({  groupid: groupid,  controller: 'ws\\Security\\UserRoleController::getSecurityRoleList' });      
    }
    
    
    dropSecurityRole(param: SecurityRole){        
      return this.drop<Response>(param.id, 'ws\\Security\\UserRoleController::dropRole');
    } 
    
    updateSecurityRole(param: SecurityRole){        
      return this.update<Response>(param, 'ws\\Security\\UserRoleController::addRole');
    } 
    
    getSecurityRoleTable(query: TableQuery) : Promise<TableData> {      
      return this.post<TableData>({ tabquery: query, controller: 'ws\\Security\\UserRoleController::getRoleTable' });
    }

    getUserRoleTable(query: TableQuery) : Promise<TableData> {      
      return this.post<TableData>({ tabquery: query, controller: 'ws\\Security\\UserController::getUserRoleTable' });
    }
    
    updateUserRole(role: SecurityUserRole){        
      return this.update<Response>(role, 'ws\\Security\\UserController::updateUserRole');
    } 

    dropUserRole(role: SecurityUserRole){        
      return this.drop<Response>(role.id, 'ws\\Security\\UserController::dropUserRole');
    } 
    
    getUserRole(id:number){      
        return this.get<SecurityUserRole>(id, 'ws\\Security\\UserController::getUserRole', SecurityUserRole);
    }
    
    addUserRole(userid:number, roleid:number[])  : Promise<Response>{                      
        return this.post({ userid: userid, roleid: roleid,  controller: 'ws\\Security\\UserController::addUserRole' });  
    }    


}

