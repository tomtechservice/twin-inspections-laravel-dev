import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService as ReportDocs} from '../../services/reports.service'
import { environment } from '../../../../../environments/environment'
import { FindingService } from '../../../intake/services/finding/finding.service'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { JobService } from '../../../intake/services/job/job.service'
@Component({
  selector: 'app-report-manager',
  templateUrl: './report-manager.component.html',
  styleUrls: ['./report-manager.component.scss']
})
export class ReportManagerComponent implements OnInit {
  @Input() job_id;
  public reportsData;
  public jobData;
  public old_site;
  pageLoaderShow = true
  reportGeneratorBtnDispaly = false
  private doSpace = environment.doSpace;
  constructor(private  _router : Router,public activeModal: NgbActiveModal,private reportDocs: ReportDocs,private findingService : FindingService,private jobService : JobService) { }

  ngOnInit() {
    this.old_site = environment.apiSite;
    this.getReportDatas();
  }


  getJobData() {
    this.jobService.getJob(this.job_id).subscribe(
      data => {
                this.jobData = data;
                if(data.report.report_diagram_file && this.jobData.findings.length > 0) {
                  this.reportGeneratorBtnDispaly = true
                }
                this.pageLoaderShow = false

              }
    );
  }

  getReportDatas() {
    this.reportDocs.getReportDatas(this.job_id).subscribe(
      data => {
        this.reportsData = data;
        this.getJobData();
      }
    )
  }

  downloadDoc(docName) {
    let params = {};
    params['jobId'] = this.job_id; 
    params['docName'] = docName; 
    params['docType'] = 'reprts_download'; 
    var file = this.reportDocs.downloadDoc(params);
    window.open(file, "_blank",'',false);
  }

  makeFindingsReportPdf(type,gen_type) {
    this.pageLoaderShow = true
    var data = {
      'type' : type,
      'jid' : this.job_id,
      'gen_type' : gen_type
    }  
    this.findingService.generateReport(data).subscribe(
      
      data => {
        this.pageLoaderShow = false
        if(data.status==200) {
          this.getReportDatas();
          Swal(
            'Success!',
            data.result.message,
            'success'
          )
        } else if(data.status==400){
          Swal(
            'Error!',
            data.result.message,
            'warning'
          )
        }
      } 
    
    );
  
  }

  


 
 
}
