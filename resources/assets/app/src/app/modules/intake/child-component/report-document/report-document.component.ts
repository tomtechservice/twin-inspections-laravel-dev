import { Component, OnInit, Input } from '@angular/core';
import {environment} from '../../../../../environments/environment'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { JobService } from '../../services/job/job.service';

@Component({
  selector: 'app-report-document',
  templateUrl: './report-document.component.html',
  styleUrls: ['./report-document.component.scss']
})
export class ReportDocumentComponent implements OnInit {
  
  @Input() job
  doSpace = environment.doSpace;
  oldSite = environment.oldSite;
  apiSite = environment.apiSite;
  no_reports=0
  is_loading:boolean;
  constructor(
    private http: HttpClient,
    public jobService:JobService) { }

  ngOnInit() {
    this.checkReport()
    this.dataEncript()
  }
  checkReport(){
    // console.log(this.job.report.report_pdf_file,
    //   this.job.report.report_pdf_file_w_contract,
    //   this.job.job_card_crew_pdf_file,
    //   this.job.job_card_contractor_pdf_file,
    //   this.job.job_card_contractor_pdf_file,
    //   this.job.job_card_treater_pdf_file,
    //   this.job.job_work_completion_pdf_file

    //   )
    if (this.job.report && this.job.report.report_pdf_file != null) {
      this.no_reports = 1;
    }
    if (this.job.report && this.job.report.report_pdf_file_w_contract != null) {
      this.no_reports = 1;
    }  
    if (this.job.job_card_crew_pdf_file!= '') {
      this.no_reports = 1;
    }
    
    if (this.job.job_card_contractor_pdf_file != '') {
      this.no_reports = 1;
    }
    
    if (this.job.job_card_treater_pdf_file!= '') {
      this.no_reports = 1;
    }
    
    if (this.job.job_work_completion_pdf_file != '') {
      this.no_reports = 1;
    }
  }
  openPdfLocal(jobid,report){
    window.open(`${this.doSpace}/media/reports/${jobid}/${report} `);
    // FileSaver.saveAs("https://twininspection-development.nyc3.digitaloceanspaces.com/media/reports/34511/6108_Wild_Fox_Ct_ElkGroveddcxcxc-34511-1545292703-wdo.pdf", "application/pdf");
    // let url =`${this.doSpace}/media/reports/${jobid}/${report} `;
    // let headers = new HttpHeaders();
    // headers = headers.set('Accept', 'application/pdf');
    // console.log(url)
    // return this.http.get(url, { headers: headers, responseType: 'blob' });
  }
  blob;
  download(jobid,report){
   const doc={
    path:`${this.doSpace}/media/reports/${jobid}/${report} `,
    file: report
   } 
    this.jobService.downloadNoc(doc).subscribe(
      data => {
        this.encript = data.data;
        this.blob = new Blob([data], {type: 'application/pdf'});
        var downloaddUrl = window.URL.createObjectURL(data);
        var link = document.createElement('a') ;
        link.href = downloaddUrl;
        link.download = this.job.job_work_completion_pdf_file;
        link.click();
        console.log(data)
        // this.generateLoader = true;
      }
    );
  }
  report_type=''
  generatePdf(job_id,report){
    this.is_loading=true;
    this.report_type =report;
    this.jobService.generatePdf({job_id,report}).subscribe(
      data => {
        this.is_loading=false;
        this.job = data.data;
      }
    );
  }
  encript;
  dataEncript(){
    this.jobService.encript(this.job.job_id).subscribe(
      data => {
        this.encript = data.data;
      }
    );
  }

}
