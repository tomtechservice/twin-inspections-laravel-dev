import { Component, OnInit, ViewChild } from '@angular/core';

import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-report-settings',
  templateUrl: './report-settings.component.html',
  styleUrls: ['./report-settings.component.scss']
})
export class ReportSettingsComponent implements OnInit {
  reportContent:any = {
    data:''
  };
  workContractReportHeader:any = {
    data: ''
  }
  loader = false;
  settingId:number;
  sucMsg:boolean;
  loaderHead = false;
  sucMsgHead:boolean;
  constructor(
    private settingService : SettingService
  ) { }

  ngOnInit() {
    this.getReportContent();
  }

  @ViewChild('tinymce') tinymce;
  ngAfterViewInit() {
    // console.log(this.tinymce);
  }

  getReportContent(){
    this.settingService.getSettingData().subscribe(
      data => {
        console.log(data.work_contract_headerbox);
        this.settingId = data.setting_id;
        this.reportContent.data =  data.work_contract_text;
        this.workContractReportHeader.data = data.work_contract_headerbox;
      }
    );
  }

  onSubmit(){
    
    this.loader = true;
    this.settingService.setReportContent(this.settingId, this.reportContent).subscribe(
      data => {
        this.loader = false;
        this.sucMsg = true;
        data => console.log(data);
      }
    );
  }

  onSubmitWorkReportHeader(){
    
    this.loaderHead = true;
    this.settingService.setWorkReportHeader(this.settingId, this.workContractReportHeader).subscribe(
      data => {
        this.loaderHead = false;
        this.sucMsgHead = true;
        data => console.log(data);
      }
    );
  }



}
