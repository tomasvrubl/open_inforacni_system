import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { RouterModule } from '@angular/router';
import { CiselnikModule } from '../ciselnik/module';
import { PersonModule } from '../person/module';
import { OrganizaceService } from './_services/organizace.service';
import { FirmaDetail } from './firma.detail'
import { FirmaList } from './firma.list';
import { FirmaForm } from './firma.frm';
import { ObjMaterialPolList } from './objmatpol.list';
import { ObjMaterialDetail } from './objmat.detail';
import { ObjMaterialList } from './objmat.list';
import { ObjMaterialuForm } from './objmat.frm';
import { TelseznamForm } from './telseznam.frm';
import { TelseznamList } from './telseznam.list';
import { TelseznamDetail } from './telseznam.detail';

export { TelseznamForm } from './telseznam.frm';
export { ObjMaterialuForm } from './objmat.frm';
export { ObjMaterialPolList } from './objmatpol.list';

export { FirmaForm } from './firma.frm';

export  *  from './_obj/organizace';
export  *  from './_obj/firma';

@NgModule({
    
  imports: [
    BrowserModule, FormsModule,
    MwCoreModule, RouterModule, CiselnikModule, PersonModule
  ],
  declarations: [
    FirmaDetail, 
    FirmaList,
    FirmaForm,
    ObjMaterialDetail,
    ObjMaterialuForm,
    ObjMaterialList,
    ObjMaterialPolList,
    TelseznamDetail,
    TelseznamList,
    TelseznamForm,

  ],
  providers: [
    OrganizaceService,
  ],

  exports: [
    
  ]

})

export class OrganizaceModule {}
