import { Component, OnInit, Input, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../../client';
import { Company } from '../../company';
import { ClientService } from '../../services/client/client.service';
import { CommonService } from '../../services/common/common.service';
import { CompanyService } from '../../services/company/company.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of } from 'rxjs';
import 'rxjs/add/observable/timer'
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment'

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    providers: [ClientService],
    styleUrls: ['./client.component.scss']
})


export class ClientComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private timer: Observable<any>;
    private apiSite = environment.apiSite;
    @Input() intakeTab;
    @ViewChild('inspectorsModal') templateRef: TemplateRef<any>;
    private _modalRef: NgbModalRef;
    copyclient: any;
    copycompany: any;
    job_id = null;
    states: string[];
    lead: string[];
    allClients = [];
    allCompany = [];

    client = new Client(null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'no', 0, null, false);
    company = new Company(null, null, null, null, null, null, null, null, null, null, null);

    addnew = true;
    searchnew = false;
    existnew = true;
    assoc_agency = true;
    freshSearch = false;

    clientList = {
        client_id: null,
        client_first_name: null,
        client_last_name: null,
        client_notes: null,
        client_email: null,
        client_phone: null,
        client_address1: null,
        client_address2: null,
        client_city: null,
        client_state: null,
        client_zip: null

    };
    model: any;
    searching = false;
    searchFailed = false;
    checkClient = false;
    active_tab: any;
    preferredInspectors = [];
    // prev_tab:any;
    constructor(
        private clientService: ClientService,
        private commonService: CommonService,
        private companyService: CompanyService,
        private _router: Router,
        private router: ActivatedRoute,
        private modalService: NgbModal,

    ) { }

    ngOnInit() {
        // localStorage.setItem('new_tab', JSON.stringify(this.intakeTab.activeId) );
        // if(localStorage.getItem("active_tab") != null){
        // 	this.active_tab = (JSON.parse(localStorage.getItem("active_tab")));
        // 	localStorage.removeItem("active_tab");
        // }else{
        // 	this.active_tab = this.intakeTab.activeId;
        // }
        this.active_tab = this.intakeTab.activeId;

        this.getStates();
        this.getLead();
        this.client.is_company = 'no';
        this.router.params.subscribe(params => {
            if (params.jobId) {
                this.job_id = params.jobId;
                this.editOrder(this.job_id);
                this.newClient();
            } else {
                // this.searchClient();
                this.addnew = true;
                this.searchnew = false;
                this.model = null;
                this.freshSearch = true;
            }
        })
        this.copyclient = Object.assign({}, this.client);
        this.copycompany = Object.assign({}, this.company);


    }
    isNotSave = false;
    ngOnDestroy() {
        if ((this.checkClient == false) && (this.client.client_first_name != null)) {
            let client = JSON.stringify(this.client);
            let clientcopy = JSON.stringify(this.copyclient);

            let company = JSON.stringify(this.client);
            let companycopy = JSON.stringify(this.copyclient);
            if (client === clientcopy && company === companycopy) {
            } else {
                this.isNotSave = true;
                this.clientSubmit();

            }
        }
    }
    isReadOnly: boolean;
    isremove: boolean;
    ischange: boolean;
    // changeClick=false;
    editClient() {
        // if(this.isReadOnly){
        this.isReadOnly = false;
        // }else{
        // this.isReadOnly=true;
        // }
    }
    changeClient() {
        // this.changeClick=true;
        this.isReadOnly = false;
        this.ischange = false;
        this.client = new Client(null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'no', 0, null, false);
    }
    remove_success = false;
    removeClient() {
        // console.log(this.active_tab+'---active');
        // console.log(this.client.client_id);
        // console.log(this.job_id);
        this.clientService.removeClient(this.job_id, this.active_tab).subscribe(data => {
            if (data) {
                this.isReadOnly = false;
                this.isremove = false;

                this.client = new Client(null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'no', 0, null, false);
                this.ischange = false;
                // this.showloader   = true;
                this.remove_success = true;
                this.timer = Observable.timer(5000);
                this.subscription = this.timer.subscribe(() => {
                    // this.showloader = false;
                    this.remove_success = false;
                });
            }
            // console.log(data,'fff');
        })

    }
    //edit order
    editOrder(jobid) {
        this.clientService.getOrder(jobid, this.intakeTab.activeId).subscribe(
            data => {
                if (data.client) {
                    this.client = new Client(
                        data.client.client_id,
                        data.client.client_first_name,
                        data.client.client_last_name,
                        data.client.client_notes,
                        data.client.client_phone,
                        data.client.client_email,
                        data.client.client_address1,
                        data.client.client_address2,
                        data.client.client_city,
                        data.client.client_state,
                        data.client.client_zip,
                        null,
                        null,
                        null,
                        data.billable_user,
                        data.lead_id,
                        null,
                        null
                    );
                    this.isReadOnly = true;
                    this.isremove = true;
                    this.ischange = true;
                    if (data.client_id === data.client.client_id) {
                        this.client.is_client = true;
                    } else {
                        this.client.is_client = false;
                    }
                    // this.client
                    if (data.client.client_is_company == 1) {
                        this.client.is_company = 'yes';
                        this.assocAgency('yes')
                    } else {
                        this.client.is_company = 'no';
                    }
                } else {
                    // this.searchClient();
                    this.freshSearch = true;
                }
                if (data.client && data.client.company) {
                    this.company = new Company(
                        data.client.company.company_id,
                        data.client.company,
                        data.client.company.company_reference_id,
                        data.client.company.company_type,
                        data.client.company.company_name,
                        data.client.company.company_address1,
                        data.client.company.company_address2,
                        data.client.company.company_city,
                        data.client.company.company_state,
                        data.client.company.company_zip,
                        data.client.company.company_phone
                    );
                }
                this.copyclient = Object.assign({}, this.client);
                this.copycompany = Object.assign({}, this.company);
            }
        );
    }
    // new Order
    saveStatus = '';
    submitted = false;
    clientSubmit() {
        this.client.company = this.company;
        // this.client.active_id = this.intakeTab.activeId;
        this.client.active_id = this.active_tab;
        this.client.job_id = this.job_id;
        this.checkClient = true;
        console.log(this.active_tab + '---active');
        console.log(this.intakeTab.activeId + '---activex');
        // localStorage.setItem('active_tab', JSON.stringify(this.intakeTab.activeId) );
        this.submitted = true;
        this.clientService.newClientOrder(this.client).subscribe(
            data => {
                this.submitted = false;
                this.saveStatus = 'Saved';
                if (this.isNotSave == false) {
                    // if (data.inspection == 'yes') {
                    // window.location.href = this.apiSite + 'url/inspections_completed_sheet/' + data.job_id;
                    // } 
                    let tabsOrder = JSON.parse(localStorage.getItem("tab_orders"));
                    let tabKeys = Object.keys(tabsOrder);
                    this._router.navigate([tabsOrder[tabKeys[tabKeys.indexOf('client') + 1]] + '/', data.job_id]);
                } else {
                    if (this.job_id == null) {

                        let locationHash = this._router.url.split("/");
                        if (locationHash.length == 2) {
                            this._router.navigate([locationHash[1] + '/', data.job_id]);
                        }
                    }
                    this.isNotSave = true;
                }
            }
        );
    }
    // ALL LEAD
    getLead() {
        this.clientService.getLead().subscribe(
            data => {
                this.lead = data as string[];
            }
        );
    }
    // ALL STATE
    getStates() {
        this.commonService.getState().subscribe(
            data => {
                this.states = data as string[];
            }
        );
    }
    addNew() {
        this.addnew = true;
        this.searchnew = false;
        this.existnew = true;
        this.model = null;
        this.client = new Client(null, null, null, null, null, null, null, null, null, null, null, 'no', null, null, 'no', this.client.lead_id, null, this.client.is_client);
    }
    assocAgency(data) {
        if (data == 'yes') {
            this.assoc_agency = false;
        } else {
            this.assoc_agency = true;
        }

    }
    clientData = [];
    existSearch(item) {
        this.clientService.searchClient(this.client).subscribe(
            data => {
                if (data) {
                    this.clientList = data;
                    this.clientData = data;
                    this.existnew = false;
                } else {
                    this.existnew = true;
                }
            }
        );
    }
    // Search for an Existing Client
    searchClient() {
        this.addnew = false;
        this.searchnew = true;
        this.model = null;
    }
    newClient() {
        this.addnew = true;
        this.searchnew = false;
        this.model = null;
        this.freshSearch = true;
    }
    cancelClient(jobId) {
        this.addnew = true;
        this.searchnew = false;
        if (this.freshSearch == false) {
            this.editOrder(jobId);
        }

    }
    // Use This Client & Search Client Name
    existClient(data) {
        this.addnew = true;
        this.searchnew = false;
        this.model = null;
        this.existnew = true;
        if (data) {
            this.client = new Client(
                data.client_id,
                data.client_first_name,
                data.client_last_name,
                data.client_notes,
                data.client_phone,
                data.client_email,
                data.client_address1,
                data.client_address2,
                data.client_city,
                data.client_state,
                data.client_zip,
                'no',
                null,
                null,
                'no',
                this.client.lead_id,
                null,
                this.client.is_client
            );
            // get prefered inspectors
            this.clientService.getPreferredInspectors(data.client_id).subscribe(data => {
                if (data && data.length > 0) {
                    this.preferredInspectors = data;
                    this._modalRef = this.modalService.open(this.templateRef, { size: 'lg' });
                }
                else {
                    this.preferredInspectors = [];
                }
            })

        } else {
            this.client = new Client(
                this.clientList.client_id,
                this.clientList.client_first_name,
                this.clientList.client_last_name,
                this.clientList.client_notes,
                this.clientList.client_phone,
                this.clientList.client_email,
                this.clientList.client_address1,
                this.clientList.client_address2,
                this.clientList.client_city,
                this.clientList.client_state,
                this.clientList.client_zip,
                'no',
                null,
                null,
                'no',
                this.client.lead_id,
                null,
                this.client.is_client
            );

        }
        this.isReadOnly = true;
        this.ischange = true;
    }

    closeModal() {
        this._modalRef.close();
    }

    // SEARCH Company Name
    existCompany(data) {
        if (data) {
            this.company = new Company(
                data.item.company_id,
                data.item.company_id,
                data.item.company_reference_id,
                data.item.company_type,
                data.item.company_name,
                data.item.company_address1,
                data.item.company_address2,
                data.item.company_city,
                data.item.company_state,
                data.item.company_zip,
                data.item.company_phone
            );
        }
    }

    //  type ahead filter for client
    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>
                this.clientService.getClients(term).pipe(
                    tap(() => { this.searchFailed = false }),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        )
    formatter = (x: { client_first_name: string }) => x.client_first_name;
    companySearch = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>
                this.companyService.searchCompany(term).pipe(
                    tap(() => { this.searchFailed = false }),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        )
    companyFormatter = (x: { company_name: string }) => x.company_name;
}
