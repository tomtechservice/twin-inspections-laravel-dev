import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

import { SettingService } from '../services/setting.service';

@Component({
    selector: 'abe-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public old_site;
    public oldTwin;
    public userData;
    public doSpace;
    sidebarlogo = '';
    public settings = [];
    inspector = true;
    administrator = false;
    constructor(private settingService: SettingService) {

    }

    ngOnInit() {
        this.old_site = environment.apiSite;
        this.oldTwin = environment.oldSite;
        this.doSpace = environment.doSpace;
        this.userData = JSON.parse(localStorage.getItem('user'));
        console.log(this.userData);
        if (this.userData.user_level == 'inspector') {
            this.inspector = false;
        }
        if (this.userData.user_level == 'administrator') {
            this.administrator = true;
        }
        this.getSidebarLogo();
    }

    getSidebarLogo() {
        this.settingService.getSettingData().subscribe(
            data => {
                this.settings = data;
                this.sidebarlogo = this.doSpace + '/media/logo/0/' + data.settings_logo_sidebar_image;
            }
        );
    }

}
