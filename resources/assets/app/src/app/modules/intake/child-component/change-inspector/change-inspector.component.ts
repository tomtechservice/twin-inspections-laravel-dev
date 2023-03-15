import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../services/job/job.service';
import { CommonService } from '../../../reports/services/common/common.service';
@Component({
  selector: 'app-change-inspector',
  templateUrl: './change-inspector.component.html',
  styleUrls: ['./change-inspector.component.scss']
})
export class ChangeInspectorComponent implements OnInit {
  title="Change Inspector"
  inspectors = [];
  @Input() job
  inspection={
    agent_id:0, 
  }
  is_loading:boolean;
  constructor(
    public activeModal: NgbActiveModal,
    public jobService:JobService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.inspection.agent_id = this.job.agent_id
    this.getInspectors()
  }
  getInspectors(){
    this.commonService.getInspectors().subscribe(
        data => {
          this.inspectors = data;
        }
    );
  }
  changeInspector(){
    this.is_loading=true;
    this.jobService.changeInspector(this.inspection ,this.job.job_id).subscribe(
      data => {
        this.is_loading = false;
        this.activeModal.close(data.data);
  
      }
    );
  }

}
