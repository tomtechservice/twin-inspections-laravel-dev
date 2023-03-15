import { Component, OnInit } from '@angular/core';
import { SettingService } from './services/setting.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'abe-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'web-admin';
    favIcon: HTMLLinkElement = document.querySelector('#appIcon');

    constructor(private settingService: SettingService) {
    }

    ngOnInit() {
        this.settingService.getSettingData().subscribe(
            data => {
                this.favIcon.href = environment.doSpace + '/media/logo/0/' + data.settings_favicon_image;
            }
        );
    }
}
