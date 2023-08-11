import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser'; 
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdHostDirective } from './_gui/adhost.directive';
import { SafeHtmlPipe } from './safehtml';
import { DndDirective } from './dnd.directive';
import { ListRefDirective } from './_gui/baselist/list.direct';
import { DropDown } from './_gui/dropdown/dropdown.comp';
import { MWDate } from './_gui/datetime/date'
import { MWTime } from './_gui/datetime/time'
import { Autocomplete } from './_gui/autocomplete/autocomp.comp';
import { AlertMessage } from './_gui/alertmsg/alertmsg.comp';
import { ProcessingComponent } from './_gui/processing/processing.comp';
import { ChangedInfo } from './_gui/changed/changed.comp'
import { PaginatorComponent } from './_gui/paginator/paginator.comp';
import { BreadcrumbComponent } from './_gui/breadcumb/breadcumb.comp';
import { TableComponent } from './_gui/table/table.comp';
import { ModalDropForm } from './_gui/modal/drop.comp';
import { ModalCommonForm } from './_gui/modal/common.comp';
import { BaseService } from './_services/base.service';
import { BaseListComponent } from './_gui/baselist/base';
import { DetailForm } from './_gui/detailform/base';
import { AuthenticationService } from './_services/auth.service';
import { UserService } from './_services/user.service';
import { CommonService } from './_services/common.service';
import { DashboardService } from './_services/dashboard.service';
import { SecurityUser } from './_obj/user';
import { PopWindowComponent } from './_gui/popwindow/popwindow.comp';
import { Fulltext } from './_gui/fulltext/fulltext.comp';
import { InfoMessage } from './_gui/infomsg/infomsg.comp';
import { UploadService } from './_services/upload.service';
import { UploaderComponent } from './uploader.comp';
import { AttachmentDetailComponent  } from './attach.detail';
import { AttachmentListComponent  } from './attach.list';
import { AttachmentForm  } from './attach.frm';
import { ReportDetailComponent  } from './report.detail';
import { ReportListComponent  } from './report.list';
import { ReportForm  } from './report.frm';
import { ReportService } from './_services/report.service';
import { ChooseComponent } from './_gui/choose/choose'
import { DetailComponent } from './_gui/detailform/detail';


export  * from './_gui/custombutton';
export  * from './_obj/user';
export  * from './_obj/common';
export { AdHostDirective} from './_gui/adhost.directive';
export { DndDirective} from './dnd.directive';
export { ListRefDirective} from './_gui/baselist/list.direct';
export { BaseListComponent } from './_gui/baselist/base';
export { DetailForm } from './_gui/detailform/base';
export { MWDate } from './_gui/datetime/date';
export { MWTime } from './_gui/datetime/time';
export { DropDown, ItemList } from './_gui/dropdown/dropdown.comp';
export { Autocomplete } from './_gui/autocomplete/autocomp.comp';
export { ChangedInfo } from './_gui/changed/changed.comp';
export { AlertMessage } from './_gui/alertmsg/alertmsg.comp';
export { ModalDropForm } from './_gui/modal/drop.comp';
export { ModalCommonForm } from './_gui/modal/common.comp';
export { BreadcrumbComponent } from './_gui/breadcumb/breadcumb.comp';
export { BaseService } from './_services/base.service';
export { AuthenticationService } from './_services/auth.service';
export { UserService } from './_services/user.service';
export { CommonService } from './_services/common.service';
export { SecurityUser, SecurityRoleGroup, SecurityRole } from './_obj/user';
export { ProcessingComponent } from './_gui/processing/processing.comp';
export { TableComponent } from './_gui/table/table.comp';
export { PaginatorComponent } from './_gui/paginator/paginator.comp';
export { DashboardService } from './_services/dashboard.service';
export { PopWindowComponent } from './_gui/popwindow/popwindow.comp';
export { Fulltext } from './_gui/fulltext/fulltext.comp';
export { InfoMessage } from './_gui/infomsg/infomsg.comp';
export { UploadService } from './_services/upload.service';
export { UploaderComponent } from './uploader.comp';
export { AttachmentDetailComponent  } from './attach.detail';
export { AttachmentListComponent  } from './attach.list';
export { AttachmentForm  } from './attach.frm';
export { ReportDetailComponent  } from './report.detail';
export { ReportListComponent  } from './report.list';
export { ReportForm  } from './report.frm';
export { ChooseComponent } from './_gui/choose/choose';
export { DetailComponent } from './_gui/detailform/detail';


@NgModule({
  imports: [ 
    BrowserModule, FormsModule,ReactiveFormsModule, MatDatepickerModule,MatNativeDateModule,MatFormFieldModule, MatInputModule,
    NgxMatTimepickerModule.setLocale('cs-CZ'), MatSelectModule
  ],
  declarations: [ SafeHtmlPipe, AdHostDirective, DndDirective, ListRefDirective, DropDown, AlertMessage, ModalDropForm, ChangedInfo, Autocomplete, MWDate, MWTime, DetailForm, BaseListComponent,
     TableComponent, PaginatorComponent, ModalCommonForm, ProcessingComponent, BreadcrumbComponent, 
     PopWindowComponent, Fulltext, InfoMessage, UploaderComponent, AttachmentDetailComponent, AttachmentListComponent, AttachmentForm,
     ReportDetailComponent, ReportListComponent, ReportForm,ChooseComponent, DetailComponent
  ],
  providers: [
    BaseService,
    AuthenticationService, DashboardService, UserService, SecurityUser, CommonService, UploadService, ReportService,
    {provide: MAT_DATE_LOCALE, useValue: 'cs-CZ'},
  ],
  exports: [  AdHostDirective, DndDirective, ListRefDirective, AlertMessage, DropDown, Autocomplete, ModalCommonForm, ModalDropForm, MWDate, MWTime,
            ChangedInfo, ProcessingComponent, DetailForm, BaseListComponent, PaginatorComponent, BreadcrumbComponent, TableComponent,
            PopWindowComponent, Fulltext, InfoMessage, UploaderComponent, AttachmentForm, ReportForm, ChooseComponent, DetailComponent
  ]
})


export class MwCoreModule {}