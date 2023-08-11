import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';

import { PlanDetailForm } from './plan.detail';
import { PlanLinkaForm } from './linka.detail';
import { PlanService } from './_services/plan.service';

export { PlanDetailForm } from './plan.detail';
export { PlanLinkaForm } from './linka.detail';
export  *  from './_obj/plan';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MwCoreModule, RouterModule
  ],
  declarations: [
    PlanDetailForm, PlanLinkaForm
  ],
  providers: [
    PlanService
  ],

})

export class PlanModule {}