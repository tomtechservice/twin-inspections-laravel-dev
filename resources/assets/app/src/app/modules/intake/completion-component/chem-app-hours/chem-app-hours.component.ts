import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user/user.service';
import { CompletionService } from '../../services/completion/completion.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-chem-app-hours',
  templateUrl: './chem-app-hours.component.html',
  styleUrls: ['./chem-app-hours.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ChemAppHoursComponent implements OnInit {
  @Input() job_id;
  @Input() status;

  private apiSite = environment.apiSite;
  states: string[];
  year = [];

  search = false;
  chemAppHoursForm: FormGroup;
  
  submitted = false;
  crews : any;
  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private completionService: CompletionService
    ) { }

  ngOnInit() {
    this.getYear();
    this.chemAppHoursForm = this.formBuilder.group({
      crew_id: ['', Validators.required],
      job_meta_chem_date_completed: ['', Validators.required],
      job_meta_chem_hours: ['', Validators.required],
    });
    this.getCrewTreaterList();
  }

  get f(){ return this.chemAppHoursForm.controls; }

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

  onSubmit(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.chemAppHoursForm.invalid) {
      return;
    }
    this.chemAppHoursForm.value.job_id = this.job_id;
    this.chemAppHoursForm.value.job_meta_type = 'chem';    
    // console.log(this.chemAppHoursForm.value);
    this.completionService.doChemHoursMeta(this.chemAppHoursForm.value).subscribe(
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
    );
  }

  getCrewTreaterList(){
    this.userService.getCrewTreaterList().subscribe(
      data => {
        if(data){
          this.crews = data;
        }
      }
    )
  }


}
