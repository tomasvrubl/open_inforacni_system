import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';
import { PostaService } from './_services/posta.service';
import { PostaAliasDetail } from './alias.detail';
import { PostaAliasList } from './alias.list';
import { PostaAliasForm } from './alias.frm';
import { PostaDomainDetail } from './domain.detail';
import { PostaDomainList } from './domain.list';
import { PostaDomainForm } from './domain.frm';
import { PostaEmailDetail } from './email.detail';
import { PostaEmailList } from './email.list';
import { PostaEmailForm } from './email.frm';


export { PostaEmailForm } from './email.frm';
export { PostaAliasForm } from './alias.frm';
export { PostaDomainForm } from './domain.frm';
export  *  from './_obj/posta';


@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MwCoreModule, RouterModule
  ],
  declarations: [
    PostaAliasDetail,
    PostaAliasList,
    PostaAliasForm,
    PostaDomainDetail,
    PostaDomainList,
    PostaDomainForm,
    PostaEmailDetail,
    PostaEmailList,
    PostaEmailForm

  ],
  providers: [
    PostaService,
  ],

  exports: [
    
  ]

})

export class PostaModule {}
