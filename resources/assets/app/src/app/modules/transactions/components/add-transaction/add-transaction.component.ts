import { Component, OnInit, Input ,ViewChild} from '@angular/core';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter"
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap'; 
import {TransactionService} from '../../services/transaction.service';

import {CardDetailsComponent} from '../../../client/components/card-details/card-details.component';

import { CommonService } from '../../../intake/services/common/common.service';

import Swal from 'sweetalert2';
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';


@Component({
  selector: 'test-content',
  template: `
    <app-card-details [client_id]='client_id' (notify)='onNotify($event)'></app-card-details>
  `
})
export class TestContent {
  @Input() client_id;

  constructor(public activeModal: NgbActiveModal) {
    console.log(this.client_id)
  }

  onNotify(event){
    this.activeModal.close('Modal Closed');
  }
}

 
@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AddTransactionComponent implements OnInit {
  title = "Add Transaction";
  @Input() jobId;
  paymentRecievedField = false;
  error_message='';
  cardList=[];
  card_display=false;
  lockoutSetting:any;
  isLockoutVerified=false;
  
  adjustmentTransactionSubTypes = [
    {'name' : 'Inspection Discount - Prepay', 'value' : 'Inspection Discount - Prepay'},
    {'name' : 'Inspection Discount - Package', 'value' : 'Inspection Discount - Package'},
    {'name' : 'Inspection Discount - Inspector', 'value' : 'Inspection Discount - Inspector'},
    {'name' : 'Inspection Discount - Customer Satisfaction', 'value' : 'Inspection Discount - Customer Satisfaction'},
    {'name' : 'Completion Discount - Inspector', 'value' : 'Completion Discount - Inspector'},
    {'name' : 'Completion Discount - Crew Manager', 'value' : 'Completion Discount - Crew Manager'},
    {'name' : 'Completion Discount - Executive', 'value' : 'Completion Discount - Executive'},
    {'name' : 'Completion Discount - Customer Satisfaction', 'value' : 'Completion Discount - Customer Satisfaction'},
    {'name' : 'Completion - Inspector Miss', 'value' : 'Completion - Inspector Miss'},
    {'name' : 'Completion - Crew Miss', 'value' : 'Completion - Crew Miss'},
    {'name' : 'Adjustment - Accounting', 'value' : 'Adjustment - Accounting'}
  ]
  transactionSubTypes = [
    {'name' : 'Inspection', 'value' : 'Inspection'},
    {'name' : 'Completion', 'value' : 'Completion'},
    {'name' : 'Interest', 'value' : 'Interest'},
    {'name' : 'Completion - Inspector Miss', 'value' : 'Completion - Inspector Miss'},
    {'name' : 'Completion - Crew Miss', 'value' : 'Completion - Crew Miss'}
  ]
  subTypesOptions = this.transactionSubTypes 
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private transaction: TransactionService,
    private modalService: NgbModal,
    private commonService: CommonService
   
  ) { }
  transactionForm = this.fb.group({
    date: [''],
    description:['',Validators.compose([Validators.required])],
    transaction_type:['charge'],
    transaction_sub_type:['Inspection'],
    note:[''],
    transaction_payment:[''],
    transaction_charge:[''],
    selected_card:[''],
    charge_card : false
  });
  



  ngOnInit() {
    // this.transactionForm.value.date = this.gettheDay();
    this.transactionForm.patchValue({'date':this.gettheDay()})
    this.getJob();
    this.lockoutSettings();
    // let vv = this.gettheDay();
    // console.log(vv)
  }

  gettheDay() {
    var today = new Date();
    var dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    
    if(dd<10) {
      dd = parseInt('0'+dd);
    } 
    if(mm<10) {
      mm = parseInt('0'+mm);
    } 
    // today = mm + '/' + dd + '/' + yyyy;
    // return mm + '/' + dd + '/' + yyyy;
    return {year:yyyy,month:mm,day:dd}
  }
  subTypeOptions(){
    this.paymentRecievedField = false;
    if(this.transactionForm.value.transaction_type=='adjustment'){
      this.subTypesOptions = this.adjustmentTransactionSubTypes
      // this.transactionForm.value.transaction_sub_type = 'Inspection Discount - Prepay'
      this.transactionForm.patchValue({'transaction_sub_type':'Inspection Discount - Prepay'})
    } else {
      this.subTypesOptions = this.transactionSubTypes
      this.transactionForm.value.transaction_sub_type = 'Inspection';
      if(this.transactionForm.value.transaction_type=='payment'){
        this.paymentRecievedField = true;
      }  
    }
    this.transactionForm.patchValue({'charge_card':false,'selected_card':['']})
  }
  
  addTransaction(){
    console.log(this.transactionForm.value);
    this.transaction.addTransaction(this.transactionForm.value,this.jobId)
    .subscribe(
      data => {
        this.submitted = false;
        this.activeModal.close('Modal Closed');
      },error=>{ 
        this.error_message = error;  
      }
    );
  }
  submitted=false;
  loader;
  show_custom_error = false;
  onSubmit(){
    console.warn(this.transactionForm.value.selected_card);
    console.log(this.jobId);
    this.submitted = true;
    this.loader = true;
    if (this.transactionForm.invalid) {
      this.loader = false;
      return false;
    }
    // showing custom validation
    if(this.transactionForm.value.charge_card && this.transactionForm.value.transaction_type == 'payment'){
      if(this.transactionForm.value.selected_card==''){
        this.show_custom_error = true;
        return false;
      }
    }
    this.show_custom_error = false;
    // test
    if(this.transactionForm.value.charge_card && this.transactionForm.value.selected_card !=''){
      Swal({
        title: 'Warning',
        text: 'This will charge the selected credit card now',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      })
      .then((result) => {
          if (result.value) {
              this.addTransaction();
          }
      })
    }else{
      this.addTransaction();
    }
    
    // test close
  }
  clientId;
  getJob(){
    this.transaction.getJob(this.jobId)
    .subscribe(
      data => {
        this.clientId = data.client_id;
      }
    );
  }
  getAllCards(){
    this.transaction.cardList(this.clientId)
    .subscribe(
        data=>{
          this.card_display = true
          this.cardList = data.data;
        }
    );
  }
  addNewCard(){
    const modalRef = this.modalService.open(TestContent,{size:'lg'});
    console.log("client id",this.clientId)
    modalRef.componentInstance.client_id = this.clientId;
    modalRef.result.then((result) => {
      this.getAllCards();
    }).catch((error) => {
        console.log(error);
    });
  }

  closeModal() {
		this.activeModal.close('Modal Closed');
  }
  
  onDateSelect(data) {
    if(this.lockoutSetting.date !== '') {
      if(data) {
        let d1_string = data.year+'-'+((data.month < 10) ? '0'+data.month : data.month)+'-'+((data.day < 10) ? '0'+data.day : data.day);
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
    const modalRef = this.modalService.open(LockoutComponent);
    modalRef.componentInstance.lockoutSetting = this.lockoutSetting;
    modalRef.result.then((result) => {
      this.isLockoutVerified=result;
      if(!this.isLockoutVerified) {
        let d = new Date(this.lockoutSetting.date+' 23:59:59');
        this.transactionForm.patchValue({date: {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()}});
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
