import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { TerminalService } from './_services/terminal.service';
import { TerminalLinkaForm } from './terminal.linka';
import { TerminalAuthForm } from './autentizace';
import { TerminalLinkaPlanForm } from './linka/plan';
import { TerminalLinkaSmenaForm } from './linka/smena';
import { TerminalLinkaService } from './linka/_services/terminal.service';
import { SmenaList } from './linka/smena.list';

export { SmenaList}

export { TerminalLinkaForm  } from './terminal.linka';
export { TerminalLinkaPlanForm } from './linka/plan'
export { TerminalLinkaSmenaForm } from './linka/smena';
export { TerminalAuthForm } from './autentizace'; 

export  {Response } from '../core/module';
export  * from './_obj/terminal';


@NgModule({    
    imports: [   BrowserModule, FormsModule,
        MwCoreModule, RouterModule
    ],
    declarations: [ TerminalAuthForm, TerminalLinkaForm, TerminalLinkaPlanForm, TerminalLinkaSmenaForm, SmenaList ],
    providers: [ TerminalService, TerminalLinkaService ]
})


export class PublicModule { }