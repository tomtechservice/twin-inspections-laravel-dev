import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../intake/services/common/common.service';
import { ClientService } from '../../services/client.service';
import {CompanySearchComponent} from '../company-search/company-search.component';
import {Router,ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.component.html',
  styleUrls: ['./client-add.component.scss']
})
export class ClientAddComponent implements OnInit {
  public old_site;
  private apiSite = environment.apiSite;
  headingText = 'Add Client'
  submitted=false;
  displayNewCompanyFields = false;
  states: string[];
  readonly=false;
  clientId;
  company_reference_id=true;
  clientDetailsForm = this.fb.group({
    // client_first_name: ['',Validators.required],
    // client_last_name: ['',Validators.required],
    // company_name: [''],
    company_id:0,
    // company_reference_id: [''],
    // company_address1: [''],
    // company_address2: [''],
    // company_city:[''],
    // company_state:[''],
    // company_zip:[''],
    // company_phone:[''],
    // company_type:[''],

    // client_type: ['',Validators.required],
    // client_address1: ['',Validators.required],
    // client_address2: [''],
    // client_city: ['',Validators.required],
    // client_state: ['',Validators.required],
    // client_zip: ['',Validators.required],
    // client_phone: ['',Validators.required],
    // client_email: ['',Validators.required],
    new_client:this.fb.group({
      client_reference_id:0,
      client_first_name: ['',Validators.required],
      client_last_name: ['',Validators.required],
      client_type: ['',Validators.required],
      client_address1: ['',Validators.required],
      client_address2: [''],
      client_city: ['',Validators.required],
      client_state: ['',Validators.required],
      client_zip: ['',Validators.required],
      client_phone: ['',Validators.required],
      client_email: ['',Validators.required],

      company_name: [''],
      
      new_company:this.fb.group({
        // company_name: [''],
        company_reference_id: 0,
        company_address1: [''],
        company_address2: [''],
        company_city:[''],
        company_state:[''],
        company_zip:[''],
        company_phone:[''],
        company_type:[''],
      })
    }),
    // new_company:this.fb.group({
    //   company_reference_id: 0,
    //   company_address1: [''],
    //   company_address2: [''],
    //   company_city:[''],
    //   company_state:[''],
    //   company_zip:[''],
    //   company_phone:[''],
    //   company_type:[''],
    // })
  });

  constructor(
    config: NgbModalConfig,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private commonService: CommonService,
    private clientService: ClientService,
    private _router: Router,
    private router: ActivatedRoute,
    ) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit() {
    this.old_site = environment.apiSite;
    this.getStates();
    this.router.params.subscribe(params => {
      if (params.clientId) {
        this.clientId = params.clientId;
        this.editClient(this.clientId);
        this.headingText="Edit Client";
      } else {
        this.clientId = 0 ;
      }
    })
  }


  
  getStates() {
    this.commonService.getState().subscribe(
      data => {
       this.states = data as string[];
      }
    );
  }
  error_message='';
  onSubmit(){
    this.submitted=true;
    if (this.clientDetailsForm.invalid) {
      // console.log("lklk");
      return;
    }
    // console.log(this.clientDetailsForm.value);
    this.clientService.addClient(this.clientDetailsForm.value,this.clientId).subscribe(
      data=>{
        this.error_message='';
        this._router.navigate(['client-list']);
        // window.location.href = this.apiSite+'url/clients_list';
      },
      error=>{
        this.error_message=error;
        console.log(error);
      }
    );
  }
  newCompany() {
    this.displayNewCompanyFields = true;
    this.clientDetailsForm.patchValue({
      company_id:0,   
    })
    this.readonly=false;
  }

  lookupCompany() {
    this.displayNewCompanyFields = false;
  }
  openFormModal() {
    const modalRef = this.modalService.open(CompanySearchComponent,{size:'lg'});
    // modalRef.componentInstance.jobId = this.jobId;
    modalRef.result.then((result) => {
      console.log("sssss",result.param2);
      // this.clientDetailsForm.value.company_name = result.param2;
      
      this.clientDetailsForm.patchValue({
        company_id:result.param1,   
      })
      this.clientDetailsForm.get('new_client').patchValue({
        company_name:result.param2,   
      })
      this.readonly=true;
      // this.getTransactions();
    }).catch((error) => {
        console.log("test",error);
    });
  }
  job_details=[];
  check_job=false;
  editClient(client_id){
    this.clientService.editClient(client_id).subscribe(
      data=>{
        this.error_message='';
        this.company_reference_id=false;
        if(data.data.company){
          this.clientDetailsForm.patchValue({
            company_id:data.data.company.company_id,  
          })
          this.clientDetailsForm.get('new_client').patchValue({
            company_name:data.data.company.company_name,  
          })
          this.readonly=true; 
        }
        if(data.data){
          // this.clientDetailsForm.get('new_client').patchValue({
          //   company_name:data.data.company.company_name,  
          // })
          this.clientDetailsForm.patchValue({
            company_id:0,
            new_client:{
              client_reference_id:data.data.client_reference_id,
              client_first_name: data.data.client_first_name,
              client_last_name: data.data.client_last_name,
              client_type: data.data.client_type,
              client_address1: data.data.client_address1,
              client_address2: data.data.client_address2,
              client_city: data.data.client_city,
              client_state: data.data.client_state,
              client_zip: data.data.client_zip,
              client_phone: data.data.client_phone,
              client_email: data.data.client_email,

            },
            new_company:{

            }
          })
        }
        if(data.data.jobs){
          this.job_details = data.data.jobs;
          this.check_job = true;
        }
      },
      error=>{
        this.error_message=error;
      }
    );
  }

}
