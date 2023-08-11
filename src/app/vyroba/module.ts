import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';
import { VyrobaService } from './_services/vyroba.service';

import { VyrOsobaList } from './vyr-osoba.list';

import { OdvadeniDetail } from './odvadeni.detail';
import { OdvadeniList } from './odvadeni.list';
import { OdvadeniForm } from './odvadeni.frm';

import { ZakazkaDetail } from './zakazka.detail';
import { ZakazkaList } from './zakazka.list';
import { ZakazkaForm } from './zakazka.frm';

import { VyrZarazeniDetail } from './zarazeni.detail';
import { VyrZarazeniList } from './zarazeni.list';
import { VyrZarazeniForm } from './zarazeni.frm';

import { VyrZapisSmenyDetail } from './zapis-smeny.detail';
import { VyrZapisSmenyList } from './zapis-smeny.list';
import { VyrZapisSmenyForm } from './zapis-smeny.frm';

export { VyrOsobaList } from './vyr-osoba.list';

export { VyrZarazeniDetail } from './zarazeni.detail';
export { VyrZarazeniList } from './zarazeni.list';
export { VyrZarazeniForm } from './zarazeni.frm';

export { OdvadeniDetail } from './odvadeni.detail';
export { OdvadeniList } from './odvadeni.list';
export { OdvadeniForm } from './odvadeni.frm';

export { ZakazkaDetail } from './zakazka.detail';
export { ZakazkaList } from './zakazka.list';
export { ZakazkaForm } from './zakazka.frm';

export { VyrZapisSmenyDetail } from './zapis-smeny.detail';
export { VyrZapisSmenyList } from './zapis-smeny.list';
export { VyrZapisSmenyForm } from './zapis-smeny.frm';


export  *  from './_obj/vyroba';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MwCoreModule, RouterModule
  ],
  declarations: [
    VyrOsobaList,
    VyrZarazeniDetail,
    VyrZarazeniList,
    VyrZarazeniForm,
    OdvadeniDetail,
    OdvadeniList,
    OdvadeniForm,
    ZakazkaDetail,
    ZakazkaList,
    ZakazkaForm,
    VyrZapisSmenyDetail,
    VyrZapisSmenyList,
    VyrZapisSmenyForm,
  ],
  providers: [
  VyrobaService
  ],
  
})

export class VyrobaModule {}