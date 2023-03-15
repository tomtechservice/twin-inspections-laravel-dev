import { NgModule, Component } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { ClientInfoComponent } from './component/client-info/client-info.component';
import { PropertyInfoComponent } from './component/property-info/property-info.component';
import { PropertyDetailsComponent } from './component/property-details/property-details.component';
import { SchedulingComponent } from './component/scheduling/scheduling.component';
import { InspectionInfoComponent } from './component/inspection-info/inspection-info.component';
import { FindingsComponent } from './component/findings/findings.component';
import { DiagramComponent } from './component/diagram/diagram.component';
import { ConfirmInspectionComponent } from './component/confirm-inspection/confirm-inspection.component'
import { JobInfoComponent } from './component/job-info/job-info.component'
import { CompletionTasksComponent } from './component/completion-tasks/completion-tasks.component'
import { ConfirmComponent } from './component/confirm/confirm.component'
import { OverviewComponent } from './component/overview/overview.component'
import { InspectionReportsComponent } from './component/inspection-reports/inspection-reports.component'

const intakeRoutes : Routes = [
  { path:'inspections-order-parties', component: ClientInfoComponent },
  { path:'inspections-order-parties/:jobId', component: ClientInfoComponent },
  { path:'inspections-edit-property', component: PropertyInfoComponent },
  { path:'inspections-edit-property/:jobId', component: PropertyInfoComponent },
  { path:'inspections-order-property2/:jobId', component: PropertyDetailsComponent },
  { path:'inspections-schedule', component: SchedulingComponent },
  { path:'inspections-schedule/:jobId', component: SchedulingComponent },
  { path:'inspections-profile/:jobId', component: InspectionInfoComponent },
  { path:'inspections-profile-findings/:jobId', component: FindingsComponent },
  { path:'inspections-profile-diagram/:jobId', component: DiagramComponent },
  { path:'inspections-profile-review/:jobId', component: ConfirmInspectionComponent },
  { path:'inspections-job/:jobId', component: JobInfoComponent },
  { path:'inspections-job-completion/:jobId', component: CompletionTasksComponent },
  { path:'inspections-job-review/:jobId', component: ConfirmComponent },
  { path:'inspections-completed-sheet/:jobId', component: OverviewComponent },
  { path:'inspections-reports/:jobId', component: InspectionReportsComponent }, 
];  

@NgModule({
  imports: [
    RouterModule.forRoot(intakeRoutes)
  ],
  exports: [ RouterModule ],
  declarations: []
})

export class IntakeRoutingModule { }
