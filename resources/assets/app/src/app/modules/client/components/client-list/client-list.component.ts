import { Component, OnInit, Renderer, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment} from '../../../../../environments/environment';
import { searchFix } from "../../helpers/datatable";
import Swal from 'sweetalert2';
import { ClientService } from '../../services/client.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  headingText="List Clients";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions = {}
  dtTrigger: Subject<any> = new Subject();
  private apiURL = environment.api;
  constructor(
    private http:HttpClient,
    private renderer:Renderer,
    private router:Router,
    private clientService: ClientService,
    ) { }

    ngOnInit() {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        responsive:true,
        searching: true,
        ajax:(dataTablesParameters:any,callback) => {
          this.http.post(`${this.apiURL}client/list`,searchFix(dataTablesParameters),{})
              .subscribe(resp => {
                callback({ ...resp })
              })
        },
        columns:[
          { 
            orderable:false,
            title: `<input type="checkbox" class="header-check" name="" value="" data-id="">`,
            data: 'client_id',
            render:(client_id)=>`<input type="checkbox" class="cb_bulk" id="cb_bulk_${client_id}"  name="_${client_id}" value="">`
          },
          { 
            title: 'Name',
            data: 'name',
            render:(name)=>`<b>${name}</b>`
           },
          { title: 'Company', data: 'company.company_name', defaultContent: "N/A" },
          { title: 'Address', data: 'address' },
          { title: 'Phone', data: 'client_phone' },
          { title: 'Email', data: 'client_email' },
          { title: 'Type', data: 'client_type' },
          { 
            title: 'Action', 
            data:'client_id',
            orderable:false,
            render:(client_id) => 
            `
            <a class="btn btn-light btn-info" ><li class="fa fa-credit-card" client-card-id="${client_id}"></li></a>
            <a class="btn btn-light btn-warning"><li class="fa fa-edit" client-edit-id="${client_id}"></li></a>
            <a class="btn btn-light btn-warning" client-delete="${client_id}"><li class="fa fa-remove" client-delete-id="${client_id}"></li></a>
            `
          },
        ]
      }
      
    }
    test = false;
    ngAfterViewInit(): void {
      this.dtTrigger.next();
      this.renderer.listenGlobal('document', 'click', (event) => {
        if (event.target.hasAttribute("client-card-id")) {
          this.router.navigate(['account/carddetails',event.target.getAttribute("client-card-id")]);
        }
        if (event.target.hasAttribute("client-edit-id")) {
          this.router.navigate(['client-edit',event.target.getAttribute("client-edit-id")]);
        }
        if (event.target.hasAttribute("data-id")) {
          if(jQuery('.header-check').prop('checked')==true){
            jQuery('.cb_bulk').prop('checked', true);
          }else{
            jQuery('.cb_bulk').prop('checked', false);
          }
        }
        
        if(event.target.hasAttribute("client-delete-id") ){
          let client = event.target.getAttribute("client-delete-id")
          this.deleteClient(client);   
        }
        if(event.target.hasAttribute("client-delete") ){
          let client = event.target.getAttribute("client-delete")
          this.deleteClient(client);   
        }

      });
      
    }
    deleteClient(data){
      Swal({
          title: 'Warning',
          text: 'Are you sure to cancel this payment?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
      })
      .then((result) => {
        // var client = event.target.getAttribute("client-delete-id")
          if (result.value) {
              this.clientService.deleteClient(data).subscribe(
              data => {
                this.rerender();
                // this.router.navigateByUrl("/client-add");
              });
          }
      })
    }
    rerender(){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
    

}
