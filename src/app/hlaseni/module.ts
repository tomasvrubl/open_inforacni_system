import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MwCoreModule } from '../core/module';
import { HlaseniTypDetail } from './hlaseni.typ.detail';
import { HlaseniTypList } from './hlaseni.typ.list';
import { HlaseniForm } from './hlaseni.typ.frm';
import { HlaseniList } from './hlaseni.list';
import { HlaseniDetail } from './hlaseni.detail';
import { HlaseniService } from './_services/hlaseni.service';


export  * from './_obj/hlaseni';
export { HlaseniForm } from './hlaseni.typ.frm';
export { HlaseniService } from './_services/hlaseni.service';
export { HlaseniList } from './hlaseni.list';
export { HlaseniDetail } from './hlaseni.detail';

@NgModule({    
    imports: [   BrowserModule, FormsModule,
        MwCoreModule, RouterModule
    ],
    declarations: [ HlaseniTypDetail, HlaseniTypList, HlaseniForm, HlaseniList, HlaseniDetail     
    ],
    providers: [ HlaseniService
    ]
})

export class HlaseniModule { }