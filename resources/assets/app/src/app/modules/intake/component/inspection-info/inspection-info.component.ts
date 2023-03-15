import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {Router,ActivatedRoute } from '@angular/router';
import {ReportService} from '../../services/report/report.service';
import {Report} from '../../report';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {LookupcodeComponent} from '../../component/lookupcode/lookupcode.component';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment'
import { ReportManagerComponent } from '../../../popups/component/report-manager/report-manager.component'
@Component({
  selector: 'app-inspection-info',
  templateUrl: './inspection-info.component.html',
  styleUrls: ['./inspection-info.component.scss']
})
export class InspectionInfoComponent implements OnInit,OnDestroy {
  page_title="Inspection: Info";
  private apiSite = environment.apiSite;

  @Input() intakeTab;
  // @Input() ddddd;
  check_report= false;
  reportcopy:any;
  report = new Report(null,null,null,null,null,1,0,0,0,0,0,null);
	constructor(
    private reportService: ReportService,
    private  _router : Router,
    private  router : ActivatedRoute,
    private modalService: NgbModal
  ) { }

	ngOnInit() {
    this.router.params.subscribe(params => { 
      if(params.jobId){
        this.report.job_id = params.jobId;
        this.inspectionInfo(this.report.job_id);
      } 
    })
  }

  isNotSave = false;
  ngOnDestroy(){
    let client = JSON.stringify(this.report);
    let copy_report = JSON.stringify(this.reportcopy);

    if(this.check_report == false){
      if(client === copy_report){
      }else{
        if(this.report.report_description_general != null && this.report.report_tags != null && this.report.report_tags_other != null){
          this.isNotSave = true;
          this.reportSubmit();
        }
        // Swal({
        //   title: 'Warning',
        //   text: 'Content Changed, Do You Want To Save?',
        //   type: 'warning',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Yes'
        // })
        // .then((result) => {
        //     if (result.value) {
        //       if(this.report.report_description_general != null && this.report.report_tags != null && this.report.report_tags_other != null){
        //         this.reportSubmit();
        //       }
        //     }
        // })
           
      }
    }
  }
  lookupCode(event) {
      // console.log("id",id);
      if(event.keyCode==45 || event.type == 'click'){
        const modalRef = this.modalService.open(LookupcodeComponent);
        modalRef.componentInstance.caseValue = 'notes'
          modalRef.result.then((result) => {
            this.report.report_description_general=result;
          }).catch((error) => {
            console.log(error);
        });
      }
    
  }

	showTab(id){
       this.intakeTab.select(id);
    }
  report_option_subterranean_termites=false;
  inspectionInfo(job_id){
    this.reportService.getReportUsingJobId(job_id).subscribe(
        data => { 
          if(data){
            this.report = new Report(
              data.report_id,
              data.job_id,
              data.report_description_general,
              data.report_tags,
              data.report_tags_other,
              data.report_option_subterranean_termites,
              data.report_option_drywood_termites,
              data.report_option_fungus_dryrot,
              data.report_option_other_findings,
              data.report_option_further_inspection,
              data.report_corrected_report,
              data.report_notes
              );
              console.log(this.report.report_tags_other)
              // checked subterran Termites
              if(this.report.report_tags_other){
                this.report_option_subterranean_termites=true;
              }
              this.reportcopy =  Object.assign({}, this.report);
          }else{
            // this.existnew=true;
          }
        }
    );
  }
  reportSubmit(){
    this.check_report=true;
    if(this.report.report_description_general){
      this.report.report_description_general = this.report.report_description_general.toUpperCase();
    }
    if(this.report.report_tags){
      this.report.report_tags = this.report.report_tags.toUpperCase();
    }  
    if(this.report.report_tags_other){
      this.report.report_tags_other = this.report.report_tags_other.toUpperCase();
    }   
    this.reportService.postReport(this.report).subscribe(
      data=>{
        if(this.isNotSave == false){
            this._router.navigate(['inspections-profile-findings/', this.report.job_id]);
            // window.location.href = this.apiSite+'url/inspections_profile_findings/'+this.report.job_id;
        } else {
            this.isNotSave = true;
        }
        
      }
    );
  }

  reportManagerOpen() {
    const modalRef = this.modalService.open(ReportManagerComponent,{ size: 'lg' });
    modalRef.componentInstance.job_id = this.report.job_id;

    modalRef.result.then((result) => {
      
    }).catch((error) => {
      
    });
  }
  

}
