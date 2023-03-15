import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountComponent} from '../client/pages/account/account.component';
import {ClientAddComponent} from '../client/components/client-add/client-add.component';
import {ClientListComponent} from '../client/components/client-list/client-list.component';

// const clientroutes: Routes = [
//   { path:'account-client', component: AccountComponent }
// ];
const clientroutes: Routes = [
  {path:'client-add', component: ClientAddComponent},
  {path:'client-list', component: ClientListComponent},
  {path:'client-edit/:clientId', component: ClientAddComponent},
  { path:'account',
    children:[
      {
        path:'',
        // component:DashboardComponent,
        children:[
          { path:'carddetails/:clientId', component:AccountComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(clientroutes)],
  exports: [RouterModule],
  declarations: []
})
export class ClientRoutingModule { }
