import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import { CommonService } from '../../services/common/common.service';
import { Job } from '../../jobc';
import { JobService } from '../../services/job/job.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportManagerComponent } from '../../../popups/component/report-manager/report-manager.component'
import { environment } from '../../../../../environments/environment'
import { FindingService } from '../../services/../services/finding/finding.service'
import Swal from 'sweetalert2';
import { ReportsService as ReportDocs} from '../../../popups/services/reports.service'



@Component({
  selector: 'app-confirm-inspection',
  templateUrl: './confirm-inspection.component.html',
  styleUrls: ['./confirm-inspection.component.scss']
})
export class ConfirmInspectionComponent implements OnInit {
  page_title=" Inspection: Review/Finalizing"
  public old_site;

  jobId : number;
  public userData;
  pageLoaderShow = false;
  loderDivShow = true; 
  reportGenerating = false;
  testhtml1 = "<i class='fa fa-square-o'></i>";
  testhtml2 = "<i class='fa fa-square-o'></i>";
  testhtml3 = "<i class='fa fa-square-o'></i>";
  testhtml4 = "<i class='fa fa-square-o'></i>";
  testhtml5 = "<i class='fa fa-square-o'></i>";

  testclass1 : boolean;
  testclass2 : boolean;
  testclass3 : boolean;
  testclass4 : boolean;
  testclass5 : boolean;
  report={
    report_description_general:"",
    report_diagram_file:"",
    report_pdf_file:null,
    report_pdf_file_w_contract:null,

  }

  buttonDisabled = false;
  checklist_warning='';
  status = '';



  job = new Job(null,'',null,null,null,null,null,null,null,
                null,'',null,'','','','',null,'',null,'','','','','','','','','');

  private doSpace = environment.doSpace;

  constructor( 
        private commonService:CommonService,
        private jobService:JobService,
        private findingService: FindingService,
        private reportDocs: ReportDocs,
        private _router: Router,
        private router: ActivatedRoute,
        private modelService : NgbModal ) { 
        this.testclass1 =false;
        this.testclass2 =false;
        this.testclass3 =false;
        this.testclass4 =false;
        this.testclass5 =false;
  
    }

    ngOnInit() {
      this.userData = JSON.parse(localStorage.getItem('user'));
      this.old_site = environment.apiSite;
      this.router.params.subscribe(params => {
        if(params.jobId){
          this.jobId = params.jobId;
          this.getJob(params.jobId);
        }
      })
      
      
    }
    toggleClass(event){
      switch(event){
        case 'info' : 
          if(this.testclass1 == false){
            this.testhtml1 = "<i class='fa fa-check-square-o'></i>";
            this.testclass1 =true;
          }else{
            this.testhtml1 = "<i class='fa fa-square-o'></i>";
            this.testclass1 =false;
          }
          
        break;
        case 'finding' :
          if(this.testclass2 ==false){
            this.testhtml2 = "<i class='fa fa-check-square-o'></i>";
            this.testclass2 =true;
          }else{
            this.testhtml2 = "<i class='fa fa-square-o'></i>";
            this.testclass2 =false;
          }
          
        break;
        case 'bids' : 
          if(this.testclass3 ==false){
            this.testhtml3 = "<i class='fa fa-check-square-o'></i>";
            this.testclass3 =true;
          }else{
            this.testhtml3 = "<i class='fa fa-square-o'></i>";
            this.testclass3 =false;
          }
          
        break;
        case 'diagram' : 
          if(this.testclass4 ==false){
            this.testhtml4 = "<i class='fa fa-check-square-o'></i>";
            this.testclass4 =true;
          }else{
            this.testhtml4 = "<i class='fa fa-square-o'></i>";
            this.testclass4 =false;
          }
          
        break;
        case 'report' : 
        
          if(this.testclass5 ==false){
            this.testhtml5 = "<i class='fa fa-check-square-o'></i>";
            this.testclass5 =true;
          }else{
            this.testhtml5 = "<i class='fa fa-square-o'></i>";
            this.testclass5 =false;
          }
          this.checkIfCompleted();
        break;
        default : '';
      }
      this.buttonDisable();
      
        
    }
    buttonDisable(){
      if(this.testclass1 == true && this.testclass2 == true && this.testclass3 == true && this.testclass4==true && this.testclass5 == true){
        this.buttonDisabled = true;
      }else{
        this.buttonDisabled = false;
      }
    }

