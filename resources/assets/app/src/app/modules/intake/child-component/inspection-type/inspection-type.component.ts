import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../services/job/job.service';
@Component({
  selector: 'app-inspection-type',
  templateUrl: './inspection-type.component.html',
  styleUrls: ['./inspection-type.component.scss']
})
export class InspectionTypeComponent implements OnInit {
  title="Change Inspection Type"
  @Input() job
  inspection={
    job_sub_type:'',
  }
  is_loading:boolean;
  type=['Limited','Reinspection','Supplemental'];
  constructor(
    public activeModal: NgbActiveModal,
    public jobService:JobService,
  ) { }

  ngOnInit() {
    this.inspection.job_sub_type = this.job.job_sub_type
    if(this.inspection.job_sub_type =='Limited'){
       this.type.push('Original');
    }
  }
  changeInspectionType(){
    this.is_loading=true;
    this.jobService.changeInspectionType(this.inspection ,this.job.job_id).subscribe(
      data => {
        this.is_loading=false;
        this.activeModal.close(data.data.job_sub_type);
      }
    );
  }

}
