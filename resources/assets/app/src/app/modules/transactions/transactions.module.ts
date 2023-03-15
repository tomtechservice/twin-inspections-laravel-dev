import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { AccountingTransactionsListComponent } from './pages/accounting-transactions-list/accounting-transactions-list.component';
import { AddTransactionComponent,TestContent } from './components/add-transaction/add-transaction.component';
import { CardDetailsComponent} from '../client/components/card-details/card-details.component';
import {ClientModule} from '../client/client.module';
@NgModule({
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ClientModule
  
  ],
  declarations: [AccountingTransactionsListComponent, AddTransactionComponent,TestContent],
  entryComponents: [
    AddTransactionComponent,
    CardDetailsComponent,
    TestContent
  ]
})
export class TransactionsModule { }
