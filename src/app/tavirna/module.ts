import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';

import { JakostList } from './jakost.list';
import { JakostDetail } from './jakost.detail';
import { JakostForm } from './jakost.frm';

import { PecList } from './pec.list';
import { PecDetail } from './pec.detail';
import { PecForm } from './pec.frm';


import { LabVzorekList } from './vzorek.list';
import { LabVzorekDetail } from './vzorek.detail';
import { LabVzorekForm } from './vzorek.frm';


import { TavirnaService } from './_services/tavirna.service';
import { CiselnikModule } from '../ciselnik/module';

export { JakostForm } from './jakost.frm';
export { PecForm } from './pec.frm';
export { LabVzorekForm } from './vzorek.frm';

export  *  from './_obj/tavirna';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MwCoreModule, RouterModule, CiselnikModule
  ],
  declarations: [
    JakostList, JakostDetail, JakostForm, PecList, PecDetail, PecForm, LabVzorekDetail, LabVzorekList, LabVzorekForm
  ],
  providers: [
    TavirnaService
  ],

})

export class TavirnaModule {}