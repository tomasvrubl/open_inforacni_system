import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule} from '@angular/material/sidenav'
import { MatExpansionModule} from '@angular/material/expansion'
import { AppComponent} from './app.comp';
import { routing, appRoutingProviders } from './app.routing';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard.comp';
import { AuthComponent } from './auth.comp';
import { ResetPassComponent } from './reset.comp';
import { AppService } from './app.observ';

import { MwCoreModule} from './core/module';
import { CestakModule} from './cestak/module';
import { CiselnikModule} from './ciselnik/module';
import { PlanModule } from './plan/module';
import { VyrobaModule } from './vyroba/module';
import { HlaseniModule } from './hlaseni/module';
import { TavirnaModule } from './tavirna/module';
import { UdrzbaModule } from './udrzba/module';
import { PersonModule } from './person/module';
import { AdminModule} from './administrace/module';
import { OrganizaceModule} from './org/module';
import { PostaModule} from './posta/module';
import { PublicModule} from './public/module';

import { ContentComponent } from './content.comp';
import { NotFoundComponent } from './not.found.comp';
import { KeysPipe } from './keys.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    MatSidenavModule,
    MatExpansionModule,
    MwCoreModule,  
    CiselnikModule,
    PlanModule, 
    VyrobaModule,
    HlaseniModule,
    TavirnaModule,
    UdrzbaModule,
    PersonModule,
    CestakModule,
    OrganizaceModule,
    BrowserAnimationsModule,  
    AdminModule,
    PublicModule,
    PostaModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    AuthComponent,
    ResetPassComponent,
    ContentComponent,
    NotFoundComponent,
    KeysPipe
  ],
  providers: [
    appRoutingProviders,
    AppService,
    AuthGuard,
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
