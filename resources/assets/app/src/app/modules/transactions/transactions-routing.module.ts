import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountingTransactionsListComponent} from './pages/accounting-transactions-list/accounting-transactions-list.component';

// const routes: Routes = [];
const clientroutes: Routes = [
  {
    path:'transaction',
    children:[
      {
        path:'',
        // component:DashboardComponent,
        children:[
          { path:'list/:jobId', component:AccountingTransactionsListComponent },
          
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(clientroutes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
