import { Component, OnInit,Input } from '@angular/core';
// import { FormBuilder,Validators } from '@angular/forms';
import { JobService } from '../../services/job/job.service';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-report-payment',
  templateUrl: './report-payment.component.html',
  styleUrls: ['./report-payment.component.scss']
})
export class ReportPaymentComponent implements OnInit {
  @Input() jobData
  title="Change Report Payment Status";
  report_payment_status= "";
  constructor(
    public jobService:JobService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.report_payment_status = this.jobData.report_payment_status==1 ? "recieved" : "not-recieved"
  }
  statusSubmit(){
    // console.log(this.status)
    console.log(this.report_payment_status);
    this.jobService.changeJobReportPayment({report_payment_status : this.report_payment_status} ,this.jobData.job_id).subscribe(
      data => {
        console.warn(data.data)
        this.activeModal.close(data.data);
      //  this.job = data as string[];
      //  console.log(data)
      }
    );
  }
 

}
