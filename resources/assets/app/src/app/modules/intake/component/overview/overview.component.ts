import { Component, OnInit, Input } from '@angular/core';
import {Router,ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job/job.service';
import {environment} from '../../../../../environments/environment'
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  page_title="Inspection: Review";
  public oldSite;
  jobId;
  userData;
	constructor(
    // private commonService: CommonService,
    private jobService: JobService,
    private _router: Router,
    private router: ActivatedRoute,
  ) {

      
  }

	ngOnInit() {
    this.oldSite = environment.apiSite;
    this.router.params.subscribe(params => { 
        if(params.jobId){
            this.jobId = params.jobId;
            console.log(this.jobId)
            this.getJob(this.jobId);
        }
    }) 
    this.userData = JSON.parse(localStorage.getItem('user'));
  }
  job=[];
  is_loading=true;
  is_error='';
  getJob(jobid){
    this.jobService.getjobDetails(jobid).subscribe(
      data => {
       this.is_loading=false;
       if(data.data){
        this.job = data.data as string[];
        this.checkPermission(data.data.job_status)
        this.accounting(jobid)
       }
       
      },
      error=>{
        this.is_loading=false;
        this.is_error = error;
        console.log(error)
      }
    );
  }
  balance:any
  accounting(jobid){
      this.jobService.accounting(jobid).subscribe(
        data => {
          this.balance = data
        }
      );   
  }

  // job/order notify
  onNotify(event):void{
    console.log("Ads",event.job_status)
    this.checkPermission(event.job_status)
  }
  permission = '';
  checkPermission(status){
    console.log('sd',status)
    if (status == 'Inspection' ||status == 'Work'|| status == 'Intake'||status == 'Completed' ) {
      // inspections_completed_sheet
      this.permission="allow";
    } else if (status == 'Cancelled') {
      this.permission="Cancelled";
        // inspections_cancelled_confirmation
    } else {
      this.permission="permission_denied";
        // permission_denied
    }
    console.log('permission',this.permission)
  }

}
