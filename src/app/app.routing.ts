import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.comp';
import { ContentComponent } from './content.comp';
import { AutoForm, AutoReportForm, AutoVykazUserTemplComponent } from './cestak/module';
import { ObjMaterialuForm, FirmaForm, ObjMaterialPolList, TelseznamForm } from './org/module';
import { UserForm, SettingForm, SecurityRoleGroupForm, SecurityRoleForm, MenuDefForm, UserRoleForm } from './administrace/module';
import { PracovisteForm, ZdrojForm, KalendarForm, SkladForm, SkladKartaForm, JednotkyForm, VadaForm, OperaceForm, PoruchyForm } from './ciselnik/module';
import { AuthComponent } from './auth.comp';
import { AuthGuard} from './auth.guard';
import { ResetPassComponent } from './reset.comp';
import { NotFoundComponent } from './not.found.comp';
import { AttachmentForm, ReportForm } from './core/module';

import { TerminalLinkaForm, TerminalLinkaPlanForm, TerminalLinkaSmenaForm, TerminalAuthForm, SmenaList } from './public/module';
import { PlanDetailForm, PlanLinkaForm } from './plan/module';
import { OdvadeniForm, VyrZapisSmenyForm, VyrZarazeniForm, ZakazkaForm } from './vyroba/module';
import { HlaseniForm, HlaseniList, HlaseniDetail } from './hlaseni/module';
import { JakostForm, PecForm, LabVzorekForm } from './tavirna/module';
import { OdmenaForm, PersRizikovostForm, PersSkupinaForm, PersCinnostForm, OsobaForm, PersPracKategorieForm, PersZdravProhlidkaForm, PersProhlidkaGenerator } from './person/module';
import { PostaAliasForm, PostaDomainForm, PostaEmailForm } from './posta/module';
import { ZapisPoruchyForm } from './udrzba/zapis-poruchy.frm';

