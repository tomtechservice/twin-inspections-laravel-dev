import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user/user.service';
import { CompletionService } from '../../services/completion/completion.service';
import { FindingService } from '../../services/finding/finding.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-crew-hours',
  templateUrl: './crew-hours.component.html',
  styleUrls: ['./crew-hours.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CrewHoursComponent implements OnInit {
  @Input() job_id;
  @Input() status;
  
  private apiSite = environment.apiSite;
  states: string[];
  year = [];

  search = false;
  crewwHoursForm: FormGroup;
  crews: any;
  findingData : any = {};
  submitted = false;
  get_finding_data = {};
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private completionService: CompletionService,
    private findingService: FindingService
    ) { }

  ngOnInit() {
    this.getYear();
    this.crewwHoursForm = this.formBuilder.group({
      crew_id: ['', Validators.required],
      job_crew_date_completed: ['', Validators.required],
      job_crew_hours: [''],
      job_meta_crew_bill_hourly: [''],
      assisting_id: [''],
    });
    this.getCrewListSpec();
  }

  get f() { return this.crewwHoursForm.controls; }

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
    this.userService.getCrewListSpec().subscribe(
      data => {
        if(data){
          this.crews = data;
        }
      }
    )
  }

  findCrewCommission(crew_id){
    this.get_finding_data['crew_id'] = crew_id;
    this.get_finding_data['job_id'] = this.job_id;
    this.findingService.getFindCrewCommission(this.get_finding_data).subscribe(
      data => {
        if(data){
          this.findingData = data;
        }
      }
    )
  }
  

  onSubmit(){
    this.submitted = true;
    console.log(this.crewwHoursForm.value);
    if(this.crewwHoursForm.invalid){
      return;
    }
    this.crewwHoursForm.value['finding_data'] = this.findingData;
    this.crewwHoursForm.value['job_id'] = this.job_id;
    this.crewwHoursForm.value['finding_id'] = 0; 

    console.log(this.crewwHoursForm.value);
    this.completionService.doJobCrew(this.crewwHoursForm.value).subscribe(
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
}
