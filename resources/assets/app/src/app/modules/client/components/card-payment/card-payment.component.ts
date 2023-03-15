import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {Router,ActivatedRoute } from '@angular/router';
import {AccountServicesService} from '../../services/account-services.service';
import { FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss']
})
export class CardPaymentComponent implements OnInit,OnChanges {

	@Input() notice:string;
	clientId;
	cardList=[];
	payments=[];
	submitted=false;
	success_message;
	error_message;
	loader = false;
	
  	constructor(
  		private fb: FormBuilder,
	  	private _router: Router,
	    private router: ActivatedRoute,
	    private account: AccountServicesService
  	) { }
  	cardDetailsForm = this.fb.group({
	    payment_amount:['',Validators.required],
	    payment_profile_id:['',Validators.required],
  	});
  	ngOnInit() {
  		this.router.params.subscribe(params => {
      		if (params.clientId) {
	       		this.clientId = params.clientId;
	       		this.getAllCards(this.clientId);
	       		this.getPayments(this.clientId);
	      	}
  		})
  	}
  	ngOnChanges(){ 
	    // date range check from dashboard
	    if(this.notice){
	      	this.getAllCards(this.clientId);
	    }
	}
  	getAllCards(clientId){
	    this.account.cardList(clientId)
	    .subscribe(
	      	data=>{
	        	this.cardList = data.data;
	      	}
	    );
  	}
  	getPayments(clientId){
	    this.account.payments(clientId)
	    .subscribe(
	      	data=>{
	        	this.payments = data.data;
	      	}
	    );
  	}
  	onSubmit(){
	    this.submitted = true;
	    this.loader = true;
	    if (this.cardDetailsForm.invalid) {
	    	this.loader = false;
	      	return;
	    }
	    this.success_message = '';
	    this.error_message = '';
	    this.account.chargeCard(this.cardDetailsForm.value, this.clientId)
	    .subscribe(
	      	data => {
		        this.getPayments(this.clientId);
		        this.success_message= data.message;
		        this.cardDetailsForm.reset({
		        	payment_profile_id : ['']
		        });
		        this.submitted = false;
		        this.loader = false;
		        setTimeout(() => {
			        this.success_message = '';
			    }, 2500);
	      	},error=>{
	        	this.error_message = error;
	        	this.loader = false;
	        	setTimeout(() => {
			        this.error_message = '';
			    }, 2500);
	      	}
	    );
	    
	}

}
