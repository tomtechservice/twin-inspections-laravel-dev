import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ClientRoutingModule } from './client-routing.module';
import { AccountComponent } from './pages/account/account.component';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { CardPaymentComponent } from './components/card-payment/card-payment.component';
import { ClientAddComponent } from './components/client-add/client-add.component';
import { CompanySearchComponent } from './components/company-search/company-search.component';
import { ClientListComponent } from './components/client-list/client-list.component';


@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    DataTablesModule,
  ],
  declarations: [AccountComponent, CardDetailsComponent, CardListComponent, CardPaymentComponent, ClientAddComponent, CompanySearchComponent, ClientListComponent],
  exports:[
    AccountComponent, 
    CardDetailsComponent,
    CompanySearchComponent	
  ],
  entryComponents: [
    CompanySearchComponent
  ]
})
export class ClientModule { }
