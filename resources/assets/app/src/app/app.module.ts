import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { NgxSortableModule } from 'ngx-sortable'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { FooterComponent } from './footer/footer.component';
import { ReportsModule } from './modules/reports/reports.module';
import { LoginComponent } from './login/login.component';
import { IntakeModule } from './modules/intake/intake.module';
import { PopupsModule } from './modules/popups/popups.module';
import { ClientModule } from './modules/client/client.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

import { ErrorInterceptor } from './extras/error.interceptor';
import { JwtInterceptor } from './extras/jwt.interceptor';
import { QuickWidgetFormModalComponent } from './shared/components/quick-widget-form-modal/quick-widget-form-modal.component';
import { QuickWidgetComponent } from './shared/components/quick-widget/quick-widget.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ClickOutsideModule } from 'ng-click-outside';
import { WantsEarlierComponent } from './shared/components/wants-earlier/wants-earlier.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GroupWidgetsComponent } from './group-widgets/group-widgets.component';
import { ShareWidgetsComponent } from './shared/components/share-widgets/share-widgets.component';
import { SotableWidgetComponent } from './shared/components/sotable-widget/sotable-widget.component';
import { ReportSettingsComponent } from './components/report-settings/report-settings.component';

import { TinymceModule } from 'angular2-tinymce';
import { InspectionReportSettingComponent } from './components/inspection-report-setting/inspection-report-setting.component';
import { LockoutModule } from './modules/lockout/lockout.module';
import { LockboxModule } from './modules/lockbox/lockbox.module';
import { FeesModule } from './components/office-fees/fees.module';




@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        DashboardComponent,
        FooterComponent,
        LoginComponent,
        QuickWidgetFormModalComponent,
        QuickWidgetComponent,
        WantsEarlierComponent,
        GroupWidgetsComponent,
        ShareWidgetsComponent,
        SotableWidgetComponent,
        ReportSettingsComponent,
        InspectionReportSettingComponent,

    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule.forRoot(),
        AppRoutingModule,
        DataTablesModule,
        FormsModule,
        ReactiveFormsModule,
        ReportsModule,
        ChartsModule,
        SweetAlert2Module.forRoot(),
        IntakeModule,
        ClientModule,
        TransactionsModule,
        PopupsModule,
        NgxSortableModule,
        ClickOutsideModule,
        LockoutModule,
        LockboxModule,
        FeesModule,
        TinymceModule.withConfig({
            skin_url: 'assets/tinymce/skins/lightgray'
        }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAD_Cfk1gD8pittyTLzzcLXhGnCDF_aGwo',
            libraries: ['places']
        }),
        NgMultiSelectDropDownModule.forRoot()

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        QuickWidgetFormModalComponent
    ]
})
export class AppModule { }
