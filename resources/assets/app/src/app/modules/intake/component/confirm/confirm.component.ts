import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Job } from '../../job';
import { JobService } from '../../services/job/job.service';
import { ReportService } from '../../services/report/report.service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})


export class ConfirmComponent implements OnInit {
  page_title="Inspection: Job Review and Confirmation"
  private doSpace = environment.doSpace;
  mark_job : boolean;
  jobId : number;
  job = new Job( null, null, null, null, null, null, null);
  jobData : any;
  loading = false;
  job_completed = false;
  report : any;
  reportData : any;
  file : any;
  downloadUrl : any;
  blob : any;
  openAndDownload : boolean;
  generateLoader = true;

  constructor(
      private jobService : JobService,
      private router : ActivatedRoute,
      private route : Router,
      private reportService : ReportService
  ){ 
    this.mark_job = false;
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      if(params.jobId){
        this.jobId = params.jobId;
        this.getJob(params.jobId);
        this.getJobReport(params.jobId);
        this.loading = true;
      }
    })
  }

  markJobAsCompleted(){
    this.mark_job = true;
    this.loading = true;
    this.jobData = { job_id : this.job.job_id , job_status : 1 };
    this.jobService.setJobAsCompleted(this.jobData).subscribe(
        data => {
          if(data){
            this.job_completed = true;
            this.loading = false;
            console.log(data);
            if(data.status == 400)
            {
            Swal(
              'Job Completed!',
              data.message,
              'success'
              )
            }else if(data.status == 401){
              Swal(
                'Error!',
                data.message,
                'error'
                )
            }
          }
        }
    );
  }

  getJob(jId){
    console.log(jId);
    this.jobService.getJob(jId).subscribe(
      data => {
        console.log(data)
        if(data){
        this.loading = false;
        this.job = new Job(
          data.job_id,
          data.job_is_completed,
          data.client_id,
          data.property_id,
          data.job_ref_suffix,
          data.job_work_completion_pdf_file,
          data.job_billing_statement_pdf_file 
          );
          this.downloadUrl = this.doSpace + "/media/reports/" + this.job.job_id + '/' + this.job.job_work_completion_pdf_file;
          console.log(this.downloadUrl);
        }
      }
    );
  }

  goToOveriew(jobID){
    this.route.navigate(['inspections-completed-sheet/'+jobID]);
  }

  getJobReport(jobID){
    this.reportService.getJobReport(jobID).subscribe(
      data => {
        if(data){
          console.log(data);
          this.report = data;
        }
      }
    )
  }

  generateNoc(reportId){
    this.generateLoader = false;
    this.reportData = {
      report_id : reportId,
      reportStatus : 'generate Noc'
      } 
    this.reportService.generateNoc(this.reportData).subscribe(
      data => {
        console.log(data)
        if(data.status == 400)
          {
            this.getJob(this.jobId);
          Swal(
            'Success !',
            data.message,
            'success'
            )
            // if(data.job_work_completion_pdf_file){
              this.openAndDownload = true;
              this.generateLoader = true;
            // }
          }else if(data.status == 401){
            Swal(
              'Error!',
              data.message,
              'error'
              )
          }
      }
    )
  }

  openNoc(){
    window.open(this.doSpace + "/media/reports/" + this.job.job_id + "/" + this.job.job_work_completion_pdf_file);
  }

  downloadNoc(){
    this.generateLoader = false;
    this.file = { 'path' : this.doSpace + "/media/reports/" + this.job.job_id + '/' + this.job.job_work_completion_pdf_file,
  'file': this.job.job_work_completion_pdf_file };
    this.jobService.downloadNoc(this.file).subscribe(
      (data) => { 
        this.blob = new Blob([data], {type: 'application/pdf'});
        var downloaddUrl = window.URL.createObjectURL(data);
        var link = document.createElement('a') ;
        link.href = downloaddUrl;
        link.download = this.job.job_work_completion_pdf_file;
        link.click();
        console.log(data)
        this.generateLoader = true;
      }
    );
  }

}
