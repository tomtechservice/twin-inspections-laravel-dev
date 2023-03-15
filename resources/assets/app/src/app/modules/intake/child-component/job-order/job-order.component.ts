import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {InspectionStatusComponent} from '../inspection-status/inspection-status.component';
import {ReportPaymentComponent} from '../report-payment/report-payment.component';
@Component({
  selector: 'app-job-order',
  templateUrl: './job-order.component.html',
  styleUrls: ['./job-order.component.scss']
})
export class JobOrderComponent implements OnInit {
  @Input() jobData: any;   
  userData;

  @Output () notify: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    // console.warn(this.jobData)
    this.userData = JSON.parse(localStorage.getItem('user'));
  }
  openFormModal(id) {
    const modalRef = this.modalService.open(InspectionStatusComponent,{size:'lg'});
    modalRef.componentInstance.jobData = this.jobData;
    modalRef.result.then((result) => {
     
      this.jobData = result
       console.log("job data",this.jobData)
      this.notify.emit(this.jobData);
      // this.getTransactions();
    }).catch((error) => {
        console.log(error);
    });
  }

  openReportModal(id){
    const modalRef = this.modalService.open(ReportPaymentComponent,{size:'lg'});
    modalRef.componentInstance.jobData = this.jobData;
    modalRef.result.then((result)=>{
      this.jobData = result
      console.log("job data",this.jobData)
      this.notify.emit(this.jobData);
    }).catch((error)=>{
      console.log(error);
    })
  }

}
