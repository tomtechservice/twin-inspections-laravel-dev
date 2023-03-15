import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder,Validators } from '@angular/forms';
import { ReportManagerComponent } from '../../../popups/component/report-manager/report-manager.component';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job/job.service';
import { FindingService } from '../../services/finding/finding.service';
import { ViewFindingComponent } from '../../../popups/component/view-finding/view-finding.component'
import { UserService } from '../../services/user/user.service';
import { FindingDiscountComponent } from '../../../popups/component/finding-discount/finding-discount.component'
import Swal from 'sweetalert2';
import { ClientService } from '../../services/client/client.service'
import {NgbDateParserFormatter, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { AccountServicesService } from '../../../client/services/account-services.service';
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';
import {CommonService} from '../../../intake/services/common/common.service';

@Component({
  selector: 'test-content',
  template: `
      <app-card-details [client_id]='client_id' (notify)='onNotify($event)'></app-card-details>
  `
  })
  export class CreditCardContentJobInfo {
  @Input() client_id;

  constructor(public activeModal: NgbActiveModal) {
      console.log(this.client_id)
  }

  onNotify(event){
      this.activeModal.close('Modal Closed');
  }
}


@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit {

  @Input() intakeTab;
  public jobId;
  public job : string[]
  public findings : string[]
  public clientCards: string[]
  public fill_all_value = "0";
  public section1_total = 0.00;
  public section2_total = 0.00;
  public section3_total = 0.00;

  public nameOwner = null;
  public buyerAgent = null;
  public sellerAgent = null;
  public nameBuyer = null; 

  public nameOwnerComp = null;
  public nameBuyerAgentComp = null;
  public nameSellerAgentComp = null;
  public nameBuyerComp = null;

  public job_perform_date = null
  public job_perform_time = null

  orderedSubmitted = false
  submitLoaderShow = false
  topPDFLoaderShow = false
  validationCheck = true;
  creditCardFields = false;
  isCardDataLoad = false

  page_title = 'Inspection: Work Order and Completion Tasks';
  
  

  public assigneeData = {
    'crew' : [],
    'contractor' : [],
    'inspector' : []
  }
  loderDivShow = true;
  pageLoaderShow = false
  isLoad=false;

  public contractorFids = [];
  public treaterFids = []
  public crewFids = []

  isLockoutVerified=false;
  lockoutSetting:any;

	constructor(
    private modelService : NgbModal,
    private route: ActivatedRoute,
    private jobService: JobService,
    private findingService: FindingService,
    private userService : UserService,
    private clientService : ClientService,
    private fb: FormBuilder,
    private account: AccountServicesService,
    private commonService: CommonService,
  ) { 
    this.route.params.subscribe(params => { this.jobId = params['jobId']; });
  }

	ngOnInit() {
    this.getJobData(); 
    this.getAssigneeList();
    this.lockoutSettings();
  }
	nextPage(){
    this.intakeTab.select('tab-selectbyid10');
  }
  
  
  getJobData() {
    this.isLoad=false;
      this.jobService.getJobForJobinfo(this.jobId).subscribe(
        data => {
          this.isLoad=true;
          this.job = data as string[]
          this.job_perform_date =  this.dateFormat(this.job['job_perform_datim'] );
          this.job_perform_time =  this.timeFormat(this.job['job_perform_datim'] );
          this.getWorkOrderedByData();
          this.getCardDetals(this.job['client_id'])
          if(this.job['job_billing_bu_credit_card'] =='yes') {
            this.creditCardFields = true; 
          }
        }
      )
  }

  dateFormat(date){
    var d = new Date(date)
    let month = (d.getMonth()+1)
    let  day = d.getDate()
    let year = d.getFullYear()
    return {
        "year": year,
        "month": month,
        "day": day
      }
  }

  timeFormat(date) {
    var d = new Date(date)
    let h = (d.getHours()<10?'0':'') + d.getHours();
    let m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    let s = (d.getSeconds()<10?'0':'') + d.getSeconds();
    if(h=='NaN' || m=='NaN' || s=='NaN') {
      return '00' + ':' + '00' + ':' + '00';
    } else {
      return h + ':' + m + ':' + s;
    }
  }

  getFindingsData() {
     this.findingService.getFindingsForJobInfo(this.jobId).subscribe(
       data => {
          this.findings = data as string[]
          this.loderDivShow = false;
          this.findings.forEach(element => {
            if(element['finding_which_bid'] == ''){
              element['finding_bid_primary_or_secondary'] = 'primary';
            } else {
              element['finding_bid_primary_or_secondary'] = element['finding_which_bid'];
            }
          });
          this.getFindingsTotals();
          this.setUserTypeFindings(); 
       }
     )
  }

  

  getWorkOrderedByData() {
    if(this.job['property_owner_id']) {
      this.nameOwner = this.job['property_owner']['client_last_name'] + ', ' + this.job['property_owner']['client_first_name'];
      this.nameOwnerComp = this.job['property_owner']['client_last_name'] + ', ' + this.job['property_owner']['client_first_name'];
    }
    if(this.job['buyer_agent_id']) {
      this.buyerAgent = this.job['buyer_agent']['client_last_name'] + ', ' + this.job['buyer_agent']['client_first_name'];
      this.nameBuyerAgentComp = this.job['buyer_agent']['client_last_name'] + ', ' + this.job['buyer_agent']['client_first_name'];
    }
    if(this.job['seller_agent_id']) {
      this.sellerAgent = this.job['seller_agent']['client_last_name'] + ', ' + this.job['seller_agent']['client_first_name'];
      this.nameSellerAgentComp = this.job['seller_agent']['client_last_name'] + ', ' + this.job['seller_agent']['client_first_name'];
    }
    if(this.job['buyer_id']) {
      this.nameBuyer = this.job['buyer']['client_last_name'] + ', ' + this.job['buyer']['client_first_name'];
      this.nameBuyerComp = this.job['buyer']['client_last_name'] + ', ' + this.job['buyer']['client_first_name'];
    } 
       
    
  }
  
  reportManagerOpen() {
    const modalRef = this.modelService.open(ReportManagerComponent,{ size: 'lg' });
      modalRef.componentInstance.job_id = this.jobId;
      modalRef.result.then((result) => {
    }).catch((error) => {
        
    });
  }
  
  viewFinding(findingId) {
    const modalRef = this.modelService.open(ViewFindingComponent,{ size: 'lg' });
    modalRef.componentInstance.findingId = findingId;
  }

  getAssigneeList() {
    this.userService.getAssigneeList().subscribe(
      data => {
        this.assigneeData.crew = data.crew;
        this.assigneeData.contractor = data.contractor;
        this.assigneeData.inspector = data.inspector;
        this.getFindingsData();
      }
    )
  }
  
  setBidType(e,i) {
    this.findings[i]['finding_bid_primary_or_secondary'] = e.target.value;
    this.getFindingsTotals();

  }

  

  setOrderedBy(e,client_case) {
    let client_type = e.target.value;
    if (client_case == 'ordered') {
      this.job['job_billing_first_name'] = '';
			this.job['job_billing_last_name'] = '';
			this.job['job_billing_email'] = '';
			this.job['job_billing_phone'] = '';
      if(client_type == 'owner'){
        if(this.job['property_owner_id']) {
          this.job['job_billing_first_name'] = this.job['property_owner']['client_first_name'];
          this.job['job_billing_last_name'] = this.job['property_owner']['client_last_name'];
          this.job['job_billing_email'] = this.job['property_owner']['client_email'];
          this.job['job_billing_phone'] = this.job['property_owner']['client_phone'];
        }  
      } else if(client_type == 'agent_buyer') {
        if(this.job['buyer_agent_id']) {
          this.job['job_billing_first_name'] = this.job['buyer_agent']['client_first_name'];
          this.job['job_billing_last_name'] = this.job['buyer_agent']['client_last_name'];
          this.job['job_billing_email'] = this.job['buyer_agent']['client_email'];
          this.job['job_billing_phone'] = this.job['buyer_agent']['client_phone'];
        }  
      } else if(client_type == 'agent_seller') {
        if(this.job['seller_agent_id']) {
          this.job['job_billing_first_name'] = this.job['seller_agent']['client_first_name'];
          this.job['job_billing_last_name'] = this.job['seller_agent']['client_last_name'];
          this.job['job_billing_email'] = this.job['seller_agent']['client_email'];
          this.job['job_billing_phone'] = this.job['seller_agent']['client_phone'];
        }  
      } else if(client_type == 'buyer') {
        if(this.job['buyer_id']) {
          this.job['job_billing_first_name'] = this.job['buyer']['client_first_name'];
          this.job['job_billing_last_name'] = this.job['buyer']['client_last_name'];
          this.job['job_billing_email'] = this.job['buyer']['client_email'];
          this.job['job_billing_phone'] = this.job['buyer']['client_phone'];
        }  
      }
    } 
    else {
      this.job['job_billing_comp_first_name'] = '';
			this.job['job_billing_comp_last_name'] = '';
			this.job['job_billing_comp_email'] = '';
      this.job['job_billing_comp_phone'] = '';
      if(client_type == 'owner'){
        if(this.job['property_owner_id']) {
          this.job['job_billing_comp_first_name'] = this.job['property_owner']['client_first_name'];
          this.job['job_billing_comp_last_name'] = this.job['property_owner']['client_last_name'];
          this.job['job_billing_comp_email'] = this.job['property_owner']['client_email'];
          this.job['job_billing_comp_phone'] = this.job['property_owner']['client_phone'];
        }  
      } else if(client_type == 'agent_buyer') {
        if(this.job['buyer_agent_id']) {
          this.job['job_billing_comp_first_name'] = this.job['buyer_agent']['client_first_name'];
          this.job['job_billing_comp_last_name'] = this.job['buyer_agent']['client_last_name'];
          this.job['job_billing_comp_email'] = this.job['buyer_agent']['client_email'];
          this.job['job_billing_comp_phone'] = this.job['buyer_agent']['client_phone'];
        }  
      } else if(client_type == 'agent_seller') {
        if(this.job['seller_agent_id']) {
          this.job['job_billing_comp_first_name'] = this.job['seller_agent']['client_first_name'];
          this.job['job_billing_comp_last_name'] = this.job['seller_agent']['client_last_name'];
          this.job['job_billing_comp_email'] = this.job['seller_agent']['client_email'];
          this.job['job_billing_comp_phone'] = this.job['seller_agent']['client_phone'];
        }  
      } else if(client_type == 'buyer') {
        if(this.job['buyer_id']) {
          this.job['job_billing_comp_first_name'] = this.job['buyer']['client_first_name'];
          this.job['job_billing_comp_last_name'] = this.job['buyer']['client_last_name'];
          this.job['job_billing_comp_email'] = this.job['buyer']['client_email'];
          this.job['job_billing_comp_phone'] = this.job['buyer']['client_phone'];
        }  
      }	
    
    }
  }
  

  setPerformer(e,value,actionType) {
    let paramData = this.findings;
    let perform_case = 0;
    if(actionType=='perform') {
      if(e.target.checked) {
          perform_case = 1;
          if(value=="all") {
            paramData = this.findings;
            this.findings.forEach(x => x['finding_perform'] = e.target.checked)
            this.findings.forEach(x => x['finding_perform'] = 1)
          } 
      } else {
        perform_case = 0;
        if(value=="all") {
          this.findings.forEach(x => x['finding_perform'] = e.target.unchecked)
          this.findings.forEach(x => x['finding_perform'] = 0)
          this.findings.forEach(x => x['finding_perform_crew_id'] = 0)
        } else {
          this.findings[value]['finding_perform_crew_id'] = 0;
        }
      }
    } else if(actionType=='crew') {
      perform_case = 1;
    } else if(actionType=='crew-all') {
      this.findings.forEach(x => {
        if(x['finding_perform']==1){
          x['finding_perform_crew_id'] = this.fill_all_value
        } else {
          x['finding_perform_crew_id'] = 0
        }
        
      })
      this.fill_all_value = "0";
      

    }
    this.findingService.setPerformFindings(perform_case,paramData).subscribe(
      data => {
        console.log(data);
        this.setUserTypeFindings();
        this.getFindingsTotals();
      }
    )
  }

  addDiscount(e,finding_id,finding_index) {
    const modalRef = this.modelService.open(FindingDiscountComponent, {
      
    });
    modalRef.componentInstance.finding_id = finding_id;
    modalRef.componentInstance.finding_discount = e.target.value;
    modalRef.componentInstance.finding_discount_party = this.findings[finding_index]['finding_additional_discount_party'];
    modalRef.result.then((result) => {
      if(result.case){
        this.findings[finding_index]['finding_additional_discount']= result.discountData.finding_additional_discount;
        this.findings[finding_index]['finding_additional_discount_party']= result.discountData.finding_additional_discount_party;
        
      }   
    }).catch((error) => {

    });
  }

  getFindingsTotals() {
    this.section1_total = 0.00
    this.section2_total = 0.00
    this.section3_total = 0.00 
    this.findings.forEach(x => {
      // console.log(x['finding_perform'])
      if(x['finding_bid_primary_or_secondary']=='primary') {
        if(x['finding_bid_primary_type'] != 'no bid') {
          if(x['finding_perform']){
            if(x['finding_section']==1) {
              this.section1_total = this.section1_total + parseFloat(x['finding_bid_primary']);
            } else if(x['finding_section']==2) {
              this.section2_total = this.section2_total + parseFloat(x['finding_bid_primary']);
            } else if(x['finding_section']==3) {
              this.section3_total = this.section3_total + parseFloat(x['finding_bid_primary']);
            }
          }      
        } 
      } else {
        if(x['finding_bid_primary_type'] != 'no bid') {
          if(x['finding_perform']){
            if(x['finding_section']==1) {
              this.section1_total = this.section1_total + parseFloat(x['finding_bid_secondary']);
            } else if(x['finding_section']==2) {
              this.section2_total = this.section2_total + parseFloat(x['finding_bid_secondary']);
            } else if(x['finding_section']==3) {
              this.section3_total = this.section3_total + parseFloat(x['finding_bid_secondary']);
            }
          }
        }  
      }
      this.section1_total = parseFloat(this.section1_total.toFixed(2))
      this.section2_total = parseFloat(this.section2_total.toFixed(2))
      this.section3_total = parseFloat(this.section3_total.toFixed(2))   
    })  
  }

  makeFindingsContractPdf(type,position) {
    let gen_type = '';
    if(this.job['job_status']=='Inspection') {
      gen_type = 'new';
    } else {
      gen_type = '';
    }
    this.makeFindingsReportPdf(type,gen_type,position);
  }

  makeFindingsReportPdf(type, gen_type, position) {
    if(position=='top') {
      this.topPDFLoaderShow = true;
    } else {
      this.pageLoaderShow = true
    }
    var data = {
      'type' : type,
      'jid' : this.jobId,
      'gen_type' : gen_type
    }  
    this.findingService.generateReport(data).subscribe(
      
      data => {
        if(data.status==200) {
          Swal(
            'Success!',
            data.result.message,
            'success'
          )
          // this.getJobData();  
          // this.getFindingsData();
        } else if(data.status==400){
          Swal(
            'Error!',
            data.result.message,
            'warning'
          )
        }
        if(position=='top') {
          this.topPDFLoaderShow = false;
        } else {
          this.pageLoaderShow = false
        }
      } 
    
    );
  
  }

  
  getSingleClientData(clientId) {
    this.clientService.getClient(clientId).subscribe(
      data => {
        return data; 
      }
    )
  }

  saveJobinfoData() {
    this.validationCheck = false;
    this.submitLoaderShow = true
    let jobData = {
     'job_id' : this.jobId,
     'job_card_notes' : this.job['job_card_notes'],
     'job_billing_type' : this.job['job_billing_type'],
     'job_billing_first_name' : this.job['job_billing_first_name'],
     'job_billing_last_name' : this.job['job_billing_last_name'],
     'job_billing_email' : this.job['job_billing_email'],
     'job_billing_phone' : this.job['job_billing_phone'],
     'job_billing_type_comp' : this.job['job_billing_type_comp'],
     'job_billing_comp_first_name' : this.job['job_billing_comp_first_name'],
     'job_billing_comp_last_name' : this.job['job_billing_comp_last_name'],
     'job_billing_comp_email' : this.job['job_billing_comp_email'],
     'job_billing_comp_phone' : this.job['job_billing_comp_phone'],
     'job_perform_meet_who' : this.job['job_perform_meet_who'],
     'job_perform_escrow' : this.job['job_perform_escrow'],
     'job_perform_authorization_status' : this.job['job_perform_authorization_status'],
     'job_perform_utilities' : this.job['job_perform_utilities'],
     'job_billing_payment_type' : this.job['job_billing_payment_type'],
     'job_billing_bu_credit_card' : this.job['job_billing_bu_credit_card'],
     'job_billing_pu_check' : this.job['job_billing_pu_check']
    } 
    let jobDate = {
      'job_perform_date' : this.job_perform_date,
      'job_perform_time' : this.job_perform_time,
    }
    this.jobService.postJobinfo({ jobData: jobData, jobDate: jobDate, jobFindings: this.findings }).subscribe(
      data => {
         console.log(data);
         if(data.status==200) {
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
        this.submitLoaderShow = false
      }
    );    

  }

  
  scheduleClick() {
    this.validationCheck = true;
  }
  

  onScheduleSubmit() {
   this.validationCheck = false;
   this.saveJobinfoData();
  }


  setUserTypeFindings() {
    this.contractorFids = [];
    this.treaterFids = []
    this.crewFids = []
    this.findings.forEach(x => {
      if(x['finding_perform'] == 1) {
        this.assigneeData.contractor.forEach(cont => {
          if (x['finding_perform_crew_id']==cont.user_id) {
            if (cont.user_is_treater==1) {
              this.treaterFids.push(x['finding_id']);
            } else {
              this.contractorFids.push(x['finding_id']); 
            }
          }  
        })
        this.assigneeData.crew.forEach(crew => {
          if (x['finding_perform_crew_id']==crew.user_id) {
            if (crew.user_is_treater==1) {
              this.treaterFids.push(x['finding_id']);
            } else {
              this.crewFids.push(x['finding_id']); 
            }
          }  
        })
        this.assigneeData.inspector.forEach(insp => {
          if (x['finding_perform_crew_id']==insp.user_id || x['finding_perform_crew_id']==0) {
           this.treaterFids.push(x['finding_id']);
          } 
        })
      }
    }) 
  } 

  makeJobCardPDF(userType) {
    this.topPDFLoaderShow = true;
    let findingArray = [];
    console.log(this.job['report']['report_id']);
    if(userType=='crew') {
      findingArray = this.crewFids;
    } else if(userType=='treater') {
      findingArray = this.treaterFids;
    } else if(userType=='contractor') {
      findingArray = this.contractorFids;
    }  
    this.findingService.makeJobCardPDF({ reportId: this.job['report']['report_id'], findingArray: findingArray, userType: userType }).subscribe(
      data => {
        //  console.log(data);
         if(data.status==200) {
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
        this.topPDFLoaderShow = false;
      }
    );     
  }  

   
  creditCardData(e) {
    if(e.target.value=='yes') {
      this.creditCardFields = true; 
    } else {
      this.creditCardFields = false;
    }
    
  }

  getCardDetals(clientId){
    this.account.cardList(clientId)
    .subscribe(
      data=>{
        this.isCardDataLoad = true
        this.clientCards = data.data;
      }
    );
  }

  addNewCard(){
    const modalRef = this.modelService.open(CreditCardContentJobInfo,{size:'lg'});
    modalRef.componentInstance.client_id = this.job['client_id'];
    modalRef.result.then((result) => {
      this.getCardDetals(this.job['client_id']);
    }).catch((error) => {
        console.log(error);
    });
  }

  // capture selected date
  onDateSelect(event){
    if(this.lockoutSetting.date !== '') {
        if(event) {
            let d1_string = event.year+'-'+((event.month < 10) ? '0'+event.month : event.month)+'-'+((event.day < 10) ? '0'+event.day : event.day);
            let d1 = new Date(d1_string); 
            let d2 = new Date(this.lockoutSetting.date);
            if(d1 < d2) {
                this.lockoutPopup();
            }
        }
    }
  }

  // open lockout pin verify modal
  lockoutPopup() {
    const modalRef = this.modelService.open(LockoutComponent);
    modalRef.componentInstance.lockoutSetting = this.lockoutSetting;
    modalRef.result.then((result) => {
      this.isLockoutVerified=result;
      if(!this.isLockoutVerified) {
        let d = new Date(this.lockoutSetting.date+' 23:59:59');
        this.job_perform_date = {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()};
        Swal({
          title: 'Warning',
          text: 'The date is not allowed',
          type: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  
  // get lockout settings
  lockoutSettings(){
    this.commonService.getLockoutSettings().subscribe(
        data => { 
          if(data) {
            this.isLockoutVerified = false;
            this.lockoutSetting = data;
          }
          else {
            this.isLockoutVerified = true;
          }
        }
    );
  }

}
