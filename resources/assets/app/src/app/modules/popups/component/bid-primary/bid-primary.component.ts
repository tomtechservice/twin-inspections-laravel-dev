import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FindingService } from '../../../intake/services/finding/finding.service'
import { SettingService } from '../../../../services/setting.service'
import { Observable, of } from 'rxjs';
import { findingData } from '../../../popups/findings-default'
import { Setting } from '../../../../common/setting'
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';

@Component({
    selector: 'app-bid-primary',
    templateUrl: './bid-primary.component.html',
    styleUrls: ['./bid-primary.component.scss']
})
export class BidPrimaryComponent implements OnInit {

    @Input() findingId;
    @Input() lockoutSetting;
    @Input() inspection_report_is_sent;
    finding = findingData.finding
    loderDivShow = true
    settingData = new Setting(0, 0, 0, 0)
    saveStatus = true;
    finding_bid_primary_total_display: string;
    finding_code_special_pricing_notes = 'N/A';
    show_finding_alt_other_div = false
    finding_bid_primary_alt_other_label = 'Other'
    code_chemical_or_not = 0;
    crewRateOptions = [
        {
            value: 100,
            label: 'Standard'
        }
    ]

    constructor(public activeModal: NgbActiveModal, private findingService: FindingService, private settingService: SettingService, private modelService: NgbModal) { }

    ngOnInit() {
        this.setCrewRateOptions();
        this.finding_bid_primary_total_display = '0.00'
        this.getSettingData();
        this.findingData();


    }

    findingData() {
        this.findingService.findingData(this.findingId).subscribe(
            data => {
                this.finding = data;
                if (this.finding.finding_code_data) {
                    this.finding_code_special_pricing_notes = this.finding.finding_code_data.code_special_pricing_notes != '' ? this.finding.finding_code_data.code_special_pricing_notes : 'N/A'
                    this.code_chemical_or_not = this.finding.finding_code_data.code_uses_chemicals
                }
                this.finding_bid_primary_total_display = this.finding.finding_bid_primary;
                this.loderDivShow = false

                if (this.finding.finding_bid_primary_alt == 'OTHER') {
                    this.show_finding_alt_other_div = true;
                    // this.finding.finding_bid_primary_alt_other = '';
                    this.finding_bid_primary_alt_other_label = 'Other Text';
                } else if (this.finding.finding_bid_primary_alt == 'SEE') {
                    this.show_finding_alt_other_div = true;
                    // this.finding.finding_bid_primary_alt_other = 'SEE ';
                    this.finding_bid_primary_alt_other_label = `Edit "${this.finding.finding_bid_primary_alt_other}" Reference`;
                } else if (this.finding.finding_bid_primary_alt == 'INCLUDED IN') {
                    this.show_finding_alt_other_div = true;
                    // this.finding.finding_bid_primary_alt_other = 'INCLUDED IN ';
                    this.finding_bid_primary_alt_other_label = `Edit "${this.finding.finding_bid_primary_alt_other}" Reference`;
                } else {
                    this.show_finding_alt_other_div = false;
                    // this.finding.finding_bid_primary_alt_other = '';
                }

            }
        )
    }

    getSettingData() {
        this.settingService.getSettingData().subscribe(
            data => {
                this.settingData = data;
            }
        )
    }

