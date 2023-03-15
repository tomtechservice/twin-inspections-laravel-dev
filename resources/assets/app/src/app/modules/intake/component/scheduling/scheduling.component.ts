import { Component, OnInit, Input, OnDestroy, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../reports/services/common/common.service';
import { CommonService as CService } from '../../../intake/services/common/common.service';
import { Schedule } from '../../schedule';
import { ScheduleService } from '../../services/schedule/schedule.service';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwitchAgentComponent } from '../../../popups/component/switch-agent/switch-agent.component';
import { AccountServicesService } from '../../../client/services/account-services.service';
import { environment } from '../../../../../environments/environment';
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';
import { LockboxComponent } from '../../../lockbox/components/lockbox/lockbox.component';
import { PropertyService } from '../../../intake/services/property/property.service';
import { FeesService } from '../../../../components/office-fees/services/fees.service';

@Component({
    selector: 'test-content',
    template: `
        <app-card-details [client_id]='client_id' (notify)='onNotify($event)'></app-card-details>
    `
})
export class CreditCardContent {
    @Input() client_id;

    constructor(public activeModal: NgbActiveModal) {
        console.log(this.client_id)
    }

    onNotify(event) {
        this.activeModal.close('Modal Closed');
    }
}


@Component({
    selector: 'app-scheduling',
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.scss'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})

export class SchedulingComponent implements OnInit, OnDestroy {
    page_title = "Inspection: Scheduler";
    private apiSite = environment.apiSite;
    states: string[];
    year = [];

    inspectors = [];
    search = false;
    searchQuery = null;
    resultType = null;
    slider_width = 0;
    totalSlotsAll = 0;

    availableInspectors: string[];
    avaialbleAgents: string[];
    clientCards: string[];
    timeSlots = [];
    availableSlots = [];

    calendarConnected = false;
    officeCalendarConnected = false;
    showRecommendations = false;
    hiddenSchedules = false;
    submitted = false;

    fromTime;
    leftDragWidth = null;
    timeMultiplayer = 0;
    startTime = 0;
    endTime = 0;
    singleWidth = null;
    minuteInter = 5;

    old_agent_id = null;
    old_from_date = null;
    old_from_time = null;
    old_calculated_time = null;

    agentStartTime = null;
    agentStartMinute = null;

    agentTHour = null;
    agentTMin = null;

    recommenedTrue = false;

    inspectionMinutes = 0;
    @Input() intakeTab;
    check_schedule = false;
    schedulecopy: any;
    lockboxcode = "";
    propertyId = "";

    schedule = new Schedule(
        null, '', null, null, null, null, null,
        null, 0, '', '', '', 'Check', '', '', null,
        '', '', 0, '', '', '', '', '', 0, null, '', false, false, '', '', false, []
    );

    job_total_fee = 0;

    isLockoutVerified = false;
    lockoutSetting: any;
    feesList = [];
    selectedFeesList = [];

    constructor(
        private commonService: CommonService,
        private scheduleService: ScheduleService,
        private calendar: NgbCalendar,
        private _router: Router,
        private router: ActivatedRoute,
        private modalService: NgbModal,
        private cService: CService,
        private account: AccountServicesService,
        private propertyService: PropertyService,
        private feesService: FeesService
    ) { }

    ngOnInit() {
        this.router.params.subscribe(params => {
            if (params.jobId) {

                this.schedule.jobId = params.jobId;
                this.getSchedule(params.jobId);
                this.getHoldTransaction(params.jobId);
                this.getProperty();

            } else {
                this.getAvailDate()
            }

        });
        this.getInspectors();
        this.intervalBuilder();
        this.schedulecopy = Object.assign({}, this.schedule);
        this.getYear();
        this.getStates();
        this.lockoutSettings();
        this.getFeesList();

    }
    getYear() {
        var d = new Date();
        var n = d.getFullYear();
        console.log(n);
        for (var i = 0; i < 50; i++) {
            this.year.push(n + i)
        }
    }
    getStates() {
        this.cService.getState().subscribe(
            data => {
                this.states = data as string[];
            }
        );
    }
    getCardDetals(clientId) {
        this.account.cardList(clientId)
            .subscribe(
                data => {
                    this.clientCards = data.data;
                }
            );
    }
    getCardDetalsChange(clientId, status) {
        console.log(status)
        if (this.schedule.charge_card && this.schedule.charge_card_inspection) {
            if (status == true) {
                this.schedule.charge_card_inspection = false;
            } else {
                this.schedule.charge_card = false
            }
        }
        this.account.cardList(clientId)
            .subscribe(
                data => {
                    this.clientCards = data.data;
                }
            );
    }
    addNewCard() {
        const modalRef = this.modalService.open(CreditCardContent, { size: 'lg' });
        // console.log("client id",this.clientId)
        modalRef.componentInstance.client_id = this.schedule.client_id;
        modalRef.result.then((result) => {
            this.getCardDetals(this.schedule.client_id);
        }).catch((error) => {
            console.log(error);
        });
    }
    // closeModal() {
    //     this.activeModal.close('Modal Closed');
    // }
    intervalBuilder() {

        var hours, minutes, ampm, ampHours;
        for (var i = 480; i <= 1020; i += 15) {
            hours = Math.floor(i / 60);
            minutes = i % 60;
            if (minutes < 10) {
                minutes = '0' + minutes; // adding leading zero
            }
            ampm = hours % 24 < 12 ? 'AM' : 'PM';
            ampHours = hours % 12;
            if (ampHours === 0) {
                ampHours = 12;
            }
            // console.log(hours.toString().length);
            if (hours.toString().length == 1) {
                hours = '0' + hours.toString();
                // console.log(hours);
            }
            let single = { 'id': i, 'time': hours + ':' + minutes, 'show': ampHours + ':' + minutes + ' ' + ampm };
            this.timeSlots.push(single);
        }
        this.timeSlots.toString();
        // console.log(this.timeSlots);
    }

    isNotSave = false;
    ngOnDestroy() {
        let schedule = JSON.stringify(this.schedule);
        let schedulecopy = JSON.stringify(this.schedulecopy);

        if (this.check_schedule == false) {
            if (schedule === schedulecopy) {

            } else {
                if (this.schedule.agent_id && this.schedule.from_time) {
                    this.isNotSave = true;
                    this.scheduleSubmit();
                }
            }
        }
    }
    getAvailDate() {
        this.schedule.calculated_time = 120
        // this.searchSchedules();
    }
    // getAvailDate(){
    //     this.scheduleService.getAvailDate().subscribe(
    //         data => {
    //             if (data) {
    //                 this.schedule.calculated_time = 120
    //                 this.schedule.from_date = data;
    //                 this.searchSchedules();
    //             }
    //         }
    //     );
    // }
    switchAgent(job) {
        const modalRef = this.modalService.open(SwitchAgentComponent, { size: 'lg' });
        modalRef.componentInstance.job = job;
        modalRef.result.then((result) => {
            if (result == '0') {
                if (this.schedule.jobId) {
                    this.getSchedule(this.schedule.jobId);
                } else {
                    // this.searchSchedules();
                }

            }
        }).catch((error) => {
            if (error == '0') {
                if (this.schedule.jobId) {
                    this.getSchedule(this.schedule.jobId);
                } else {
                    // this.searchSchedules();
                }

            }
        });
        return false;
    }
    show_custom_error = false;
    onSubmit() {
        // if(this.schedule.charge_card && this.schedule.selected_card ==""){
        //     this.show_custom_error=true;
        //     return false;
        // }else{
        //     this.show_custom_error=false;
        // }

        if (this.schedule.charge_card || this.schedule.charge_card_inspection) {
            if (this.holdTransactionList.length == 0) {
                if ((this.schedule.job_payment_type == "Credit Card") && this.schedule.selected_card == "") {
                    this.show_custom_error = true;
                    return false;
                } else {
                    this.show_custom_error = false;
                }
            }
        }
        if (this.schedule.charge_card && this.schedule.selected_card != "") {
            Swal({
                title: 'Warning',
                text: 'This will charge the selected credit card now',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            })
                .then((result) => {
                    if (result.value) {
                        this.scheduleSubmit();
                    }
                })
        } else {
            this.scheduleSubmit();
        }

    }
    error_message;
    scheduleSubmit() {
        //   console.log(this.client_emails)
        this.schedule.client_email = this.client_emails
        this.schedule.job_fees = this.selectedFeesList;
        // if(this.schedule.additional_email!=''){
        //     this.schedule.additional_email= this.schedule.additional_email.split(";")
        // }
        this.submitted = true;
        this.check_schedule = true;
        this.scheduleService.addSchedule(this.schedule).subscribe(
            data => {
                if (data.data == 'error') {
                    Swal({
                        title: 'Error',
                        text: data.message
                    })
                    this.getSchedule(this.schedule.jobId);
                    this.getFeesList();
                } else {

                    if (this.isNotSave == false) {
                        if (this.schedule.jobId) {
                            this._router.navigate(['inspections-completed-sheet', this.schedule.jobId]);
                            // window.location.href = this.apiSite+'url/inspections_completed_sheet/'+this.schedule.jobId;

                        } else {
                            this._router.navigate(['inspections-completed-sheet', data.jobId]);
                            // window.location.href = this.apiSite+'url/inspections_completed_sheet/'+data.jobId;

                        }
                    } else {
                        this.isNotSave = true;
                        let locationHash = this._router.url.split("/");
                        if (locationHash.length == 2) {
                            this._router.navigate([locationHash[1] + '/', data.jobId]);
                        }
                        this.getFeesList();
                    }
                }

            }, error => {
                console.log(error)
                this.error_message = error;
                this.submitted = false;
            }
        );
    }
    holdTransactionList = [];
    paymentStatus;
    getHoldTransaction(job_id) {
        this.scheduleService.getAuthorizeTransactionListJob(job_id).subscribe(
            data => {
                this.holdTransactionList = data;
                if (data.length > 0) {
                    data.forEach(element => {
                        console.log(element.status)
                        this.paymentStatus = element.status
                    });
                } else {
                    this.paymentStatus = 'test'
                }
            }
        );
    }
    deleteHoldPayment(payment) {
        Swal({
            title: 'Warning',
            text: 'Are you sure to cancel this payment?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        })
            .then((result) => {
                if (result.value) {
                    this.scheduleService.cancelHoldPayment(payment).subscribe(
                        data => {
                            this.getHoldTransaction(payment.job_id);
                        });
                }
            })
    }
    checkedEmail: Array<string>;
    client_emails: any[]
    allClientEmails(index, item, client_email, checked) {
        if (!checked) {
            this.client_emails = this.client_emails.filter((x, item) => {
                return item
            })
        } else {
            this.client_emails.push(item);
        }
    }
    getSchedule(job_id) {
        this.scheduleService.getSchedule(job_id).subscribe(
            data => {
                if (data) {
                    this.schedule = new Schedule(
                        data.job_id,
                        data.agent_id,
                        data.from_date,
                        data.from_date,
                        '',
                        '',
                        data.from_time,
                        data.to_time,
                        data.calculated_time,
                        data.job_fee,
                        data.job_fee_discount,
                        data.job_fee_discount_type,
                        data.job_payment_type,
                        data.job_payment_type_notes,
                        data.job_escrow_number,
                        data.job_escrow_closing_date,
                        data.job_confirmation_email_sent,
                        data.job_is_requested,
                        data.add_to_calendar,
                        0,
                        data.job_cc_number,
                        data.job_cc_exp_month,
                        data.job_cc_exp_year,
                        data.job_cc_vcode,
                        data.wants_earlier,
                        data.client_id,
                        '',
                        false,
                        false,
                        data.additional_email,
                        data.client_email,
                        data.anytime,
                        []
                    );

                    this.job_total_fee = data.job_fee - data.job_fee_discount;

                    this.client_emails = data.client_email
                    // this.searchSchedules();
                    this.setCalendarStatus();
                    this.setOfficeCalendarStatus();
                    this.getInspectionMinutes(this.schedule.jobId);
                    if (this.schedule.client_id) {
                        this.getCardDetals(this.schedule.client_id);
                    }
                    this.fromTime = data.from_time;
                    this.schedulecopy = Object.assign({}, this.schedule);

                    // update old values when loading.
                    this.updateOldSchduleValues();
                }
            }
        );
    }
    onDateChange() {
        // console.log(this.schedule.job_escrow_closing_date);
        if (this.schedule.job_escrow_closing_date == '0000-00-00 00:00:00') {
            this.schedule.job_escrow_closing_date = null;
        }
    }
    getInspectors() {
        if (this.schedule.jobId) {
            this.commonService.getInspectorsWithPreferredLabel(this.schedule.jobId).subscribe(
                data => {
                    this.inspectors = data;
                }
            );
        }
        else {
            this.commonService.getInspectors().subscribe(
                data => {
                    this.inspectors = data;
                }
            );
        }
    }
    getInspectionMinutes(jobId) {
        this.scheduleService.getInspectionMinutes(jobId).subscribe(
            data => {
                this.inspectionMinutes = data.data;
                if (this.schedule.calculated_time == 0) {

                    if (data.data != 0) {
                        this.schedule.calculated_time = data.data
                    } else {
                        this.schedule.calculated_time = 120
                    }

                }
            }
        );
    }

    createRange(number) {
        number = number - 1;
        var items: number[] = [];
        for (var i = number; i >= 0; i--) {
            items.push(i);
        }
        return items;
    }
    findSchedules() {
        if (!this.schedule.agent_id) {
            this.showRecommendations = false;
            let fromDate = this.schedule.from_date;
            let fromDateFilter = fromDate.year + '-' + fromDate.month + '-' + fromDate.day;
            this.searchQuery = 'job_id=' + this.schedule.jobId + '&to_date=' + fromDateFilter + '&from_date=' + fromDateFilter;
            this.scheduleService.searchAvailable(this.searchQuery).subscribe(
                data => {
                    if (data) {
                        let agents = [];
                        for (var i = 0; i < data.length; i += 5) {
                            agents.push(data.slice(i, i + 5));
                        }
                        this.avaialbleAgents = agents;
                        // console.log(this.avaialbleAgents);
                        this.showRecommendations = true;
                    }

                }
            );
        } else {
            this.showRecommendations = false;
        }

    }
    setCalendarStatus() {
        if (this.schedule.agent_id) {
            this.scheduleService.getCalendarStatus(this.schedule.agent_id).subscribe(
                data => {
                    // console.log(data);
                    this.calendarConnected = data.status;
                    if (this.calendarConnected) {
                        this.schedule.add_to_calendar = 1;
                    } else {
                        this.schedule.add_to_calendar = 0;
                    }
                });
        }

    }

    setOfficeCalendarStatus() {
        if (this.schedule.agent_id) {
            this.scheduleService.getOfficeCalendarStatus(this.schedule.agent_id).subscribe(
                data => {
                    // console.log(data);
                    this.officeCalendarConnected = data.status;
                    if (this.calendarConnected) {
                        this.schedule.add_to_office_calendar = 1;
                    } else {
                        this.schedule.add_to_office_calendar = 0;
                    }
                });
        }

    }



    checkAgentAvailability() {
        if (this.schedule.agent_id && this.schedule.from_date && this.schedule.from_time && this.schedule.calculated_time) {
            let fromDate = this.schedule.from_date;
            let fromDateFilter = fromDate.year + '-' + fromDate.month + '-' + fromDate.day;
            this.scheduleService.checkAgentAvailability({
                job_id: this.schedule.jobId,
                agent: this.schedule.agent_id,
                from_date: fromDateFilter,
                from_time: this.schedule.from_time,
                calculated_time: this.schedule.calculated_time,
            }).subscribe(
                data => {
                    if (data.status === false) {
                        // show notification
                        Swal({
                            title: 'Warning',
                            text: 'This inspector already has an appointment booked for this time. Are you sure you want to continue?',
                            type: 'warning',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Continue',
                            showCancelButton: true,
                            cancelButtonText: `Go Back`,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (typeof result['value'] != 'undefined' && result['value'] === true) {
                                // continue
                                // update the old values.
                                this.updateOldSchduleValues();
                            } else {
                                this.schedule.agent_id = this.old_agent_id;
                                this.schedule.from_date = this.old_from_date;
                                this.schedule.from_time = this.old_from_time;
                                this.schedule.calculated_time = this.old_calculated_time;
                            }
                        });
                    } else {
                        // update the old values.
                        this.updateOldSchduleValues();
                    }
                }
            );
        } else {
            this.updateOldSchduleValues();
        }
    }

    // update old values.
    updateOldSchduleValues() {
        // update the old values.
        if (this.schedule.agent_id != null) this.old_agent_id = this.schedule.agent_id;
        if (this.schedule.from_date != null) this.old_from_date = this.schedule.from_date;
        if (this.schedule.from_time != null) this.old_from_time = this.schedule.from_time;
        if (this.schedule.calculated_time != null) this.old_calculated_time = this.schedule.calculated_time;
    }

    searchSchedules() {
        this.hiddenSchedules = true;
        let fromDate = this.schedule.from_date;
        let fromDateFilter = fromDate.year + '-' + fromDate.month + '-' + fromDate.day;
        this.searchQuery = 'agent=' + this.schedule.agent_id + '&to_date=' + fromDateFilter + '&from_date=' + fromDateFilter;
        this.scheduleService.getData(this.searchQuery).subscribe(
            data => {
                if (data.data) {
                    this.hiddenSchedules = false;
                    this.availableInspectors = data.data;
                    this.resultType = data.type;
                    this.calendarConnected = false;
                    if (this.resultType == 'time' && data.data.length > 0) {
                        this.totalSlotsAll = data.data[0].totalSlots;
                        this.agentTHour = data.data[0].startHour
                        this.agentTMin = data.data[0].startMinutes
                        this.agentStartMinute = this.agentTMin;
                        this.agentStartTime = this.agentTHour;
                        this.calendarConnected = data.data[0].is_calendar_connected
                        if (this.calendarConnected) {
                            this.schedule.add_to_calendar = 1;
                        }
                    }
                    if (this.schedule.agent_id) {

                        setTimeout(() => {
                            if (this.recommenedTrue) {
                                this.setLeftandTimer();
                            } else {
                                if (this.schedule.jobId) {
                                    this.calculateDragWidthAndLeft();
                                } else {
                                    this.calculateDragWidth();
                                }
                            }


                        }, 500);
                    } else {
                        this.findSchedules();
                    }

                }

            }
        );
    }

    selectAgentFromRecommended(agent) {

        this.schedule.agent_id = agent.agent_id;
        this.schedule.from_time = agent.startTime;
        this.schedule.to_time = agent.endTime;
        this.recommenedTrue = true;
        // this.searchSchedules();

    }
    //
    onSelectInspector(inspector) {
        this.schedule.agent_id = inspector.agent_id;
        this.agentStartMinute = inspector.startMinutes;
        this.agentStartTime = inspector.startHour;
        this.recommenedTrue = false;
        // this.searchSchedules();

    }
    //
    async onDateSelect(event) {
        if (this.lockoutSetting.date !== '') {
            if (event) {
                let d1_string = event.year + '-' + ((event.month < 10) ? '0' + event.month : event.month) + '-' + ((event.day < 10) ? '0' + event.day : event.day);
                let d1 = new Date(d1_string);
                let d2 = new Date(this.lockoutSetting.date);
                if (d1 < d2) {
                    await this.lockoutPopup();
                }
            }
        }
        this.search = true;
        this.setCalendarStatus();
        this.setOfficeCalendarStatus();
        this.checkAgentAvailability();
        // this.searchSchedules();
    }
    // calculate drag width
    myElement;
    dragParent;
    setSingleWidth() {
        let agentId = this.schedule.agent_id;
        this.myElement = document.getElementById('id_' + agentId);
        this.dragParent = document.getElementById('parent_' + agentId);
        let dragParentWidth = this.dragParent.offsetWidth;
        this.singleWidth = dragParentWidth / this.totalSlotsAll;
    }
    setCalculatedTime() {
        // old to time and from time fix
        this.schedule.calculated_time = this.getDateDiff(this.schedule.from_time, this.schedule.to_time);

    }
    setOffsetStyles() {
        // time multiplayer
        this.timeMultiplayer = this.schedule.calculated_time / this.minuteInter;
        // console.log(this.timeMultiplayer);
        this.slider_width = this.singleWidth * this.timeMultiplayer;

        //
        let leftMultiplayer = this.findLeftMiutes() / this.minuteInter;
        let offsetLeft = leftMultiplayer * this.singleWidth;

        this.leftDragWidth = offsetLeft
        this.myElement.style.left = offsetLeft + "px";
    }
    timeCalc() {

        let rightDragWidth = this.leftDragWidth + this.slider_width;
        let endFactor = rightDragWidth / this.singleWidth;
        let startFactor = this.leftDragWidth / this.singleWidth;

        let startMinutes = startFactor * this.minuteInter;
        let endMinutes = endFactor * this.minuteInter;

        // console.log(startMinutes)
        // console.log(endMinutes)
        this.schedule.from_time = this.minutesAdd(startMinutes);

        this.schedule.to_time = this.minutesAdd(endMinutes)
    }
    calculateDragWidth() {
        this.checkAgentAvailability();

        // this.setSingleWidth();
        // // time multiplayer
        // this.timeMultiplayer = this.schedule.calculated_time / this.minuteInter;
        // // console.log(this.timeMultiplayer);
        // this.slider_width = this.singleWidth * this.timeMultiplayer;
        // // left drag width
        // this.leftDragWidth = this.myElement.offsetLeft
        // this.timeCalc();

    }
    calculateDragWidthAndLeft() {

        // this.setSingleWidth();
        // this.setOffsetStyles();
        // this.timeCalc();

    }

    setLeftandTimer() {
        this.checkAgentAvailability();
        // this.setSingleWidth();
        // // this.setCalculatedTime();
        // this.schedule.to_time = this.addTimeMinutes(this.schedule.from_time, this.schedule.calculated_time);
        // this.fromTime = this.schedule.from_time
        // this.setOffsetStyles();

    }
    dragMe(myid) {
        let myElement = document.getElementById('id_' + myid);
        let parentElement = document.getElementById('parent_' + myid);
        let parentDivWidth = this.getWidth(parentElement);
        let elmentWidth = this.getWidth(myElement);
        let leftWidth = parentDivWidth - elmentWidth;
        this.dragElement(myElement, leftWidth, parentDivWidth);
    }

    dragElement(elmnt, leftWidth, parentDivWidth) {

        var pos1 = 0
        var pos2 = 0
        var pos3 = 0
        var pos4 = 0;

        var that = this;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            var topStyle = elmnt.offsetTop - pos2;

            if (topStyle == 0) {
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            }
            var offsetLeft = elmnt.offsetLeft;

            var leftStyle = offsetLeft - pos1;

            leftStyle = getFixedLeftStyle(leftStyle, parentDivWidth);
            if (leftStyle >= 0 && leftStyle <= leftWidth) {
                elmnt.style.left = leftStyle + "px";
            }

            that.calculateDragWidth();

        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        function getFixedLeftStyle(leftStyle, parentDivWidth) {
            return leftStyle;
        }

    }
    addTimeMinutes(time, minsToAdd) {
        function D(J) {
            return (J < 10 ? '0' : '') + J;
        };
        var piece = time.split(':');
        var mins = piece[0] * 60 + +piece[1] + +minsToAdd;

        return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
    }
    // support functions
    getTime(t) {
        let tObject = t.split(':');
        let dt = new Date();
        dt.setMinutes(tObject[1])
        dt.setHours(tObject[0])
        dt.setSeconds(0)
        return dt;
    }
    minutesAdd(minutes) {
        let dt = new Date();
        dt.setMinutes(this.agentStartMinute)
        dt.setHours(this.agentStartTime)
        dt.setSeconds(0)
        let allMinutes = dt.getMinutes() + minutes;
        allMinutes = Math.ceil(allMinutes);

        let lastone = allMinutes.toString().split('').pop();
        if (lastone == 0 || lastone == 5) {
            allMinutes = allMinutes;
            dt.setMinutes(allMinutes);

            return ("0" + dt.getHours()).slice(-2) + ':' + ("0" + dt.getMinutes()).slice(-2);
        } else {
            allMinutes = allMinutes / 10;
            allMinutes = Math.round(allMinutes)
            allMinutes = allMinutes * 10;
            dt.setMinutes(allMinutes);

            return ("0" + dt.getHours()).slice(-2) + ':' + ("0" + dt.getMinutes()).slice(-2);
        }

    }

    getWidth(rect) {
        let rectEle = rect.getBoundingClientRect();
        return rectEle.width;
    }
    getDateDiff(t1, t2) {

        let diff = Math.abs(this.getTime(t1).getTime() - this.getTime(t2).getTime());
        let minutes = Math.round((diff / 1000) / 60);
        return minutes;
    }
    findLeftMiutes() {

        let t1 = this.fromTime;
        let t2 = this.agentTHour + ':' + this.agentTMin + ':00';

        let minutes = this.getDateDiff(t1, t2);
        return minutes;

    }


    // open lockout pin verify modal
    lockoutPopup() {
        const modalRef = this.modalService.open(LockoutComponent);
        modalRef.componentInstance.lockoutSetting = this.lockoutSetting;
        modalRef.result.then((result) => {
            this.isLockoutVerified = result;
            if (!this.isLockoutVerified) {
                let d = new Date(this.lockoutSetting.date + ' 23:59:59');
                this.schedule.from_date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
                Swal({
                    title: 'Warning',
                    text: 'The date is not allowed',
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    // get lockout settings
    lockoutSettings() {
        this.cService.getLockoutSettings().subscribe(
            data => {
                if (data) {
                    this.isLockoutVerified = false;
                    this.lockoutSetting = data;
                }
                else {
                    this.isLockoutVerified = true;
                }
            }
        );
    }

    // open lockbox modal
    lockboxPopup() {
        if ((this.lockboxcode == "" || this.lockboxcode == null) && this.propertyId != "" && this.schedule.anytime) {
            const modalRef = this.modalService.open(LockboxComponent);
            modalRef.componentInstance.propertyId = this.propertyId;
            modalRef.result.then((result) => {
                this.lockboxcode = result;
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    // get lockout settings
    getProperty() {
        this.propertyService.getProperty(this.schedule.jobId).subscribe(
            data => {
                if (data) {
                    // set lockbox code of property
                    if (data.property && data.property.property_id) {
                        this.propertyId = data.property.property_id;
                        this.lockboxcode = data.property.property_lock_box_code;
                        this.lockboxPopup();
                    }
                }
                else {
                    this.propertyId = "";
                }
            }
        );
    }

    getFeesList() {
        this.feesService.getJobAllFees(this.schedule.jobId).subscribe(
            data => {
                this.feesList = data.result.data;
            }
        )
    }

    setDefaultFee(fee) {
        jQuery('#fee_real_' + fee.fee_id).val(fee.fee_amount);
        this.recalculateFees();
    }

    recalculateFees() {
        let total = 0.0;
        let discount = 0.0;
        let ref = this;
        ref.selectedFeesList = [];
        jQuery('.fee_real_box').each(function () {
            let fee_amount = +jQuery(this).val();
            let fee_id = jQuery(this).attr('data-fee-id');
            if (!isNaN(fee_amount) && fee_amount !== 0) {
                ref.selectedFeesList[ref.selectedFeesList.length] = { 'fee_id': fee_id, 'fee_amount': fee_amount };
                if (fee_amount < 0) {
                    discount = discount + (-fee_amount);
                }
                else {
                    total = total + fee_amount;
                }
            }
        });
        this.schedule.job_fee = total;
        this.schedule.job_fee_discount = discount;
        this.job_total_fee = total - discount;
    }

}
