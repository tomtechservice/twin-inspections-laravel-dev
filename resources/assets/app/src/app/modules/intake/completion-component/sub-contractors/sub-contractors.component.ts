import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user/user.service';
import { CompletionService } from '../../services/completion/completion.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-sub-contractors',
  templateUrl: './sub-contractors.component.html',
  styleUrls: ['./sub-contractors.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SubContractorsComponent implements OnInit {
  @Input() job_id;
  @Input() status;

  subContractorForm: FormGroup;
  submitted = false;

  states: string[];
  year = [];

  search = false;
  
  subContractors:any;

  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private completionService: CompletionService
    ) { }

  ngOnInit() {
    this.getYear();
    this.subContractorForm = this.formBuilder.group({
      job_meta_contractor_id: ['', Validators.required],
      job_meta_contractor_cost: [''],
      job_meta_contractor_date: ['', Validators.required],
      job_meta_contractor_notes: ['']
    });
    this.getContractorsList();
  }

  // convenience getter for easy access to form fields
  get f() { return this.subContractorForm.controls; }

  getYear() {
    var d = new Date();
    var n = d.getFullYear();
    console.log(n);
    for (var i = 0; i < 50; i++) {
      this.year.push(n + i)
    }
  }

  getContractorsList(){
    this.userService.getContractorsList().subscribe(
      data => {
        if(data){
          this.subContractors = data;
        }
      }
    )
  }

  onDateSelect(event) {
    this.search = true;
    // this.setCalendarStatus();
    // this.searchSchedules();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.subContractorForm.invalid) {
      return;
    }
    this.subContractorForm.value['job_id'] = this.job_id;
    this.subContractorForm.value['job_meta_type'] = 'contractor';
    // console.log(this.subContractorForm.value);
    this.completionService.addContractors(this.subContractorForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            console.log(data)
            Swal(
              'Success!',
              data.message,
              'success'
            )
            this.activeModal.close({data});
          }
        },
        error => {
          console.log(error)
        }
      );

  }


}