const routes: Routes = [

  { path: '', component: ContentComponent,   canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'home', component: DashboardComponent },
      { path: 'cestak/auto/list', component: AutoForm },
      { path: 'cestak/auto/:id', component: AutoForm },            
      { path: 'cestak/auto/vykaz/autocomplete', component: AutoVykazUserTemplComponent },      
      { path: 'cestak/auto/report/list', component: AutoReportForm },      
      { path: 'cestak/auto/report/print', component: AutoReportForm, data: {print: true} },
      { path: 'cestak/auto/report/:id', component: AutoReportForm },            
      { path: 'ciselnik/pracoviste/list', component: PracovisteForm },      
      { path: 'ciselnik/pracoviste/:id', component: PracovisteForm },         
      { path: 'ciselnik/zdroj', component: ZdrojForm },      
      { path: 'ciselnik/zdroj/:id', component: ZdrojForm },   
      { path: 'ciselnik/kalendar/list', component: KalendarForm },      
      { path: 'ciselnik/kalendar/:id', component: KalendarForm },          
      { path: 'ciselnik/kalendar/:id/:idc', component: KalendarForm },          
      { path: 'ciselnik/jednotky/list', component: JednotkyForm },      
      { path: 'ciselnik/jednotky/:id', component: JednotkyForm },      
      { path: 'ciselnik/vada', component: VadaForm },      
      { path: 'ciselnik/vada/:id', component: VadaForm },      
      { path: 'ciselnik/sklad/sklad/list', component: SkladForm },      
      { path: 'ciselnik/sklad/sklad/:id', component: SkladForm },                      
      { path: 'ciselnik/sklad/:skladid/karta/list', component: SkladKartaForm },      
      { path: 'ciselnik/sklad/:skladid/karta/:id', component: SkladKartaForm },            
      { path: 'ciselnik/sklad/karta/list', component: SkladKartaForm },      
      { path: 'ciselnik/sklad/karta/:id', component: SkladKartaForm },       
      { path: 'ciselnik/operace', component: OperaceForm },      
      { path: 'ciselnik/operace/:id', component: OperaceForm },       
      { path: 'ciselnik/poruchy/list', component: PoruchyForm },  
      { path: 'ciselnik/poruchy/print', component: PoruchyForm, data: {print: true}},  
      { path: 'ciselnik/poruchy/:id', component: PoruchyForm }, 
      { path: 'plan/linky/:id', component: PlanLinkaForm, data: {id: 3}},  
      { path: 'plan/pracoviste', component: PlanDetailForm },        
      { path: 'plan/pracoviste/:id', component: PlanDetailForm },  
      { path: 'vyroba/odvadeni', component: OdvadeniForm },      
      { path: 'vyroba/odvadeni/:id', component: OdvadeniForm },      
      { path: 'vyroba/zakazka', component: ZakazkaForm },      
      { path: 'vyroba/zakazka/:id', component: ZakazkaForm },   
      { path: 'vyroba/zarazeni/list', component: VyrZarazeniForm },  
      { path: 'vyroba/zarazeni/print', component: VyrZarazeniForm, data: {print: true}},  
      { path: 'vyroba/zarazeni/:id', component: VyrZarazeniForm }, 
      { path: 'vyroba/zapis-smeny/list', component: VyrZapisSmenyForm },  
      { path: 'vyroba/zapis-smeny/print', component: VyrZapisSmenyForm, data: {print: true}},  
      { path: 'vyroba/zapis-smeny/:id', component: VyrZapisSmenyForm }, 
      { path: 'admin/user/role/list', component: UserForm },            
      { path: 'admin/user/role/:id', component: UserRoleForm },            
      { path: 'admin/user/list', component: UserForm  },
      { path: 'admin/user/:id', component: UserForm },            
      { path: 'admin/setting/list', component: SettingForm  },
      { path: 'admin/setting/:id', component: SettingForm },      
      { path: 'admin/role/group/list', component: SecurityRoleGroupForm },
      { path: 'admin/role/group/:id', component: SecurityRoleGroupForm },  
      { path: 'admin/role/role/list', component: SecurityRoleForm },
      { path: 'admin/role/role/:id', component: SecurityRoleForm },  
      { path: 'admin/menu/list', component: MenuDefForm },
      { path: 'admin/menu/:id', component: MenuDefForm },  
      { path: 'admin/hlaseni/list', component: HlaseniForm },
      { path: 'admin/hlaseni/:id', component: HlaseniForm },  
      { path: 'hlaseni/list', component: HlaseniList },
      { path: 'hlaseni/:id', component: HlaseniDetail },
      { path: 'tavirna/jakost/list', component: JakostForm },
      { path: 'tavirna/jakost/print', component: JakostForm, data: {print: true}},  
      { path: 'tavirna/jakost/:id', component: JakostForm },      
      { path: 'tavirna/pec/list', component: PecForm },
      { path: 'tavirna/pec/print', component: PecForm, data: {print: true}},  
      { path: 'tavirna/pec/:id', component: PecForm }, 
      { path: 'laborator/vzorek/list', component: LabVzorekForm },
      { path: 'laborator/vzorek/print', component: LabVzorekForm, data: {print: true}},  
      { path: 'laborator/vzorek/:id', component: LabVzorekForm },      
      { path: 'pers/odmena/list', component: OdmenaForm },      
      { path: 'pers/odmena/:id', component: OdmenaForm },
      { path: 'pers/prackat/list', component: PersPracKategorieForm },
      { path: 'pers/prackat/:id', component: PersPracKategorieForm },
      { path: 'pers/osoba/list', component: OsobaForm },  
      { path: 'pers/osoba/print', component: OsobaForm, data: {print: true}},  
      { path: 'pers/osoba/:id', component: OsobaForm }, 
      { path: 'org/objmat/list', component: ObjMaterialuForm },
      { path: 'org/objmat/print', component: ObjMaterialuForm, data: {print: true}},  
      { path: 'org/objmat/:id', component: ObjMaterialuForm },
      { path: 'org/objmatpol/list', component: ObjMaterialPolList },
      { path: 'org/firma/list', component: FirmaForm },      
      { path: 'org/firma/print', component: FirmaForm, data: {print: true}},  
      { path: 'org/firma/:id', component: FirmaForm },      
      { path: 'org/telseznam/list', component: TelseznamForm },      
      { path: 'org/telseznam/print', component: TelseznamForm, data: {print: true}},  
      { path: 'org/telseznam/:typ/:id', component: TelseznamForm },
      { path: 'attachment/list', component: AttachmentForm },
      { path: 'attachment/:id', component: AttachmentForm },
      { path: 'prohlidky/id/:id', component: PersZdravProhlidkaForm },
      { path: 'prohlidky/nastaveni', component: PersZdravProhlidkaForm, data: {nastaveni: true} },
      { path: 'prohlidky/list', component: PersZdravProhlidkaForm },
      { path: 'prohlidky/print', component: PersZdravProhlidkaForm, data: {print: true}},  
      { path: 'prohlidky/cinnost/list', component: PersCinnostForm },
      { path: 'prohlidky/cinnost/:id', component: PersCinnostForm },
      { path: 'prohlidky/skupina/list', component: PersSkupinaForm },
      { path: 'prohlidky/skupina/:id', component: PersSkupinaForm },
      { path: 'prohlidky/rizikovost/list', component: PersRizikovostForm },
      { path: 'prohlidky/rizikovost/:id', component: PersRizikovostForm },
      { path: 'prohlidky/generator', component: PersProhlidkaGenerator },
      { path: 'udrzba/hlaseni-poruchy/list', component: ZapisPoruchyForm },
      { path: 'udrzba/hlaseni-poruchy/:id', component: ZapisPoruchyForm },
      { path: 'udrzba/hlaseni-poruchy/print', component: ZapisPoruchyForm, data: {print: true}},  
      { path: 'print/:printid', component: ReportForm },
      { path: 'print/:printid', component: ReportForm },
      { path: 'posta/domain/list', component: PostaDomainForm },      
      { path: 'posta/domain/print', component: PostaDomainForm, data: {print: true}},  
      { path: 'posta/domain/:id', component: PostaDomainForm },
      { path: 'posta/e-mail/list', component: PostaEmailForm },      
      { path: 'posta/e-mail/print', component: PostaEmailForm, data: {print: true}},  
      { path: 'posta/e-mail/:id', component: PostaEmailForm },
      { path: 'posta/alias/list', component: PostaAliasForm },      
      { path: 'posta/alias/print', component: PostaAliasForm, data: {print: true}},  
      { path: 'posta/alias/:id', component: PostaAliasForm }          
    ]},                    
    
    
    //http://gis.giff.cz/terminal/400003 - treminal na lince
  { path: 'terminal/linka/:kod', component: TerminalLinkaForm,
    children: [      
      { path: '', component: TerminalLinkaPlanForm, pathMatch: 'full' },
      { path: 'smena/:id', component: TerminalLinkaSmenaForm },
      { path: 'smena', component: TerminalLinkaSmenaForm },
      { path: 'historie/smena', component: SmenaList },
      { path: 'login', component: TerminalAuthForm },
    ]
  },


  { path: 'logout', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'resetpass', component: ResetPassComponent },
  { path: "**", component: NotFoundComponent}
  
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes, { useHash: false });
