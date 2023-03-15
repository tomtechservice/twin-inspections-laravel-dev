import { Component, OnInit, ViewChild } from '@angular/core';

import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-inspection-report-setting',
  templateUrl: './inspection-report-setting.component.html',
  styleUrls: ['./inspection-report-setting.component.scss']
})
export class InspectionReportSettingComponent implements OnInit {
  reportContent:any = {
    data:''
  };
  reportHeader:any = {
    data: ''
  }
  stateLaws: any = {
    data : ''
  };

  loader:boolean = false;
  settingId:number;
  sucMsg:boolean;
  sucMsgHead:boolean;
  loaderHead:boolean = false;
  stateLawSectionLoader = false;
  sucMsgStateLawSectionLoader : boolean;
  constructor(private settingService : SettingService) {
    
   }

  ngOnInit() {
    this.getReportContent();
  }

  @ViewChild('tinymce') tinymce;

  getReportContent(){
    this.settingService.getSettingData().subscribe(
      data => {
        console.log(data.work_contract_headerbox);
        this.settingId = data.setting_id;
        this.reportContent.data =  data.findings_report_text;
        this.reportHeader.data = data.findings_report_header;
        this.stateLaws.data =  data.state_laws_report_text;
      }
    );
  }

  onSubmit(){
    
    this.loader = true;
    this.settingService.setFindingsReportContent(this.settingId, this.reportContent).subscribe(
      data => {
        this.loader = false;
        this.sucMsg = true;
        data => console.log(data);
      }
    );
  }

  onSubmitFindingsHeader(){
    
    this.loaderHead = true;
    this.settingService.setFindingsReportHeader(this.settingId, this.reportHeader).subscribe(
      data => {
        this.loaderHead = false;
        this.sucMsgHead = true;
        data => console.log(data);
      }
    );
  }

  onSubmitStateLaws(){
    // console.log(this.settingId);
    this.stateLawSectionLoader = true;
    this.settingService.setStateLawSection(this.settingId, this.stateLaws).subscribe(
      data => {
        this.stateLawSectionLoader = false;
        this.sucMsgStateLawSectionLoader = true;
        data => console.log(data);
      }
    );
  }

}
