import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';

import { ZapisPoruchyList } from './zapis-poruchy.list';
import { ZapisPoruchyDetail } from './zapis-poruchy.detail';
import { ZapisPoruchyForm } from './zapis-poruchy.frm';
import { UdrzbaService } from './_services/udrzba.service';


export  *  from './_obj/udrzba';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MwCoreModule, RouterModule, 
  ],
  declarations: [
    ZapisPoruchyList, ZapisPoruchyDetail, ZapisPoruchyForm
  ],
  providers: [
    UdrzbaService
  ],

})

export class UdrzbaModule {}