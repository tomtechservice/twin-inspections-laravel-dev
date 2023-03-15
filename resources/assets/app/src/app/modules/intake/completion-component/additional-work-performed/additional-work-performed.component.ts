import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user/user.service';
import { CompletionService } from '../../services/completion/completion.service';
import { environment } from '../../../../../environments/environment';
import { id } from '@swimlane/ngx-datatable/release/utils';

@Component({
  selector: 'app-additional-work-performed',
  templateUrl: './additional-work-performed.component.html',
  styleUrls: ['./additional-work-performed.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AdditionalWorkPerformedComponent implements OnInit {
  @Input() job_id;
  @Input() status;
  @Input() id;
  
  states: string[];
  year = [];

  search = false;
  edit_additional_work: boolean = false;
  
  additionalWorkForm: FormGroup;
  submitted = false;
  editAdditionalWorkForm: FormGroup;
  submittedEditForm = false;

  crewListSpec : any;
  crewTreaterList : any;
  contractorList : any;
  findingAdditionalWork : any = {};
  findingAdditionalWorkDateCompleted : any = '';

  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private userService : UserService,
    private completionService : CompletionService
    ) {  }

  ngOnInit() {
    if(this.status == 'edit')
    {
      this.edit_additional_work = true;
      this.getAdditionalWork(this.id);
    }
    this.additionalWorkForm = this.formBuilder.group({
      crew_id: ['', Validators.required],
      finding_bid_additional_work: ['', Validators.required],
      finding_description_additional_work: ['', Validators.required],
      finding_notes_additional_work : [''],
      finding_completed_date_additional_work : ['', Validators.required]
    });
    this.editAdditionalWorkForm = this.formBuilder.group({
      finding_completed_date_additional_work_edit : ['']
    });
    this.getYear();
    this.getCrewListSpec();
    this.getCrewTreaterList();
    this.getContractorsList();
  }

  get f(){ return this.additionalWorkForm.controls; }

  getYear() {
    var d = new Date();
    var n = d.getFullYear();
    console.log(n);
    for (var i = 0; i < 50; i++) {
      this.year.push(n + i)
    }
  }
  onDateSelect(event) {
    this.search = true;
    // this.setCalendarStatus();
    // this.searchSchedules();
  }
  getCrewListSpec(){
    return this.userService.getCrewListSpec().subscribe(
      data => {
        if(data){
          this.crewListSpec = data;
        }
      }
    );
  }
  getCrewTreaterList(){
    this.userService.getCrewTreaterList().subscribe(
      data => {
        if(data){
          this.crewTreaterList = data;
        }
      }
    );
  }

  getContractorsList(){
    return this.userService.getContractorsList().subscribe(
      data => {
        if(data){
          this.contractorList = data;
        }
      }
    )
  }

  getAdditionalWork(id){
    this.completionService.getFindingAdditionalWork(id).subscribe(
      data => {
        if(data){
          this.findingAdditionalWork = data['0'];
          let date = this.findingAdditionalWork.finding_completed_date_additional_work;
          if(date != ''){
            let search = date.search(' ');
            let dateOnly = date.slice(0,search);
            let dateArr = dateOnly.split('-');
            this.findingAdditionalWorkDateCompleted = `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`;
          }
        }
      }
    )
  }

  onSubmit(){
    this.submitted = true;
    console.log(this.additionalWorkForm.value);
    if(this.additionalWorkForm.invalid){
      return;
    }
    this.additionalWorkForm.value.job_id = this.job_id;
    this.completionService.doAdditionalWork(this.additionalWorkForm.value).subscribe(
      data => {
        if(data){
          Swal(
            'Success!',
            data.message,
            data.status
          );
          
          this.activeModal.close({data})
        }
      }
    )
  }

  onEditFormSubmit(){
    if( this.editAdditionalWorkForm.value.finding_completed_date_additional_work_edit == '' ){
      let date = this.findingAdditionalWorkDateCompleted;
      let dateArr = date.split('/');

      this.editAdditionalWorkForm.value.finding_completed_date_additional_work_edit = 
      { year : dateArr[2], month: dateArr[0], day : dateArr[1] };
      // `${this.findingAdditionalWorkDateCompleted} 00:00:00`;
    }
    this.editAdditionalWorkForm.value.finding_additional_work_id = this.id;
    this.editAdditionalWorkForm.value.job_id = this.job_id;
    console.log(this.editAdditionalWorkForm.value);
    this.completionService.updateAdditionalWorkPerformed(this.editAdditionalWorkForm.value).subscribe(
      data => {
        if(data){
          console.log(data)
          Swal(
            'Success!',
            data.message,
            'success'
          )
          this.activeModal.close({data})
        }
      }
    )
  }

}
