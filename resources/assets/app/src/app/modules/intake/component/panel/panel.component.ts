import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { JobService } from '../../services/job/job.service'
import { SettingService } from "../../../../services/setting.service";

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
    @Input() page_title;
    public old_site;
    public userData;
    public location = '';
    public jobId = '';
    public allJobsData;
    inspector = true;
    tab = false;
    showJobsDropdown = false;
    tabs_order = [];
    tab_links = {
        'client': 'inspections-order-parties',
        'property': 'inspections-edit-property',
        'scheduling': 'inspections-schedule',
    };
    tab_labels = {
        'client': 'Client',
        'property': 'Property',
        'scheduling': 'Scheduling',
    };
    parentChildJobId;
    currentURL = ''

    constructor(private _router: Router, private router: ActivatedRoute, private jobService: JobService, private settingService: SettingService) {
        this.currentURL = _router.url
        let locationHash = _router.url.split("/");
        if (locationHash.length >= 2) {
            this.location = locationHash[1];
        }
        if (locationHash.length == 3) {
            this.jobId = locationHash[2];
            this.tab = false;
        }
    }

    ngOnInit() {
        this.old_site = environment.apiSite;
        this.userData = JSON.parse(localStorage.getItem('user'));
        if (this.userData.user_level == 'inspector') {
            this.inspector = false;
            this.tab = true;
        } else {
            this.inspector = true;

            if (localStorage.getItem("tab") != null && this.jobId != "") {
                this.tab = (JSON.parse(localStorage.getItem("tab")));
            }
            // this.tab=false;
        }
        this.settingService.getSettingData().subscribe(
            data => {
                let tabOrders = {};
                for (let tab of data.tabs_order) {
                    if (this.inspector) {
                        this.tabs_order.push(tab);
                        tabOrders[tab] = this.tab_links[tab];
                    }
                }
                localStorage.setItem("tab_orders", JSON.stringify(tabOrders));
            }
        );
        this.router.params.subscribe(params => {
            if (params.jobId) {
                this.parentChildJobId = this.jobId;
                this.getAllJobs();
                this.showJobsDropdown = true;
            } else {
                this.showJobsDropdown = false;
            }
        })

    }
    displayTab(data) {
        this.tab = data;
        localStorage.setItem('tab', JSON.stringify(this.tab));
    }

    getAllJobs() {
        this.jobService.getAllJobs(this.jobId).subscribe(
            data => {

                this.allJobsData = data.result.data;
            }
        )
    }

    goTotheParentJob() {
        // this._router.navigate([this.location+'/'+this.parentChildJobId]);
        window.location.href = this.location + '/' + this.parentChildJobId;
    }

}
