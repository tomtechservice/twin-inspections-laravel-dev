import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FindingService } from '../../services/finding/finding.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportManagerComponent } from '../../../popups/component/report-manager/report-manager.component'
import { FindingAddComponent } from '../../../popups/component/finding-add/finding-add.component'
import { BidPrimaryComponent } from '../../../popups/component/bid-primary/bid-primary.component'
import { BidSecondaryComponent } from '../../../popups/component/bid-secondary/bid-secondary.component'
import { ViewFindingComponent } from '../../../popups/component/view-finding/view-finding.component'
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2';
import { FindingImageComponent } from '../../../popups/component/finding-image/finding-image.component'
import { CommonService as CService } from '../../../intake/services/common/common.service';
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';


@Component({
    selector: 'app-findings',
    templateUrl: './findings.component.html',
    styleUrls: ['./findings.component.scss']
})
export class FindingsComponent implements OnInit {
    page_title = "Inspection: Findings/Bids"
    public jobId = 0;
    findings = [];
    findingsNotesOnly = [];
    public primaryBidTotal = 0;
    public secondaryBidTotal = 0;



    loderDivShow = true;
    pageLoaderShow = false
    reportExist = null;
    reportGeneratorBtnDispaly = false

    reportLabel = false
    reportLabelText = '';
    reportLabelError = false;
    reportNumber = 0;
    reportErrorStatus = 0;

    isFindingLockoutVerified = false;
    findingLockoutSetting: any;
    jobDetail: any;


