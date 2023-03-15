import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FindingService } from '../../../intake/services/finding/finding.service'
import { findingData } from '../../../popups/findings-default'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../../../../services/setting.service'
import { Observable, of } from 'rxjs';
import { Setting } from '../../../../common/setting'
import { LookupcodeComponent } from '../../../intake/component/lookupcode/lookupcode.component'
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';

@Component({
    selector: 'app-bid-secondary',
    templateUrl: './bid-secondary.component.html',
    styleUrls: ['./bid-secondary.component.scss']
})
export class BidSecondaryComponent implements OnInit {

    @Input() findingId;
    @Input() lockoutSetting;
    @Input() inspection_report_is_sent;
    finding = findingData.finding
    settingData = new Setting(0, 0, 0, 0)
    saveStatus = true;
    insertLabelStatus = false
    loderDivShow = true
    show_finding_alt_other_div = false
    finding_bid_secondary_alt_other_label = 'Other'
    finding_bid_secondary_total_display: string;
    code_chemical_or_not = 0;
    finding_code_special_pricing_notes = 'N/A';
    crewRateOptions = [
        {
            value: 100,
            label: 'Standard'
        }
    ]
    constructor(public activeModal: NgbActiveModal, private findingService: FindingService, private settingService: SettingService, private modelService: NgbModal) { }

    ngOnInit() {
        this.setCrewRateOptions();
        this.finding_bid_secondary_total_display = '0.00'
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

                this.finding.finding_code_data = this.finding.finding_code_data;
                this.finding_bid_secondary_total_display = this.finding.finding_bid_secondary;
                this.loderDivShow = false

                // this.show_finding_alt_other_div = true;
                if (this.finding.finding_bid_secondary_alt == 'OTHER') {
                    this.show_finding_alt_other_div = true;
                    // this.finding.finding_bid_secondary_alt_other = '';
                    this.finding_bid_secondary_alt_other_label = 'Other Text';
                } else if (this.finding.finding_bid_secondary_alt == 'SEE') {
                    this.show_finding_alt_other_div = true;
                    // this.finding.finding_bid_secondary_alt_other = 'SEE ';
                    this.finding_bid_secondary_alt_other_label = `Edit "${this.finding.finding_bid_secondary_alt_other}" Reference`;
                } else if (this.finding.finding_bid_secondary_alt == 'INCLUDED IN') {
                    this.show_finding_alt_other_div = true;
                    // this.finding.finding_bid_secondary_alt_other = 'INCLUDED IN ';
                    this.finding_bid_secondary_alt_other_label = `Edit "${this.finding.finding_bid_secondary_alt_other}" Reference`;
                } else {
                    this.show_finding_alt_other_div = false;
                    // this.finding.finding_bid_secondary_alt_other = '';
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

    calcChanges() {
        this.saveStatus = false;
    }

    calc_bid() {
        let vhours = this.finding.finding_bid_secondary_hours;
        let vhours_rate = this.settingData.setting_bid_rate_crew_hours;
        let vhours_perc_disc = this.finding.finding_bid_secondary_hours_perc;
        let vhours_subtot = 0;
        let vmaterials = this.finding.finding_bid_secondary_materials;
        let vmaterials_rate = this.settingData.setting_bid_rate_materials;
        let vmaterials_subtot = 0;
        let vsubcontractor = this.finding.finding_bid_secondary_subcontractor;
        let vsubcontractor_rate = this.settingData.setting_bid_rate_subcontractor;
        let vsubcontractor_subtot = 0;
        let voffice_rate = this.settingData.setting_bid_rate_office;
        let vbid_total = 0;

        // if (vhours_perc_disc != 0) {
        vhours_rate = (vhours_perc_disc / 100) * vhours_rate;
        // }
        vhours_subtot = vhours * vhours_rate;

        this.finding.finding_bid_hours_sub_total = vhours_subtot;
        let vmaterials_markup = (vmaterials_rate / 100) * vmaterials;

        vmaterials_subtot = parseFloat(vmaterials) + vmaterials_markup;
        this.finding.finding_bid_materials_subtotal = vmaterials_subtot;

        let vsubcontractor_markup = (vsubcontractor_rate / 100) * vsubcontractor;
        vsubcontractor_subtot = parseFloat(vsubcontractor) + vsubcontractor_markup;

        this.finding.finding_bid_subcontractor_subtotal = vsubcontractor_subtot;

        vbid_total = vhours_subtot + vmaterials_subtot;

        let voffice_markup = (voffice_rate / 100) * vbid_total;
        vbid_total = vbid_total + voffice_markup;

        let vbid_total_subcontractor = vbid_total;



        this.finding_bid_secondary_total_display = vbid_total.toFixed(2);
        this.finding.finding_bid_secondary = vbid_total;
        this.saveStatus = true;

    }

    secondaryBidSubmit() {
        let openpopup = this.openFindingLockoutPopup();
        openpopup.then((value) => {
            if (value) {
                this.loderDivShow = true
                this.findingService.bidSecondarySave(this.finding).subscribe(
                    data => {
                        this.loderDivShow = false
                        this.activeModal.close({ case: 'secondary_bid_added' })
                    }
                )
            }
            else {
                this.activeModal.close();
            }
        });
    }

    lookupCode(event) {
        // console.log("lll");
        this.insertLabelStatus = false
        if (event.keyCode == 45) {
            const modalRef = this.modelService.open(LookupcodeComponent);
            modalRef.componentInstance.caseValue = 'recommends'
            modalRef.result.then((result) => {
                if (this.finding.finding_bid_secondary_recommendation) {
                    this.finding.finding_bid_secondary_recommendation = this.finding.finding_bid_secondary_recommendation + '   ' + result;
                } else {
                    this.finding.finding_bid_secondary_recommendation = result;
                }

                // this.show_notes_position_selection = true
            }).catch((error) => {

            });
        }
    }
    showNoBidTextBox() {
        if (this.finding.finding_bid_secondary_alt == 'OTHER') {
            this.show_finding_alt_other_div = true;
            this.finding.finding_bid_secondary_alt_other = '';
            this.finding_bid_secondary_alt_other_label = 'Other Text';
        } else if (this.finding.finding_bid_secondary_alt == 'SEE') {
            this.show_finding_alt_other_div = true;
            this.finding.finding_bid_secondary_alt_other = 'SEE ';
            this.finding_bid_secondary_alt_other_label = 'Edit "SEE" Reference';
        } else if (this.finding.finding_bid_secondary_alt == 'INCLUDED IN') {
            this.show_finding_alt_other_div = true;
            this.finding.finding_bid_secondary_alt_other = 'INCLUDED IN ';
            this.finding_bid_secondary_alt_other_label = 'Edit "INCLUDED IN" Reference';
        } else {
            this.show_finding_alt_other_div = false;
            this.finding.finding_bid_secondary_alt_other = '';
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
