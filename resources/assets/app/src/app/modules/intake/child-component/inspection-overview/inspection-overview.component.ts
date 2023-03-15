import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ChangeInspectorComponent} from '../change-inspector/change-inspector.component';
import {InspectionTypeComponent} from '../inspection-type/inspection-type.component';
@Component({
  selector: 'app-inspection-overview',
  templateUrl: './inspection-overview.component.html',
  styleUrls: ['./inspection-overview.component.scss']
})
export class InspectionOverviewComponent implements OnInit {
  @Input() job: any; 
  private doSpace = environment.doSpace;
  constructor(
    config : NgbModalConfig,
    private modalService: NgbModal
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
  }
  openChangeInspectorModal() {
    const modalRef = this.modalService.open(ChangeInspectorComponent);
    modalRef.componentInstance.job = this.job;
    modalRef.result.then((result) => {
      this.job = result;
      // if(result.agent){
      //   this.job['agent']['user_first_name']= result.agent.user_first_name
      //   this.job['agent']['user_last_name']= result.agent.user_last_name
      // }else{

      // }
      
    //  this.job['job_escrow_number']= result.job_escrow_number
    //  this.job['job_escrow_closing_date']= result.job_escrow_closing_date
    }).catch((error) => {
        console.log(error);
    });
  }
  openInspectionTypeModal() {
    const modalRef = this.modalService.open(InspectionTypeComponent);
    modalRef.componentInstance.job = this.job;
    modalRef.result.then((result) => {
     this.job['job_sub_type']= result
    //  this.job['job_escrow_closing_date']= result.job_escrow_closing_date
    }).catch((error) => {
        console.log(error);
    });
  }

}
