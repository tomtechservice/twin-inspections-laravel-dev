import { Component, OnInit,Input } from '@angular/core';
import { FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';
import { JobService } from '../../services/job/job.service';
import {Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-schedule-new-inspection',
  templateUrl: './schedule-new-inspection.component.html',
  styleUrls: ['./schedule-new-inspection.component.scss']
})
export class ScheduleNewInspectionComponent implements OnInit {
  @Input() job;
  // jobDetials=[];
  newInspection = this.fb.group({
    job_sub_type: [''],
    reinspection_options_client:true,
    reinspection_options_parties:true,
    reinspection_options_inspector:true,
    reinspection_options_info:true,
    reinspection_options_diagram:true,
    reinspection_note:['']
  });
  is_loading:boolean;
  constructor(
    private fb: FormBuilder,
    public jobService:JobService,
    private  _router : Router,
     ) { }

  ngOnInit() {
    // this.jobDetials = [...this.job];
  }
  onSubmit(){
    this.is_loading=true;
    // console.log("newInspection",this.newInspection.value)
    const jobDetials = {"new_inspection":this.newInspection.value,"job":this.job};
    this.jobService.newInspection(jobDetials).subscribe(
      data=>{
        this.is_loading=false;
        // console.log("ready",)
        if(this.newInspection.value.reinspection_options_client && this.newInspection.value.reinspection_options_parties &&  this.newInspection.value.reinspection_options_inspector){
          this._router.navigate(['inspections-schedule/', data.data]);
        }else{
          this._router.navigate(['inspections-completed-sheet/', data.data]);
        }
    })
  }
  import_option = false;
  inspectionType(){
    if(this.newInspection.value.job_sub_type !=''){
      this.import_option = true;
      // console.log(this.newInspection.value.job_sub_type)
    }else{
      this.import_option = false;
    }
  }

}
