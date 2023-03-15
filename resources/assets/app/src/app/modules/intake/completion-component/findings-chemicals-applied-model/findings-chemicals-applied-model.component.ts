import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { CompletionService } from '../../services/completion/completion.service';

@Component({
  selector: 'app-findings-chemicals-applied-model',
  templateUrl: './findings-chemicals-applied-model.component.html',
  styleUrls: ['./findings-chemicals-applied-model.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class FindingsChemicalsAppliedModelComponent implements OnInit {
  @Input() job_id;
  @Input() id;
  @Input() status;

  states: string[];
  year = [];

  search = false;
  addChemicalsAppliedForm: FormGroup;
  submitted = false;

  chemicals : any;
  chemicalMeasure = '';
  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private completionService : CompletionService,
  ) { }

  ngOnInit() {
    this.getYear();
    this.addChemicalsAppliedForm = this.formBuilder.group({
      chemical_id : ['', Validators.required],
      job_meta_chemical_amount : ['', Validators.required],
      job_meta_chemical_unit : [''],
      job_meta_chemical_cost : [''],
      job_meta_chemical_date : ['', Validators.required]
    });
    this.getChemical();
  }

  get f() { return this.addChemicalsAppliedForm.controls; }

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

  onChange(chemical_id) {
    this.completionService.getChemicalUnit(chemical_id).subscribe(
      data => {
        if(data){
          console.log(data)
        this.chemicalMeasure = data.chemical_measure;
        }
      }
    )
  }

  onSubmit(){
    this.submitted = true;
    console.log(this.addChemicalsAppliedForm.value);
    if(this.addChemicalsAppliedForm.invalid){
      return;
    }
    this.addChemicalsAppliedForm.value.job_id = this.job_id;
    this.addChemicalsAppliedForm.value.finding_id = this.id;
    this.addChemicalsAppliedForm.value.job_meta_type = 'chemicals';
    this.addChemicalsAppliedForm.value.job_meta_chemical_unit = this.chemicalMeasure;
    console.log(this.addChemicalsAppliedForm.value);

    this.completionService.doChemicalsApplied(this.addChemicalsAppliedForm.value).subscribe(
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

  getChemical(){
    this.completionService.getChemicals().subscribe(
      data => {
        if(data){
          this.chemicals = data;
        }
      }
    )
  }
  // getJobReport(){
  //   this.reportService.getJobReport(this.job_id).subscribe(
  //     data => {
  //       if(data){
  //         console.log(data);
  //       }
  //     }
  //   )
  // }


}
