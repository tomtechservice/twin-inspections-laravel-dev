import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload'
import { IntakeRoutingModule } from '../intake/intake-routing.module'

import { ReportManagerComponent } from './component/report-manager/report-manager.component';
import { FindingAddComponent } from './component/finding-add/finding-add.component';
import { BidPrimaryComponent } from './component/bid-primary/bid-primary.component';

import { SwitchAgentComponent } from './component/switch-agent/switch-agent.component';
import { BidSecondaryComponent } from './component/bid-secondary/bid-secondary.component';
import { ViewFindingComponent } from './component/view-finding/view-finding.component';
import { FindingImageComponent } from './component/finding-image/finding-image.component';
import { VariableEditorComponent } from './component/variable-editor/variable-editor.component';
import { FindingDiscountComponent } from './component/finding-discount/finding-discount.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    FileUploadModule,
    IntakeRoutingModule
  ],

  declarations: [
    ReportManagerComponent, 
    FindingAddComponent, 
    BidPrimaryComponent, 
    BidSecondaryComponent,
    SwitchAgentComponent, 
    ViewFindingComponent, 
    FindingImageComponent, 
    VariableEditorComponent, FindingDiscountComponent,
  ],
  
  entryComponents: [
    ReportManagerComponent,
    FindingAddComponent,
    BidPrimaryComponent,
    BidSecondaryComponent,
    SwitchAgentComponent,
    ViewFindingComponent,
    FindingImageComponent,
    VariableEditorComponent,
    FindingDiscountComponent 
  ]
})
export class PopupsModule { }