    getJob(jid){
      this.jobService.getJob(jid).subscribe(
        data => {
          this.loderDivShow = false; 
              if(data){
                this.job = new Job(
                  data.job_id, 
                  data.job_ref_suffix,
                  data.job_ref_parent,
                  data.client_id,
                  data.billing_id,
                  data.buyer_agent_id,
                  data.seller_agent_id,
                  data.title_escrow_id,
                  data.property_id,
                  data.agent_id,
                  data.job_sub_type,
                  data.scheduled_id,
                  data.job_date_scheduled,
                  data.job_fee,
                  data.job_fee_discount,
                  data.job_fee_discount_type,
                  (data.report)?data.report.report_id:"",
                  data.job_status,
                  (data.report)?data.report.report_change_status:"",
                  (data.report)?data.report.report_description_general:"",
                  (data.report)?data.report.report_diagram_file:"",
                  (data.report)?data.report.report_pdf_file:null,
                  (data.report)?data.report.report_pdf_file_w_contract:null,
                  (data.job_property)?data.job_property.property_address1 :"",
                  (data.job_property)?data.job_property.property_address2 :"",
                  (data.job_property)?data.job_property.property_city :"",
                  (data.job_property)?data.job_property.property_state :"",
                  (data.job_property)?data.job_property.property_zip :"",
                  )
                  if(data.report!=null){
                    this.report.report_description_general =  this.job.report_description_general;
                    this.report.report_diagram_file = this.job.report_diagram_file;
                    this.report.report_pdf_file = this.job.report_pdf_file;
                    this.report.report_pdf_file_w_contract  = this.job.report_pdf_file_w_contract;

                    if(data.job_status == 'Inspection'){
                      this.status = 'Inspection';
                      console.log("Inspection");
                    }else if (data.job_status == 'Work') {
                      this.status = 'Work';
                      console.log("work");
                    }else {
                      this.status = 'Other';
                      console.log("other");
                    }
                    this.checkIfCompleted();
                  }else{
                    this.status = 'NoReport';
                  }
                  
                  console.log('ee',this.job);
              } 
              
            
            });
    }
    checkIfCompleted(){
      console.log(this.report.report_pdf_file)
      console.log(this.report.report_pdf_file_w_contract)
      if(this.report.report_pdf_file!= null && this.report.report_pdf_file_w_contract!= null){
        this.testhtml5 = "<i class='fa fa-check-square-o'></i>";
        this.testclass5 =true;
      }else{
        this.checklist_warning = '<i class="fa fa-exclamation-circle"></i > You must be sure to manually generate both the Inspection Report and Work Order Contract. Use icons found above Findings list.<br /><br /><a href="'+this.old_site+'app/inspections-profile-findings/'+this.jobId+'"><i class="fa fa-toggle-left"></i > GoTo Findings/Bids</a>';
         
        this.testhtml5 = "<i class='fa fa-square-o'></i>";
        this.testclass5 =false;
      }

      if(this.report.report_description_general!=''){
        this.testhtml1 = "<i class='fa fa-check-square-o'></i>";
        this.testclass1 =true;
      }
      if(this.report.report_diagram_file!=''){
        this.testhtml4 = "<i class='fa fa-check-square-o'></i>";
        this.testclass4 =true;
      }
      this.buttonDisable();
      // console.log(this.job.report.report_pdf_file);
      
    }
    
  inspectionCompletedSubmit(){
    this.jobService.addInspectionCompleted(this.job).subscribe(
      data => {
        console.log(data);
        // window.location.href = this.old_site+'url/inspections_completed_sheet/'+this.job.job_id;
        this._router.navigate(['inspections-completed-sheet',this.job.job_id]);
      }
    );
  }

  reportManagerOpen() {
    const modalRef = this.modelService.open(ReportManagerComponent);
    modalRef.componentInstance.job_id = this.jobId;

    modalRef.result.then((result) => {
      
    }).catch((error) => {
      
    });
  }

  makeFindingsReportPdf(type, gen_type) {
    this.reportGenerating = true
    var data = {
        'type' : type,
        'jid' : this.jobId,
        'gen_type' : gen_type
    }   
    this.findingService.generateReport(data).subscribe(
      
      data => {
        this.reportGenerating = false
        if(data.status==200) {
          this.getJob(this.jobId);
          Swal(
            'Success!',
            data.result.message,
            'success'
          )
        } else if(data.status==400){
          Swal(
            'Error!',
            data.result.message,
            'warning'
          )
        }
      } 
    
    );
  
  }

   
  downloadDoc(docName) {
    let params = {};
    params['jobId'] = this.jobId; 
    params['docName'] = docName; 
    params['docType'] = 'reprts_download'; 
    var file = this.reportDocs.downloadDoc(params);
    window.open(file, "_blank",'',false);
  }
  
  

}
