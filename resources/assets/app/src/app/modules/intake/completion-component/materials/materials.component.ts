import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, tap, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { JobService } from '../../services/job/job.service';
import { TransactionService } from '../../services/transaction/transaction.service';
import { CompletionService } from '../../services/completion/completion.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class MaterialsComponent implements OnInit {
  @Input() job_id;
  @Input() status;
  is_job=false;
  is_error="";
  materialsForm: FormGroup;
  warehouseForm: FormGroup;
  submitted = false;
  submittedWarehouse = false;

  states: string[];
  year = [];

  search = false;

  headerTitle = "Fill in Materials";
  toggleTitle = "Warehouse I/O";

  searching = false;
  searchFailed = false;
  branches : any;
  showMinCharError = null;
  jobData : any = ['1','1'];
  today : any;
  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router,
    private jobService: JobService,
    private transactionService : TransactionService,
    private completionService : CompletionService
  ) { }

  ngOnInit() {
    this.getYear();
    // this.getCurrentDate();
    this.selectToday();
    this.materialsForm = this.formBuilder.group({
      job_meta_materials_cost: [''],
      job_meta_materials_date_used: ['', Validators.required],
      job_meta_materials_notes: [''],
    });
    console.log(this.today)
    this.warehouseForm = this.formBuilder.group({
      branch_id: ['', Validators.required],
      job_id: ['', Validators.required],
      inventory_transaction_type: ['In'],
      inventory_transaction_goods_type: ['Lumber'],
      inventory_transaction_goods_amount: [''],
      inventory_transaction_notes: [''],
      inventory_transaction_cost: [''],
      inventory_transaction_date_created: [this.today, Validators.required],
    });
    this.getBranch();
  }
  // convenience getter for easy access to form fields
  get f() { return this.materialsForm.controls; }
  get warehouseFormField() { return this.warehouseForm.controls; }

  getYear() {
    var d = new Date();
    var n = d.getFullYear();
    console.log(n);
    for (var i = 0; i < 50; i++) {
      this.year.push(n + i)
    }
  }

  // getCurrentDate(){
  //   let today = new Date();
  //   let dd : any = today.getDate();
  //   let mm : any = today.getMonth() + 1; //January is 0!
  //   let yyyy = today.getFullYear();

  //   if (dd < 10) {
  //     dd = '0' + dd;
  //   }

  //   if (mm < 10) {
  //     mm = '0' + mm;
  //   }

  //  return this.today = mm + '/' + dd + '/' + yyyy;

  // }

  selectToday() {
    this.today = this.calendar.getToday();
  }
  onDateSelect(event) {
    this.search = true;
    // this.setCalendarStatus();
    // this.searchSchedules();
  }

  toggle() {
    if (this.headerTitle == "Fill in Materials") {
      this.headerTitle = "Warehouse I/O";
      this.toggleTitle = "Fill in Materials";
    } else {
      this.headerTitle = "Fill in Materials";
      this.toggleTitle = "Warehouse I/O";
    }
  }


    //type ahead filter for finding code
    searchJobData = (text$: Observable<any>) =>
    text$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => this.searching = true),
          switchMap(term => {
            if(term.toString().length >= 3){
          return this.jobService.getJobDataBySearch(term).pipe(
              tap((data) => { 
                this.jobData = data;
                console.log(this.jobData.length)
                if(this.jobData.length != 0){
                  this.is_job=false;
                  this.jobData = data;
                }else{
                  this.jobData = 0;
                  this.is_job=true;
                }
                
                this.searchFailed = false} ),
              catchError(() => {
               this.searchFailed = true;
                return of([]);
              })) }else{
                return of([]);
              }
            }
          ),
          tap(() => this.searching = false)
    )

    formatter = (x: {job_ref_parent: any}) => x.job_ref_parent;

    setCodeDatas(data) {
      console.log(data) 
   }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.materialsForm.invalid) {
      return;
    }

    this.materialsForm.value.job_id = this.job_id;
    this.materialsForm.value.job_meta_type = 'materials';

    this.completionService.doMaterialsMeta(this.materialsForm.value).subscribe(
      data => {
        if(data){
          Swal(
            'Success!',
            data.message,
            'success'
          )
          this.activeModal.close({data});
        }
      }
    )

  }
  
  onSubmitWarehouseForm(){
    this.submittedWarehouse = true;
    console.log(this.warehouseForm.value); 
    console.log(this.warehouseForm.value.job_id) // 373 => value , 
    console.log(this.warehouseForm.value.job_id.job_id) // 373 -> undefined , 

    if( isNaN(this.warehouseForm.value.job_id) ){
      this.warehouseForm.value.job_id = this.warehouseForm.value.job_id.job_id;
    } 

    // stop here if form is invalid
    if ( this.warehouseForm.invalid ) {
      console.log('form-invalid');
      return;
    } 

    // console.log(this.warehouseForm.value.job_id.job_id);
    // this.warehouseForm.value.job_id = this.warehouseForm.value.job_id.job_id;
    console.log(this.warehouseForm.value);
    this.transactionService.doTransaction(this.warehouseForm.value).subscribe(
      data => {
        this.is_error="";
        if(data){
          Swal(
            data.status.toUpperCase(),
            data.message,
            data.status
          )
          this.activeModal.dismiss();
        }
      },error =>{
        this.jobData = 0;
        this.is_error=error;
      }
    );
  }

  getBranch(){
    this.jobService.getBranch(0).subscribe(
      data => {
        this.branches = data;
      }
    )
  }


}
