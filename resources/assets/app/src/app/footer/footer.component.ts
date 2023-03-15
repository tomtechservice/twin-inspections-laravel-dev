import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

import { SettingService } from '../services/setting.service';


@Component({
  selector: 'abe-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerText='';
  currYear:number;
  appDashboard:string = '';
  constructor(private settingService : SettingService) { }

  ngOnInit() {
    this.getFooterText();
    let d = new Date();
    this.currYear = d.getFullYear();
    this.appDashboard = environment.appDashboard;
  }
  getFooterText() {
    this.settingService.getSettingData().subscribe(
			data => {
			  this.footerText = this.currYear + " © " + data.setting_company_name +' - '+ data.setting_website_name +' - '+ this.appDashboard;
			}
		  );
  }
}
