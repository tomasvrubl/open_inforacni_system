import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { PersonModule } from '../person/module';
import { UserDetailComponent } from './user.detail';
import { UserListComponent } from './user.list';
import { UserForm } from './user.frm';
import { AuthGuard } from './auth.guard';
import { SettingDetailComponent } from './setting.detail';
import { SettingListComponent } from './setting.list';
import { SettingForm } from './setting.frm';
import { SecurityRoleGroupComponent } from './role.group.detail';
import { SecurityRoleGroupList } from './role.group.list';
import { SecurityRoleGroupForm } from './role.group.frm';
import { SecurityRoleForm } from './role.frm';
import { SecurityRoleList } from './role.list';
import { SecurityRoleComponent } from './role.detail';
import { MenuDefDetailComponent } from './menu.detail';
import { MenuDefListComponent } from './menu.list';
import { MenuDefForm } from './menu.frm';
import { UserRoleListComponent} from './user.role.list';
import { UserRoleDetailComponent } from './user.role.detail';
import { UserRoleForm } from './user.role.frm';

export { SettingForm } from './setting.frm';
export { SecurityRoleGroupForm } from './role.group.frm';
export { SecurityRoleForm } from './role.frm';
export { MenuDefForm } from './menu.frm';
export { UserForm } from './user.frm';
export { UserRoleForm } from './user.role.frm';

@NgModule({    
    imports: [
        BrowserModule, FormsModule,
        MwCoreModule, RouterModule, PersonModule
    ],
    declarations: [
        UserListComponent, UserDetailComponent, SettingDetailComponent, SettingListComponent, SettingForm, UserRoleForm,
        SecurityRoleGroupComponent, SecurityRoleGroupList,  SecurityRoleGroupForm, UserRoleListComponent, UserRoleDetailComponent,
        SecurityRoleComponent, SecurityRoleList, SecurityRoleForm, MenuDefDetailComponent, MenuDefListComponent, MenuDefForm, UserForm,          
    ],
    providers: [
        AuthGuard
    ]
})

export class AdminModule { }