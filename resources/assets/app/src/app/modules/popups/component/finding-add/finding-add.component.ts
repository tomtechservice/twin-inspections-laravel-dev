import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FindingService } from '../../../intake/services/finding/finding.service'
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { findingData } from '../../../popups/findings-default'
import { LookupcodeComponent } from '../../../intake/component/lookupcode/lookupcode.component'
import { VariableEditorComponent } from '../variable-editor/variable-editor.component'
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';

@Component({
    selector: 'app-finding-add',
    templateUrl: './finding-add.component.html',
    styleUrls: ['./finding-add.component.scss']
})
export class FindingAddComponent implements OnInit {
    loderDivShow = false;
    finding: any;

    job = {
        job_ref_parent: 0,
        job_ref_suffix: ''
    }
    parentFinding = {}
    @Input() jobId;
    @Input() findingId;
    @Input() lockoutSetting;
    @Input() inspection_report_is_sent;

    fieldValidations = true;
    fieldDisabled = false;

    searching = false;
    searchFailed = false;
    show_parent_report_findings = false
    findings_add_cb_chems = false
    insertLabelStatus = false
    show_notes_position_selection = false
    heading_label = 'Findings: Add New'
    constructor(public activeModal: NgbActiveModal, private findingService: FindingService, private modelService: NgbModal) { }

    ngOnInit() {
        this.finding = Object.assign({}, findingData.finding);
        this.finding.job_id = this.jobId;
        if (this.findingId != 0) {
            this.heading_label = 'Findings: Edit'
            this.findingData();
        } else {
            this.autoFillFind();
        }
        this.jobData();

    }

    jobData() {
        this.findingService.jobData(this.jobId).subscribe(
            data => {
                this.job = data;
                this.findingService.parentFinding(this.job.job_ref_parent).subscribe(
                    data => {
                        this.parentFinding = data;
                    }
                )

            }
        )
    }

    findingData() {
        this.findingService.findingData(this.findingId).subscribe(
            data => {
                this.finding = data;
                if (this.finding.finding_uses_chemicals == 1) {
                    this.findings_add_cb_chems = true
                } else {
                    this.findings_add_cb_chems = false;
                }
                if (this.finding.finding_notes_only == 1) {
                    this.setNoteCase('notes_special')
                }

            }
        )
    }

    autoFillFind() {
        this.findingService.autoFillFindData(this.jobId).subscribe(
            data => {
                console.log(data.result.data);
                if (data.result.data != 0) {
                    var start = 'A'.charCodeAt(0);
                    var loopEnd = 'Z'.charCodeAt(0);
                    if (data.result.data.finding_finding.charCodeAt(0) >= start && data.result.data.finding_finding.charCodeAt(0) < loopEnd) {
                        this.finding.finding_section = data.result.data.finding_section;
                        this.finding.finding_type = data.result.data.finding_type;
                        let findingNum = data.result.data.finding_finding.charCodeAt(0);
                        findingNum++;
                        this.finding.finding_finding = String.fromCharCode(findingNum);
                    }
                }
            }
        );
    }

    findingSubmit() {
        let openpopup = this.openFindingLockoutPopup();
        openpopup.then((value) => {
            if (value) {
                this.loderDivShow = true;
                if (this.finding.finding_notes_only == 1) {
                    this.finding.finding_section = 0;
                    this.finding.finding_type = 0;
                    this.finding.finding_finding = '';
                }
                this.findingService.addFindings(this.finding).subscribe(
                    data => {
                        this.loderDivShow = false;
                        if (this.findingId == 0) {
                            this.activeModal.close({ case: 'add_finding', notes_only: this.finding.finding_notes_only, findingId: data })
                        } else {
                            this.activeModal.close({ case: 'edit_finding', findingId: data })
                        }
                    }
                )
            }
            else {
                this.activeModal.close();
            }
        });
    }

    //type ahead filter for finding code
    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>
                this.findingService.getFindingCodes(term).pipe(
                    tap(() => { this.searchFailed = false }),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        )
    formatter = (x: { code_name: string }) => x.code_name;

    setCodeDatas(data) {

        this.finding.finding_description = ''
        this.finding.finding_recommendation = ''
        this.finding.finding_notes = ''


        var n1 = data.item.code_finding.search("@");
        var n2 = data.item.code_recommendation.search("@");
        var n3 = data.item.code_notes.search("@");



        if (data.item.code_uses_chemicals == 1) {
            this.findings_add_cb_chems = true
            this.finding.finding_uses_chemicals = 1;
        } else {
            this.finding.finding_uses_chemicals = 0;
            this.findings_add_cb_chems = false;
        }


        if (n1 != -1 || n2 != -1 || n3 != -1) {
            const modalRef = this.modelService.open(VariableEditorComponent, { size: 'lg' });
            modalRef.componentInstance.code_item_data = data.item;
            modalRef.result.then((result) => {
                this.finding.finding_description = result.result.finding_description
                this.finding.finding_recommendation = result.result.finding_recommendation
                this.finding.finding_notes = result.result.finding_notes

                if (result.result.finding_description == '' && result.result.finding_recommendation == '' && result.result.finding_notes != '') {
                    this.setNoteCase('notes_special')
                } else {
                    this.setNoteCase('common_finding');
                }


            }).catch((error) => {

            });
        } else {
            this.finding.finding_description = data.item.code_finding
            this.finding.finding_recommendation = data.item.code_recommendation
            this.finding.finding_notes = data.item.code_notes

            if (data.item.code_finding == '' && data.item.code_recommendation == '' && data.item.code_notes != '') {
                this.setNoteCase('notes_special')
            }
            else {
                this.setNoteCase('common_finding');
            }
        }


    }

    lookupCode(event) {
        this.insertLabelStatus = false
        if (event.keyCode == 45) {
            const modalRef = this.modelService.open(LookupcodeComponent);
            modalRef.componentInstance.caseValue = 'notes'
            modalRef.result.then((result) => {
                if (this.finding.finding_notes) {
                    this.finding.finding_notes = this.finding.finding_notes + '   ' + result;
                } else {
                    this.finding.finding_notes = result;
                }

                if (this.finding.finding_description) {
                    this.setNoteCase('common_finding');
                } else {
                    this.setNoteCase('notes_special')
                }
            }).catch((error) => {

            });
        }
    }


    setNoteCase(finding_case) {
        if (finding_case == 'common_finding') {
            this.fieldValidations = true;
            this.fieldDisabled = false;
            this.show_notes_position_selection = false;
            this.finding.finding_notes_only = 0;
        } else if (finding_case == 'notes_special') {
            this.show_notes_position_selection = true;
            this.fieldValidations = false;
            this.fieldDisabled = true;
            this.finding.finding_notes_only = 1;
        }
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
