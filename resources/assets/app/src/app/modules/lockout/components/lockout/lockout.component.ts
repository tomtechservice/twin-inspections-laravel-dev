import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../intake/services/common/common.service';

@Component({
    selector: 'app-lockout',
    templateUrl: './lockout.component.html',
    styleUrls: ['./lockout.component.scss']
})
export class LockoutComponent implements OnInit {
    modal_title = "Enter Your Pin";
    lockout_pin = '';
    is_verified = false;
    verified_error = 'Lockout pin is not verified, please verify';
    lockoutSetting: any;
    lockout_type = "";
    constructor(
        private commonService: CommonService,
        public activeModal: NgbActiveModal,
    ) { }

    ngOnInit() {

    }
    closeModal() {
        this.lockout_type = "";
        this.activeModal.close(this.is_verified);
    }
    verifyLockoutPin(event) {
        if (this.lockoutSetting) {
            if (this.lockout_type == "findings") {
                this.commonService.getFindingsLockoutPin(this.lockout_pin).subscribe(data => {
                    this.is_verified = data.success;
                    if (this.is_verified) {
                        this.lockout_type = "";
                        this.activeModal.close(this.is_verified);
                    }
                    else {
                        this.verified_error = data.message;
                    }
                });
            }
            else {
                this.commonService.getLockoutPin(this.lockout_pin).subscribe(data => {
                    this.is_verified = data.success;
                    if (this.is_verified) {
                        this.lockout_type = "";
                        this.activeModal.close(this.is_verified);
                    }
                    else {
                        this.verified_error = data.message;
                    }
                });
            }
        }
        else {
            this.is_verified = true;
        }
    }

}
