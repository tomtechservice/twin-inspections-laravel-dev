import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { CompletionService } from '../../services/completion/completion.service';

@Component({
  selector: 'app-chemicals',
  templateUrl: './chemicals.component.html',
  styleUrls: ['./chemicals.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ChemicalsComponent implements OnInit {
  @Input() job_id;
  @Input() status;
  
  states: string[];
  year = [];

  search = false;
  chemicals: string[];

  chemicalsForm : FormGroup;
  submitted : boolean = false;
  chemicalMeasure: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private completionService: CompletionService,
    private formBuilder: FormBuilder,
    private router: Router,
    ) { }

  ngOnInit() {
    this.getYear();
    this.getChemical();
    this.chemicalsForm = this.formBuilder.group({
      chemical_id: ['', Validators.required],
      job_meta_chemical_amount: ['', Validators.required],
      job_meta_chemical_cost: [''],
      job_meta_chemical_date: ['', Validators.required],
      job_meta_chemical_unit: ['']
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.chemicalsForm.controls; }

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

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.chemicalsForm.invalid && !this.chemicalMeasure) {
      return;
    }
    this.chemicalsForm.value['job_id'] = this.job_id;
    this.chemicalsForm.value['job_meta_type'] = 'chem_plus';
    this.chemicalsForm.value['job_meta_chemical_unit'] = this.chemicalMeasure;
    console.log(this.chemicalsForm.value);
    this.completionService.addAdditionalChemicals(this.chemicalsForm.value)
    .pipe(first())
    .subscribe(
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

  onChange(chemical_id) {
    this.completionService.getChemicalUnit(chemical_id).subscribe(
      data => {
        if(data){
        this.chemicalMeasure = data.chemical_measure;
        }
      }
    )
  }

  getChemical() {
    this.completionService.getChemicals().subscribe(
      data => {
        if(data){
          this.chemicals = data;
        }
      }
    )
  }


}
