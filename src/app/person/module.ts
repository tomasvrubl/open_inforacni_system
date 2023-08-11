import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { CiselnikModule } from '../ciselnik/module';
import { RouterModule } from '@angular/router';
import { PersonService } from './_services/person.service';
import { ProhlidkyService } from './_services/prohlidky.service';

import { OdmenaDetail } from './odmena.detail';
import { OdmenaList } from './odmena.list';
import { OdmenaForm } from './odmena.frm';
import { PersCinnostDetail } from './cinnost.detail';
import { PersCinnostList } from './cinnost.list';
import { PersCinnostForm } from './cinnost.frm';
import { PersSkupinaDetail } from './skupina.detail';
import { PersSkupinaList } from './skupina.list';
import { PersSkupinaForm } from './skupina.frm';
import { PersRizikovostDetail } from './rizikovost.detail';
import { PersRizikovostList } from './rizikovost.list';
import { PersRizikovostForm } from './rizikovost.frm';

import { OsobaListComponent } from './osoba.list';
import { OsobaDetailComponent } from './osoba.detail';
import { OsobaForm } from './osoba.frm';

import { PersPracKategorieDetail } from './prackat.detail';
import { PersPracKategoireList } from './prackat.list';
import { PersPracKategorieForm } from './prackat.frm';
import { PersZdravProhlidkaDetail } from './prohlidka.detail';
import { PersZdravProhlidkaList } from './prohlidka.list';
import { PersZdravProhlidkaForm } from './prohlidka.frm';
import { PersProhlidkaGenerator } from './prohlidka.gen';
import { PersProhlidkaNastaveni } from './prohlidka.nastaveni';


export { OdmenaForm } from './odmena.frm';
export { PersCinnostForm } from './cinnost.frm';
export { PersSkupinaForm } from './skupina.frm';
export { PersRizikovostForm } from './rizikovost.frm';
export { PersPracKategorieForm } from './prackat.frm';
export { PersZdravProhlidkaForm } from './prohlidka.frm';
export { PersProhlidkaGenerator } from './prohlidka.gen';

export { OsobaListComponent } from './osoba.list';
export { OsobaDetailComponent } from './osoba.detail';
export { OsobaForm } from './osoba.frm';


export  *  from './_obj/person';
export  *  from './_obj/prohlidky';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MwCoreModule, RouterModule, CiselnikModule
  ],
  declarations: [
    OdmenaDetail,
    OdmenaList,
    OdmenaForm,
    PersPracKategorieDetail,
    PersPracKategoireList,
    PersPracKategorieForm,
    PersCinnostDetail,
    PersCinnostList,
    PersCinnostForm,
    PersSkupinaDetail,
    PersSkupinaList,
    PersSkupinaForm,
    PersRizikovostDetail,
    PersRizikovostList,
    PersRizikovostForm,
    PersZdravProhlidkaDetail,
    PersZdravProhlidkaList,
    PersProhlidkaNastaveni,
    PersZdravProhlidkaForm,
    OsobaListComponent,
    OsobaDetailComponent,
    OsobaForm,
    PersProhlidkaGenerator,
  ],
  providers: [
    PersonService,
    ProhlidkyService
  ],
  exports: [
    OsobaListComponent,
    OsobaDetailComponent,
  ]
})

export class PersonModule {}