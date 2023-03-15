import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { TinymceModule } from 'angular2-tinymce';
import{ IntakeRoutingModule } from './intake-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './component/header/header.component';
import { InspectionsOrderComponent } from './component/inspections-order/inspections-order.component'
import { PropertyInfoComponent } from './component/property-info/property-info.component';
import { InspectionsOrderPartiesComponent } from './component/inspections-order-parties/inspections-order-parties.component';
import { PanelComponent } from './component/panel/panel.component';
import { ClientInfoComponent } from './component/client-info/client-info.component';
import { ClientComponent } from './component/client/client.component';
import { PropertyDetailsComponent } from './component/property-details/property-details.component';
import { SchedulingComponent,CreditCardContent } from './component/scheduling/scheduling.component';
import { InspectionInfoComponent } from './component/inspection-info/inspection-info.component';
import { FindingsComponent } from './component/findings/findings.component';
import { JobInfoComponent, CreditCardContentJobInfo  } from './component/job-info/job-info.component';
import { DiagramComponent } from './component/diagram/diagram.component';
import { CompletionTasksComponent } from './component/completion-tasks/completion-tasks.component';
import { ConfirmComponent } from './component/confirm/confirm.component';
import { OverviewComponent } from './component/overview/overview.component';
import { ConfirmInspectionComponent } from './component/confirm-inspection/confirm-inspection.component';
import { LookupcodeComponent } from './component/lookupcode/lookupcode.component'
import { InspectionReportsComponent } from './component/inspection-reports/inspection-reports.component'
import { ClientModule } from '../client/client.module';
import { ChemicalsComponent } from './completion-component/chemicals/chemicals.component';
import { MaterialsComponent } from './completion-component/materials/materials.component';
import { ChemAppHoursComponent } from './completion-component/chem-app-hours/chem-app-hours.component';
import { CrewHoursComponent } from './completion-component/crew-hours/crew-hours.component';
import { SubContractorsComponent } from './completion-component/sub-contractors/sub-contractors.component';
import { AdditionalWorkPerformedComponent } from './completion-component/additional-work-performed/additional-work-performed.component';
import { FindingsModelComponent } from './completion-component/findings-model/findings-model.component';
import { FindingsChemicalsAppliedModelComponent } from './completion-component/findings-chemicals-applied-model/findings-chemicals-applied-model.component';
import { JobOrderComponent } from './child-component/job-order/job-order.component';
import { InspectionStatusComponent } from './child-component/inspection-status/inspection-status.component';
import { ReportPaymentComponent } from './child-component/report-payment/report-payment.component';
import { ChangeEscrowComponent } from './child-component/change-escrow/change-escrow.component';
import { InterestedPartiesComponent } from './child-component/interested-parties/interested-parties.component';
import { PropertyOverviewComponent } from './child-component/property-overview/property-overview.component';
import { InspectionOverviewComponent } from './child-component/inspection-overview/inspection-overview.component';
import { InspectionTypeComponent } from './child-component/inspection-type/inspection-type.component';
import { ChangeInspectorComponent } from './child-component/change-inspector/change-inspector.component';
import { NotesComponent } from './child-component/notes/notes.component';
import { JobCostOverviewComponent } from './child-component/job-cost-overview/job-cost-overview.component';
import { ScheduleNewInspectionComponent } from './child-component/schedule-new-inspection/schedule-new-inspection.component';
import { ReportDocumentComponent } from './child-component/report-document/report-document.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IntakeRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    ClientModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBOPZbXMZdO9rqYZT007G2DIw2a6Nppbhw',
    //   libraries:['places']
    // }),
    TinymceModule.withConfig({})
  ],
  providers: [
    GoogleMapsAPIWrapper // <---
  ],
  declarations: [
    HeaderComponent, 
    PropertyInfoComponent, 
    InspectionsOrderComponent, 
    InspectionsOrderPartiesComponent, 
    PanelComponent, 
    ClientInfoComponent, 
    ClientComponent, 
    PropertyDetailsComponent, 
    SchedulingComponent, 
    InspectionInfoComponent, 
    FindingsComponent, 
    JobInfoComponent, 
    DiagramComponent, 
    CompletionTasksComponent, 
    ConfirmComponent, 
    OverviewComponent, 
    ConfirmInspectionComponent, 
    LookupcodeComponent, 
    InspectionReportsComponent,
    CreditCardContent, 
    ChemicalsComponent, 
    MaterialsComponent, 
    ChemAppHoursComponent, 
    CrewHoursComponent, 
    SubContractorsComponent, 
    AdditionalWorkPerformedComponent, 
    FindingsModelComponent, 
    FindingsChemicalsAppliedModelComponent,
    JobOrderComponent, 
    InspectionStatusComponent, 
    ReportPaymentComponent,
    ChangeEscrowComponent, 
    InterestedPartiesComponent, 
    PropertyOverviewComponent, 
    InspectionOverviewComponent, 
    InspectionTypeComponent, 
    ChangeInspectorComponent, 
    NotesComponent, 
    JobCostOverviewComponent, 
    ScheduleNewInspectionComponent, 
    ReportDocumentComponent,
    CreditCardContentJobInfo
  ],
  entryComponents: [
    LookupcodeComponent,
    CreditCardContent,
    ChemicalsComponent,
    MaterialsComponent,
    ChemAppHoursComponent,
    CrewHoursComponent,
    SubContractorsComponent,
    AdditionalWorkPerformedComponent,
    FindingsModelComponent,
    FindingsChemicalsAppliedModelComponent,
    CreditCardContentJobInfo,
    InspectionStatusComponent,
    ReportPaymentComponent,
    ChangeEscrowComponent,
    PropertyOverviewComponent,
    ChangeInspectorComponent,
    InspectionTypeComponent,
    NotesComponent,
    JobCostOverviewComponent,
    ScheduleNewInspectionComponent
  ]
})
export class IntakeModule { }
