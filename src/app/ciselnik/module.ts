import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';
import { CiselnikService } from './_services/ciselnik.service';
import { PracovisteListComponent } from './pracoviste.list';
import { PracovisteDetailComponent } from './pracoviste.detail';
import { PracovisteForm } from './pracoviste.frm';
import { PracovistePicker } from './_picker/pracoviste/pracoviste.picker';

import { ZdrojListComponent } from './zdroj.list';
import { ZdrojDetailComponent } from './zdroj.detail';
import { ZdrojForm } from './zdroj.frm';
import { KalendarSmenaDetail } from './kalendar-smena.detail';
import { KalendarSmenaList } from './kalendar-smena.list';
import { KalendarList } from './kalendar.list';
import { KalendarDetail } from './kalendar.detail';
import { KalendarForm } from './kalendar.frm';
import { SkladForm } from './sklad.frm';
import { SkladDetail } from './sklad.detail';
import { SkladList } from './sklad.list';
import { JednotkyForm } from './jednotky.frm';
import { JednotkyList } from './jednotky.list';
import { JednotkyDetail } from './jednotky.detail';
import { PoruchyForm } from './poruchy.frm';
import { PoruchyList } from './poruchy.list';
import { PoruchyDetail } from './poruchy.detail';

import { VadaForm } from './vada.frm';
import { VadaList } from './vada.list';
import { VadaDetail } from './vada.detail';
import { SkladKartaList } from './sklad.karta.list';
import { SkladKartaDetail } from './sklad.karta.detail';
import { SkladKartaForm } from './sklad.karta.frm';
import { OperaceDetailComponent } from './operace.detail';
import { OperaceListComponent } from './operace.list';
import { OperaceForm } from './operace.frm';

export { KalendarList } from './kalendar.list';
export { KalendarDetail } from './kalendar.detail';
export { KalendarForm } from './kalendar.frm';
export { PracovisteListComponent } from './pracoviste.list';
export { PracovisteDetailComponent } from './pracoviste.detail';
export { PracovisteForm } from './pracoviste.frm';
export { ZdrojListComponent } from './zdroj.list';
export { ZdrojDetailComponent } from './zdroj.detail';
export { ZdrojForm } from './zdroj.frm';

export { SkladForm } from './sklad.frm';
export { OperaceForm } from './operace.frm';
export { SkladKartaForm } from './sklad.karta.frm';
export { JednotkyForm } from './jednotky.frm';
export { VadaForm } from './vada.frm';
export { VadaList } from './vada.list';
export { VadaDetail } from './vada.detail';
export { SkladKartaList } from './sklad.karta.list';
export { CiselnikService } from './_services/ciselnik.service';
export { PracovistePicker } from './_picker/pracoviste/pracoviste.picker';

export { PoruchyForm } from './poruchy.frm';
export { PoruchyList } from './poruchy.list';
export { PoruchyDetail } from './poruchy.detail';
export  *  from './_obj/ciselnik';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule, MwCoreModule, RouterModule, 
  ],
  declarations: [
    PracovisteListComponent,
    PracovisteForm,
    PracovisteDetailComponent,
    PracovistePicker,
    ZdrojDetailComponent,
    ZdrojListComponent,
    ZdrojForm,
    KalendarSmenaDetail,
    KalendarSmenaList,
    KalendarDetail,
    KalendarList,
    KalendarForm,
    SkladForm,
    SkladList,
    SkladDetail,
    SkladKartaList,
    SkladKartaDetail,
    SkladKartaForm,
    JednotkyDetail,
    JednotkyList,
    JednotkyForm,
    PoruchyDetail,
    PoruchyList,
    PoruchyForm,
    VadaDetail,
    VadaList,
    VadaForm,
    OperaceDetailComponent,
    OperaceListComponent,
    OperaceForm     
  ],
  providers: [
    CiselnikService,
  ],

  exports: [
    PracovisteListComponent,
    SkladList,
    SkladDetail,
    SkladKartaList,
    SkladKartaDetail,
  ]

})
export class CiselnikModule {}