    @Input() intakeTab;
    constructor(private _router: Router, private route: ActivatedRoute, private findingService: FindingService, config: NgbModalConfig, private modelService: NgbModal, private cService: CService) {
        this.route.params.subscribe(params => { this.jobId = params['jobId']; });
        config.backdrop = 'static';
        config.keyboard = false;
    }
    public imagePath = this.findingService.imagePath;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key == '+') {
            this.addFindings();
        }
    }



    ngOnInit() {
        this.getFindings();
        this.getJobDetail();
        this.lockoutSettings();
    }




    nextPage() {
        this._router.navigate(['inspections-profile-diagram/', this.jobId]);
    }

    getFindings() {
        this.findingService.getFindings(this.jobId).subscribe(
            data => {
                this.loderDivShow = false;
                if (data.reportData) {
                    this.reportExist = 1;
                    if (data.reportData.report_diagram_file) {
                        this.reportGeneratorBtnDispaly = true
                    }
                } else {
                    this.reportExist = 0;
                }
                this.findings = data.findingList;
                this.findings.map((finding) => {
                    if (finding.finding_bid_primary_type != 'no bid') {
                        this.primaryBidTotal = this.primaryBidTotal + finding.finding_bid_primary;
                    }
                    this.secondaryBidTotal = this.secondaryBidTotal + finding.finding_bid_secondary;
                })

                let sumObj = this.findings.reduce((sum, finding) => {
                    if (finding.finding_bid_primary_type != 'no bid') {
                        sum.primary_bid_total += parseFloat(finding.finding_bid_primary)
                    }
                    sum.secondary_bid_total += parseFloat(finding.finding_bid_secondary)

                    return sum;
                }, {
                    primary_bid_total: 0,
                    secondary_bid_total: 0
                })
                this.primaryBidTotal = sumObj.primary_bid_total;
                this.secondaryBidTotal = sumObj.secondary_bid_total;

                this.findingsNotesOnly = data.findingNotesOnlyList;

            }
        );

    }

    reportManagerOpen() {
        const modalRef = this.modelService.open(ReportManagerComponent, { size: 'lg' });
        modalRef.componentInstance.job_id = this.jobId;

        modalRef.result.then((result) => {

        }).catch((error) => {

        });
    }

    addFindings() {
        const modalRef = this.modelService.open(FindingAddComponent, { size: 'lg' });
        modalRef.componentInstance.jobId = this.jobId;
        modalRef.componentInstance.findingId = 0;
        modalRef.componentInstance.lockoutSetting = this.findingLockoutSetting;
        modalRef.componentInstance.inspection_report_is_sent = this.jobDetail.inspection_report_is_sent;
        modalRef.result.then((result) => {
            if (result.case) {
                this.getFindings();
                if (result.notes_only == 0) {
                    const modalRef = this.modelService.open(BidPrimaryComponent, { size: 'lg' });
                    modalRef.componentInstance.findingId = result.findingId;
                    modalRef.componentInstance.lockoutSetting = this.findingLockoutSetting;
                    modalRef.componentInstance.inspection_report_is_sent = this.jobDetail.inspection_report_is_sent;
                    modalRef.result.then((result) => {
                        this.getFindings();
                        Swal(
                            'Added!',
                            'Finding Bid Successfully Added.',
                            'success'
                        )
                    }).catch((error) => {

                    });
                }
            }
        }).catch((error) => {

        });
    }

    openBidPrimary(findingId) {
        const modalRef = this.modelService.open(BidPrimaryComponent, { size: 'lg' });
        modalRef.componentInstance.findingId = findingId;
        modalRef.componentInstance.lockoutSetting = this.findingLockoutSetting;
        modalRef.componentInstance.inspection_report_is_sent = this.jobDetail.inspection_report_is_sent;
        modalRef.result.then((result) => {
            if (result.case) {
                this.getFindings();
                Swal({
                    title: 'Generate the reports?',
                    text: 'Generate the report (Findings) and the work contract?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {
                        this.makeReportAutomatically('finding_only', '')
                        this.makeReportAutomatically('generate_contract', 'new')
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal(
                            'Edited!',
                            'Finding has been edited.',
                            'success'
                        )
                    }
                })

            }
        }).catch((error) => {

        });
    }

    openBidSecondary(findingId) {
        const modalRef = this.modelService.open(BidSecondaryComponent, { size: 'lg' });
        modalRef.componentInstance.findingId = findingId;
        modalRef.componentInstance.lockoutSetting = this.findingLockoutSetting;
        modalRef.componentInstance.inspection_report_is_sent = this.jobDetail.inspection_report_is_sent;
        modalRef.result.then((result) => {
            if (result.case) {
                this.getFindings();
                Swal({
                    title: 'Generate the reports?',
                    text: 'Generate the report (Findings) and the work contract?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {
                        this.makeReportAutomatically('finding_only', '')
                        this.makeReportAutomatically('generate_contract', 'new')
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal(
                            'Edited!',
                            'Finding has been edited.',
                            'success'
                        )
                    }
                })
            }
        }).catch((error) => {

        });
    }

    viewFinding(findingId) {
        const modalRef = this.modelService.open(ViewFindingComponent, { size: 'lg' });
        modalRef.componentInstance.findingId = findingId;
    }

    deleteFinding(findingId) {
        Swal({
            title: 'Are you sure?',
            text: 'Delete Finding!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                let openpopup = this.openFindingLockoutPopup();
                openpopup.then((value) => {
                    if (value) {
                        this.findingService.deleteFinding(findingId).subscribe(
                            data => {
                                this.getFindings();
                                Swal(
                                    'Deleted!',
                                    'Finding has been deleted.',
                                    'success'
                                )
                            }
                        );
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {

            }
        })
    }

    editFindings(findingId) {
        const modalRef = this.modelService.open(FindingAddComponent, { size: 'lg' });
        modalRef.componentInstance.jobId = this.jobId;
        modalRef.componentInstance.findingId = findingId;
        modalRef.componentInstance.lockoutSetting = this.findingLockoutSetting;
        modalRef.componentInstance.inspection_report_is_sent = this.jobDetail.inspection_report_is_sent;
        modalRef.result.then((result) => {
            if (result.case) {
                this.getFindings();
                Swal({
                    title: 'Generate the reports?',
                    text: 'Generate the report (Findings) and the work contract?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {
                        this.makeReportAutomatically('finding_only', '')
                        this.makeReportAutomatically('generate_contract', 'new')
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal(
                            'Edited!',
                            'Finding has been edited.',
                            'success'
                        )
                    }
                })

            }
        }).catch((error) => {

        });
    }

    manageImages(findingId) {
        const modalRef = this.modelService.open(FindingImageComponent, { size: 'lg' });
        modalRef.componentInstance.jobId = this.jobId;
        modalRef.componentInstance.findingId = findingId;
        modalRef.componentInstance.lockoutSetting = this.findingLockoutSetting;
        modalRef.componentInstance.inspection_report_is_sent = this.jobDetail.inspection_report_is_sent;
        modalRef.result.then((result) => {
            if (result.case) {
                this.getFindings();
                if (result.case == 'upload_finding_image') {
                    Swal(
                        'Uploaded!',
                        'Finding image has been uploaded.',
                        'success'
                    )
                }
            }
        }).catch((error) => {

        });
    }

    makeFindingsReportPdf(type, gen_type) {
        this.pageLoaderShow = true
        var data = {
            'type': type,
            'jid': this.jobId,
            'gen_type': gen_type
        }
        this.findingService.generateReport(data).subscribe(

            data => {
                this.pageLoaderShow = false
                if (data.status == 200) {
                    Swal(
                        'Success!',
                        data.result.message,
                        'success'
                    )
                } else if (data.status == 400) {
                    Swal(
                        'Error!',
                        data.result.message,
                        'warning'
                    )
                }
            }

        );

    }

    makeReportAutomatically(type, gen_type) {
        this.pageLoaderShow = true
        var data = {
            'type': type,
            'jid': this.jobId,
            'gen_type': gen_type
        }
        this.findingService.generateReport(data).subscribe(
            data => {
                if (data.status == 200) {
                    if (type == 'finding_only') {
                        this.reportNumber = 1;
                    } else if (type == 'generate_contract') {
                        this.reportErrorStatus = 2;
                        this.reportNumber = 2;
                        this.setTimer();
                    }
                } else if (data.status == 400) {
                    this.pageLoaderShow = false
                    this.reportErrorStatus = 1;
                    this.setTimer();
                }
            }
        );


    }


    setTimer() {
        this.pageLoaderShow = false
        setTimeout(() => {
            this.reportNumber = 0;
            this.reportErrorStatus = 0;
        }, 3000);

    }

    // get lockout settings
    lockoutSettings() {
        this.cService.getLockoutSettings().subscribe(
            data => {
                if (data) {
                    this.isFindingLockoutVerified = false;
                    this.findingLockoutSetting = data;
                }
                else {
                    this.isFindingLockoutVerified = true;
                }
            }
        );
    }

    // open popup modal for lockout pin
    openFindingLockoutPopup() {
        return new Promise((resolve) => {
            if (this.jobDetail && this.jobDetail.inspection_report_is_sent && this.findingLockoutSetting && this.findingLockoutSetting.finding_lockout_pin !== "") {
                const modalRef = this.modelService.open(LockoutComponent);
                modalRef.componentInstance.lockout_type = "findings";
                modalRef.componentInstance.lockoutSetting = this.findingLockoutSetting;
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

    // get job data
    getJobDetail() {
        this.findingService.jobData(this.jobId).subscribe(
            data => {
                this.jobDetail = data;
            }
        );
    }


}
