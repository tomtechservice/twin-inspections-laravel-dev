import { Component, OnInit,Input } from '@angular/core';
// import { FormBuilder,Validators } from '@angular/forms';
import { JobService } from '../../services/job/job.service';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-inspection-status',
  templateUrl: './inspection-status.component.html',
  styleUrls: ['./inspection-status.component.scss']
})
export class InspectionStatusComponent implements OnInit {
  @Input() jobData
  title="Change Job/Inspection Status";
  status={
    job_status_top:'',
    job_status_notes:''
  }
  constructor(
    public jobService:JobService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.status.job_status_top = this.jobData.job_status_top
    this.status.job_status_notes = this.jobData.job_status_notes
  }
  statusSubmit(){
    // console.log(this.status)
    this.jobService.changeJobStatus(this.status ,this.jobData.job_id).subscribe(
      data => {
        console.warn(data.data)
        this.activeModal.close(data.data);
      //  this.job = data as string[];
      //  console.log(data)
      }
    );
  }
 

}
