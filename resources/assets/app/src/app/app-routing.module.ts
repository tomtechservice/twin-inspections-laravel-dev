import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { LoginComponent }   from './login/login.component';
import { AuthGuard } from './extras/auth.guard';
import { GroupWidgetsComponent } from './group-widgets/group-widgets.component'

import { ShareWidgetsComponent } from './shared/components/share-widgets/share-widgets.component'
import {SotableWidgetComponent} from './shared/components/sotable-widget/sotable-widget.component'

import { ReportSettingsComponent } from './components/report-settings/report-settings.component';
import { InspectionReportSettingComponent } from './components/inspection-report-setting/inspection-report-setting.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
  	{path: '', canActivate: [AuthGuard], children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path:'groupwidget/:groupId', component:GroupWidgetsComponent },
      { path:'share-widgets', component:ShareWidgetsComponent },
      { path:'sort-widgets', component:SotableWidgetComponent },
      { path:'report-settings', component:ReportSettingsComponent },
      { path:'findings-report-settings', component:InspectionReportSettingComponent },
    ]}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}