    calc_bid() {
        let test_perc = 15;
        let test_rate = 110;
        let test_tot = 0;
        test_tot = (test_perc / 100) * test_rate;


        let vhours = this.finding.finding_bid_hours;
        let vhours_rate = parseFloat(this.settingData.setting_bid_rate_crew_hours);
        let vhours_perc_disc = this.finding.finding_bid_hours_perc;
        let vhours_subtot = 0;
        let vmaterials = parseFloat(this.finding.finding_bid_materials);

        let vmaterials_rate = parseFloat(this.settingData.setting_bid_rate_materials);
        let vmaterials_subtot = 0;
        let vsubcontractor = 0;
        vsubcontractor = parseFloat(this.finding.finding_bid_subcontractor);


        let vsubcontractor_rate = parseFloat(this.settingData.setting_bid_rate_subcontractor);
        let vsubcontractor_subtot = 0;
        let voffice_rate = parseFloat(this.settingData.setting_bid_rate_office);
        let vbid_total = 0;


        // if (vhours_perc_disc != 0) {
        vhours_rate = (vhours_perc_disc / 100) * vhours_rate;
        // }



        vhours_subtot = vhours * vhours_rate;




        this.finding.finding_bid_hours_sub_total = vhours_subtot;
        let vmaterials_markup = (vmaterials_rate / 100) * vmaterials;
        vmaterials_subtot = vmaterials + vmaterials_markup;




        this.finding.finding_bid_materials_subtotal = vmaterials_subtot;

        let vsubcontractor_markup = (vsubcontractor_rate / 100) * vsubcontractor;
        vsubcontractor_subtot = vsubcontractor + vsubcontractor_markup;



        this.finding.finding_bid_subcontractor_subtotal = vsubcontractor_subtot;

        vbid_total = vhours_subtot + vmaterials_subtot + vsubcontractor_subtot;

        let vbid_total_subcontractor = vbid_total;

        let voffice_markup = (voffice_rate / 100) * vbid_total;
        vbid_total = vbid_total + voffice_markup;





        this.finding_bid_primary_total_display = vbid_total.toFixed(2);
        this.finding.finding_bid_primary = vbid_total.toFixed(2);
        this.saveStatus = true;

    }
    calcChanges() {
        this.saveStatus = false;
    }

    primaryBidSubmit() {
        let openpopup = this.openFindingLockoutPopup();
        openpopup.then((value) => {
            if (value) {
                this.loderDivShow = true
                this.findingService.bidPrimarySave(this.finding).subscribe(
                    data => {
                        this.loderDivShow = false
                        this.activeModal.close({ case: 'primary_bid_added' })
                    }
                )
            }
            else {
                this.activeModal.close();
            }
        });
    }

    showNoBidTextBox() {
        if (this.finding.finding_bid_primary_alt == 'OTHER') {
            this.show_finding_alt_other_div = true;
            this.finding.finding_bid_primary_alt_other = '';
            this.finding_bid_primary_alt_other_label = 'Other Text';
        } else if (this.finding.finding_bid_primary_alt == 'SEE') {
            this.show_finding_alt_other_div = true;
            this.finding.finding_bid_primary_alt_other = 'SEE ';
            this.finding_bid_primary_alt_other_label = 'Edit "SEE" Reference';
        } else if (this.finding.finding_bid_primary_alt == 'INCLUDED IN') {
            this.show_finding_alt_other_div = true;
            this.finding.finding_bid_primary_alt_other = 'INCLUDED IN ';
            this.finding_bid_primary_alt_other_label = 'Edit "INCLUDED IN" Reference';
        } else {
            this.show_finding_alt_other_div = false;
            this.finding.finding_bid_primary_alt_other = '';
        }
    }
    setCrewRateOptions() {
        let i_val = 0;
        let i_label_val = -100;
        let i_label = '';
        let options = []
        for (i_val = 0; i_val <= 200; i_val += 5) {
            if (i_val == 0) {
                i_label_val = -100;
                i_label = i_label_val + '%';
            } else if (i_val == 100) {
                i_label = 'Standard';
            } else if (i_val == 105) {
                i_label_val = i_label_val + 10;
                i_label = i_label_val + '%';
            } else {
                i_label_val = i_label_val + 5;
                i_label = i_label_val + '%';
            }
            let items = {
                value: i_val,
                label: i_label
            }
            options.push(items);

        }
        this.crewRateOptions = options;
    }

    // open popup modal for lockout pin
    openFindingLockoutPopup() {
        return new Promise((resolve) => {
            if (this.inspection_report_is_sent && this.lockoutSetting && this.lockoutSetting.finding_lockout_pin !== "") {
                const modalRef = this.modelService.open(LockoutComponent);
                modalRef.componentInstance.lockout_type = "findings";
                modalRef.componentInstance.lockoutSetting = this.lockoutSetting;
                modalRef.result.then((result) => {
                    resolve(result);
                }).catch((error) => {
                    resolve(false);
                });
            }
            else {
                resolve(true);
            }
        });
    }

}
