import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import{ LockoutRoutingModule } from './lockout-routing.module';
import { LockoutComponent } from './components/lockout/lockout.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule,
    AgmCoreModule,
    LockoutRoutingModule,
    NgbModule
  ],
  providers: [
    GoogleMapsAPIWrapper // <---
  ],
  declarations: [
    LockoutComponent
  ],
  entryComponents: [
    LockoutComponent
  ]
})
export class LockoutModule { }
