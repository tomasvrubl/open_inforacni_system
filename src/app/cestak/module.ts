import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';
import { PersonModule } from '../person/module';
import { AutoList } from './auto.list';
import { AutoDetail } from './auto.detail';
import { CestakService} from './_services/cestak.service';
import { AutoForm } from './auto.frm';
import { AutoReportDetail } from './report.detail';
import { AutoReportList } from './report.list';
import { AutoReportForm } from './report.frm';
import { AutoVykazUserTemplComponent } from './auto.vykaz.user.tmpl';


export { AutoForm } from './auto.frm';
export { AutoReportList } from './report.list';
export { CestakService} from './_services/cestak.service';
export { AutoReportForm } from './report.frm';
export { AutoVykazUserTemplComponent } from './auto.vykaz.user.tmpl';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,MatFormFieldModule,
    MwCoreModule, RouterModule, PersonModule
  ],
  declarations: [
    AutoDetail,
    AutoList,
    AutoReportDetail,
    AutoReportList,
    AutoForm,
    AutoReportForm,
    AutoVykazUserTemplComponent
  ],
  providers: [
    CestakService,
    {provide: MAT_DATE_LOCALE, useValue: 'cs-CZ'},
  ],

})

export class CestakModule {}