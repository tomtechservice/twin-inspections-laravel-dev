import { Component, OnInit, Input,HostListener } from '@angular/core';

import { ReportManagerComponent } from '../../../popups/component/report-manager/report-manager.component'
import { SubContractorsComponent } from '../../completion-component/sub-contractors/sub-contractors.component';
import { MaterialsComponent } from '../../completion-component/materials/materials.component';
import { CrewHoursComponent } from '../../completion-component/crew-hours/crew-hours.component';
import { ChemicalsComponent } from '../../completion-component/chemicals/chemicals.component';
import { ChemAppHoursComponent } from '../../completion-component/chem-app-hours/chem-app-hours.component';
import { AdditionalWorkPerformedComponent } from '../../completion-component/additional-work-performed/additional-work-performed.component';
import { FindingsModelComponent } from '../../completion-component/findings-model/findings-model.component';
import { FindingsChemicalsAppliedModelComponent } from '../../completion-component/findings-chemicals-applied-model/findings-chemicals-applied-model.component';
import {LookupcodeComponent} from '../../component/lookupcode/lookupcode.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule, Routes , ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2';
import { ViewFindingComponent } from '../../../popups/component/view-finding/view-finding.component';
import {CommonService} from '../../../intake/services/common/common.service';
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';

// import { Router, RouterModule, Routes , ActivatedRoute } from '@angular/router';
import { FormArray,FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';
import { CompletionService } from '../../services/completion/completion.service';
import { UserService } from '../../services/user/user.service';
import { NgbDateStruct, NgbCalendar,NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
@Component({
  selector: 'app-completion-tasks',
  templateUrl: './completion-tasks.component.html',
  styleUrls: ['./completion-tasks.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
// @Directive({
// 	selector: '[var]',
// 	exportAs: 'var'
//   })
export class CompletionTasksComponent implements OnInit {
	page_title="Inspection: Work Order and Completion Tasks";
	// startRegistrationDate:{
	// 	"year": any,
	// 	"month": any,
	// 	"day": any
	// 	}
	@Input() intakeTab;
	// @Input() var:any;
	public jobId = 0;

	job: string[];
	report;

	findingWithChemicals:string[];
	findingWithOutChemicals:string[];
	
	additionalFindings:string[];

	chemMeta: string[];
	chemPlusMeta: string[];
	contractorMeta: string[];
	crewMeta: string[];
	materialMeta: string[];
	is_loading:boolean;
	public assigneeData = {
		crew : [],
		contractor : [],
		inspector : [],
		treater :[],
	  }
	completionForm = this.fb.group({
		findingWithOutChemicals: this.fb.array([]),
		findingWithChemicals:this.fb.array([]),
		job_completed_date:['',Validators.required],
		job_completed_notes:['']
	});
	submitted=false;
	completionSet= <FormArray>this.completionForm.controls.findingWithOutChemicals;
	findinguseChemicals= <FormArray>this.completionForm.controls.findingWithChemicals;

	isLockoutVerified=false;
	lockoutSetting:any;
	
	constructor(
		config : NgbModalConfig,
		private modelService : NgbModal, 
		private _router: Router,
		private route: ActivatedRoute,
		private completionService : CompletionService,
		private fb: FormBuilder,
		// private farray: FormArray,		
		private userService: UserService,
		private calendar: NgbCalendar,
		private commonService: CommonService,
		private modalService: NgbModal,
	) {
		this.route.params.subscribe(params => { 
			this.jobId = params['jobId']; 
		});
		config.backdrop = 'static';
    config.keyboard = false;
	}

	ngOnInit() {
		this.getCompletions();
		this.getAssigneeList();
		this.lockoutSettings();
	}
	showTab(id){
       this.intakeTab.select(id);
	}
	// crew;
	getAssigneeList() {
		this.userService.getAssigneeList().subscribe(
			data => {
			this.assigneeData.crew = data.crew;
			this.assigneeData.contractor = data.contractor;
			this.assigneeData.inspector = data.inspector;
			this.assigneeData.treater = data.treater;
			}
		)
	}
    //
    // Getting completion object
    // Single 2 way data binding data
    getCompletions() {
		this.is_loading=true;
	    this.completionService.completionFindings(this.jobId).subscribe(
	       	data => {
				
	       		this.job = data.result.job;
	       		this.report = data.result.report;

	       		this.chemMeta = data.result.chem_meta;
	       		this.chemPlusMeta = data.result.chem_plus_meta;
	       		this.contractorMeta = data.result.contractor_meta;
	       		this.crewMeta = data.result.crew_meta;
	       		this.materialMeta = data.result.material_meta;

	       		this.findingWithChemicals = data.result.finding_with_chemicals;
	       		this.findingWithOutChemicals = data.result.finding_with_out_chemicals;

				this.additionalFindings = data.result.additional_findings;
				this.is_loading=false;
				this.patchForm()
				// console.log("p",this.findingWithChemicals)
				this.totalHours()
	    	}
		);
	}
	patchForm(){
		this.findingWithOutChemicals.forEach(x => {
			this.completionSet.push(this.fb.group(
				{
					finding_id: x['finding_id'],
					finding_section: x['finding_section'],
					finding_type: x['finding_type'],
					finding_finding: x['finding_finding'],
					finding_perform_crew_id:x['finding_perform_crew_id'],
					finding_bid_hours_completed:x['finding_bid_hours_completed'],
					finding_bid_material_completed:x['finding_bid_material_completed'],
					finding_date_completed: this.dateFormat(x['finding_date_completed']),
					finding_completed: (x['finding_completed']==1&& x['finding_partially_completed']==0)?1:0,
					finding_partially_completed:x['finding_partially_completed'],
					partially_completed_discount:x['partially_completed_discount'],
					bid: this.findingBid(x)

				}
			))
		})
		this.findingWithChemicals.forEach(x => {
			this.findinguseChemicals.push(this.fb.group(
				{
					finding_id: x['finding_id'],
					finding_section: x['finding_section'],
					finding_type: x['finding_type'],
					finding_finding: x['finding_finding'],
					finding_perform_crew_id:x['finding_perform_crew_id'],
					finding_date_completed: this.dateFormat(x['finding_date_completed']),
					finding_completed: x['finding_completed'],
					bid: this.findingBid(x),
					add_chemicals: {data:x['chemicals']}
				}
			))
		})
		this.completionForm.patchValue({
			job_completed_date: this.dateFormat(this.job['job_completed_date']), 
			job_completed_notes:this.job['job_completed_notes']  
		})
	}
	lookupCode(event) {
		console.log("id",event.keyCode);
		if(event.keyCode==45){
		  const modalRef = this.modelService.open(LookupcodeComponent);
			modalRef.result.then((result) => {
				this.completionForm.patchValue({
					// job_completed_date: this.dateFormat(this.job['job_completed_date']), 
					job_completed_notes:result  
				})
			//   this.report.report_description_general=result;

			}).catch((error) => {
			  console.log(error);
		  });
		}
	  
	}
	// changeCrew(index,finding_id,crewid){
	// 	console.log({index,crewid,finding_id})
	// 	this.completionSet.at(index).patchValue({finding_perform_crew_id:59})
	// }
	// finding without completion
	onDateChange(date,type){
		if(type=='findings'){
			this.findingWithOutChemicals.forEach((item,index) => {
				this.completionSet.at(index).patchValue({finding_date_completed:date})		
			})
		}
		if(type=='use_chemicals'){
			this.findingWithChemicals.forEach((item,index) => {
				this.findinguseChemicals.at(index).patchValue({finding_date_completed:date})		
			})
		}		
	}
	ChangeSortOrder(data,type){	
		if(type=='findings'){
			this.findingWithOutChemicals.forEach((item,index) => {
				this.completionSet.at(index).patchValue({finding_perform_crew_id:data})		
			})
		}
		if(type=='use_chemicals'){
			this.findingWithChemicals.forEach((item,index) => {
				this.findinguseChemicals.at(index).patchValue({finding_perform_crew_id:data})		
			})
		}	
	}
	// complete_discount_hide:boolean
	completionStatus(event,index,value){
		if(value=='finding_partially_completed') {
			if(event ==false || event ==0){
				this.completionSet.at(index).patchValue({finding_completed:false})
			}
		} else if(value=='finding_completed') {
			if(event ==false || event ==0){
				this.completionSet.at(index).patchValue({finding_partially_completed:false})
			}
		}
	}
	findingBid(finding_item){
		// console.log(finding_item.finding_which_bid)
		var dis_bid=0
		var pbt=0
		var sbt=0
		var result;
		var no_bid="";
		var is_discount="";
		if (finding_item['finding_which_bid'] == 'primary' || finding_item['finding_which_bid'] == '' || finding_item['finding_bid_primary_or_secondary'] == 'primary') {
			if (finding_item['finding_bid_primary_type'] == 'no bid') {
				no_bid = "NO BID"
				if (finding_item['finding_bid_primary_alt_other'] != '') {
					result =  finding_item['finding_bid_primary_alt_other']
				} else {
					result =  finding_item['finding_bid_primary_alt']
				}
			} else {
				// DISCOUNT ///////////////////
				if (finding_item['finding_additional_discount'] != 0.00) {
					dis_bid = finding_item['finding_bid_primary'] - finding_item['finding_additional_discount'];
					pbt = pbt + dis_bid;
					result =   dis_bid ;
					is_discount ="discount"; 
					//*** */
				} else {
					
					pbt = pbt + finding_item['finding_bid_primary'];
					result =   finding_item['finding_bid_primary']
				}
			}
		} else {
			if (finding_item['finding_bid_secondary_type'] == 'no bid') {
				no_bid =  "NO BID";
				if (finding_item['finding_bid_secondary_alt_other'] != '') {
					result =   finding_item['finding_bid_secondary_alt_other']
				} else {
					result =   finding_item['finding_bid_secondary_alt']
				}
			} else {
				// DISCOUNT ///////////////////
				if (finding_item['finding_additional_discount'] != 0.00) {
					dis_bid = finding_item['finding_bid_secondary'] - finding_item['finding_additional_discount'];
						sbt = sbt + dis_bid;
						result =  dis_bid;
						is_discount ="discount"; 
						//*** */
				} else {		
					pbt = pbt + finding_item['finding_bid_secondary'];
					result =  finding_item['finding_bid_secondary']
				}
			}
		}
		return {type:no_bid,value:result,discount:is_discount}
	}
	// finding without completion
	dateFormat(date){
		// console.log(date)
		var d = new Date(date)
		let month = (d.getMonth()+1)
		let  day = d.getDate()
		let year = d.getFullYear()
		if(!isNaN(month)&&!isNaN(day)&&!isNaN(year)){
			return {
				"year": year,
				"month": month,
				"day": day
			}
		}
	}
	onSubmit(){
		this.submitted=true;
		if (this.completionForm.invalid) {
			return;
		}
		this.completionService.findingCompleted(this.jobId,this.completionForm.value).subscribe(
			data=>{
				if(data.data){
					// console.log("test",data)
					this._router.navigate(['inspections-job-review',this.jobId]);
				}		
			}
		)
	}
	//
    // Opening Report modal
    // 
    reportManagerOpen() {
	    const modalRef = this.modelService.open(ReportManagerComponent,{ size: 'lg' });
	    modalRef.componentInstance.job_id = this.jobId;

	    modalRef.result.then((result) => {
	      
	    }).catch((error) => {
	      
	    });
	}

	openFormModel(menuName: string){
		
		switch(menuName){
			case 'sub-contractors' : this.openComponentModel(SubContractorsComponent);
									 break;
			case 'chemicals' : this.openComponentModel(ChemicalsComponent);
							   break;
			case 'materials' : this.openComponentModel(MaterialsComponent);
							   break;
			case 'chem-application-hours' : this.openComponentModel(ChemAppHoursComponent);
											break;
			case 'crew-hours' : this.openComponentModel(CrewHoursComponent);
								break;
			case 'additional-work' : this.openComponentModel(AdditionalWorkPerformedComponent);
									 break;
			case 'findings' : this.openComponentModel(FindingsModelComponent);
							  break;
			default: break;
							
		}
	}
	openComponentModel(componentName){
		const modalRef = this.modelService.open(componentName,{ size: 'lg' });
							modalRef.componentInstance.job_id = this.jobId;
							modalRef.componentInstance.status = null;

							modalRef.result.then((result) => {
								console.log(result);
								if(result.data.page === 'additional-work'){
									this.additionalFindings = result.data.result_data;
								}else if(result.data.page === 'sub_contractors'){
									this.contractorMeta = result.data.result_data;
								}else if(result.data.page === 'add_chemicals'){
									this.chemPlusMeta = result.data.result_data;
								}else if(result.data.page === 'materials'){
									this.materialMeta = result.data.result_data;
								}else if(result.data.page === 'chem_application_hours'){
									this.chemMeta = result.data.result_data;
								}else if(result.data.page === 'crew_hours'){
									this.crewMeta = result.data.result_data;
								}else{ }
								this.totalHours()
							}).catch((error) => {
							
							});
	}
	openEditFormModel(menuName , id){
		switch(menuName){
			case 'additional-work-edit' : this.openComponentModelWithId(AdditionalWorkPerformedComponent, id, status='edit');
			break;
		}
	}
	openComponentModelWithId(componentName, id, status){
		const modalRef = this.modelService.open(componentName,{ size: 'lg' });
							modalRef.componentInstance.job_id = this.jobId;
							modalRef.componentInstance.status = status;
							modalRef.componentInstance.id = id;

							modalRef.result.then((result) => {
								if(result.data.page=="chemicals-applied"){
									// console.log("gg",result.data.result_data)
									var response = result.data.result_data
									response.forEach((item,index) => {
										this.findinguseChemicals.at(index).patchValue({add_chemicals: {data:item['chemicals']}})		
									})
									

								}else if(result.data.page=="additional-work"){
									this.additionalFindings = result.data.result_data;
								}else{ }
								 

							}).catch((error) => {
							
							});
	}

	openFormModelChemicalsApplied(finding_id){
		this.openComponentModelWithId(FindingsChemicalsAppliedModelComponent, finding_id, status='add-chem-applied');
	}

	onDeleteTask(id, status){
		let data = { id : id, job_id : this.jobId, status_ : status };
		Swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		  }).then((result) => {
			if (result.value) {
			
				this.onDelete(data, status);
			}
		  })
	}

	onDelete(data, status){
		if(status === 'additional-finding-delete'){
		this.completionService.onDeleteAdditionalWork(data).subscribe(
			res => {
				if(res){
					Swal(
						res.status.toUpperCase(),
						res.message,
						res.status
						  )
						  if(res.page === 'additional-work'){
						  		this.additionalFindings = res.result;
							}
					}
				}
			)
		}

		if(status === 'material-delete' || status === 'chem-delete' || status === 'crew-hours-delete' ||
		 status === 'chem-app-hours-delete' || status === 'sub-contractor-delete'){
			this.completionService.onDeleteJobMeta(data).subscribe(
				res => {
					if(res){
						Swal(
							res.status.toUpperCase(),
							res.message,
							res.status
							  )
							  if(res.page === 'material-delete'){
								  this.materialMeta = res.result;
							  }else if(res.page === 'chem-delete'){
								  this.chemPlusMeta = res.result;
							  }else if(res.page === 'crew-hours-delete'){
								  this.crewMeta = res.result;
							  }else if(res.page === 'chem-app-hours-delete'){
								  this.chemMeta = res.result;
							  }else if(res.page === 'sub-contractor-delete'){
								  this.contractorMeta = res.result;
							  }else{ }
						}
					}
				);
		}

	}
	totalCrewHours;
	totalchemHours;
	totalHours(){
		var data=0;
		var hour=0;
		this.crewMeta.forEach((item,index) => {
			data = data+ parseFloat(item['job_meta_crew_hours']);
		})
		this.totalCrewHours = data;

		this.chemMeta.forEach((item,index) => {
			hour = hour+ parseFloat(item['job_meta_chem_hours']);
		})
		this.totalchemHours = hour;
	}
	selector:boolean;
	onClickinside($event: Event){
		$event.preventDefault();
		$event.stopPropagation();  // <- that will stop propagation on lower layers
		this.selector=true
	}

    viewFinding(findingId) {
		const modalRef = this.modelService.open(ViewFindingComponent,{ size: 'lg' });
		modalRef.componentInstance.findingId = findingId;
	}

	@HostListener('document:click', ['$event']) 
	clickedOutside($event){
		this.selector=false
	}

	
	// date select event for completed date
    onDateSelect(event){
        if(this.lockoutSetting.date !== '') {
            if(event) {
                let d1_string = event.year+'-'+((event.month < 10) ? '0'+event.month : event.month)+'-'+((event.day < 10) ? '0'+event.day : event.day);
                let d1 = new Date(d1_string); 
                let d2 = new Date(this.lockoutSetting.date);
                if(d1 < d2) {
                    this.lockoutPopup();
                }
            }
        }
    }

	// open lockout pin verify modal
	lockoutPopup() {
		const modalRef = this.modalService.open(LockoutComponent);
		modalRef.componentInstance.lockoutSetting = this.lockoutSetting;
		modalRef.result.then((result) => {
			this.isLockoutVerified=result;
			if(!this.isLockoutVerified) {
			let d = new Date(this.lockoutSetting.date+' 23:59:59');
			this.completionForm.patchValue({job_completed_date: {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()}});
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
	lockoutSettings(){
		this.commonService.getLockoutSettings().subscribe(
			data => { 
				if(data) {
				this.isLockoutVerified = false;
				this.lockoutSetting = data;
				}
				else {
				this.isLockoutVerified = true;
				}
			}
		);
	}
	
}
