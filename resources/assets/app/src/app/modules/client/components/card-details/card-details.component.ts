import { Component, OnInit,Output,Input, EventEmitter  } from '@angular/core';
import { FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';
import {Router,ActivatedRoute } from '@angular/router';
import {AccountServicesService} from '../../services/account-services.service';
import {CommonService} from '../../../intake/services/common/common.service';
@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {
  @Input() client_id;
  states: string[];
  @Output () notify: EventEmitter<string> = new EventEmitter<string>();
  year=[];
  submitted=false;
  loader = false;
  clientId;
  error_message='';
  success_message='';
  cardDetailsForm = this.fb.group({
    // card_name: ['',Validators.required],
    // Validators.pattern("^[0-9]*$")
    card_number: ['',Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    exp_day:['',Validators.required],
    exp_year:['',Validators.required],
    cvv:['',Validators.compose([Validators.required, Validators.maxLength(3)])],
    billing_address:true,
    shipping_address:true,
    address_billing:this.fb.group({
      billing_first_name:[''],
      billing_last_name:[''],
      billing_company_name:[''],
      billing_address1:[''],
      billing_city:[''],
      billing_state:['CA'],
      billing_zip:[''],
      billing_phone:[''],
    }),
    address_shipping:this.fb.group({
      shipping_first_name:[''],
      shipping_last_name:[''],
      shipping_company_name:[''],
      shipping_address1:[''],
      shipping_city:[''],
      shipping_state:['CA'],
      shipping_zip:[''],
      shipping_phone:[''],
    })
    
  });
  constructor(private fb: FormBuilder,
    private _router: Router,
    private router: ActivatedRoute,
    private account: AccountServicesService,
    private commonService: CommonService
    ) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      console.log(params.clientId);
      if (params.clientId) {
       this.clientId = params.clientId;
      }else{
        this.clientId = this.client_id;
      }

  })
    this.getYear();
    this.getStates();
    this.formControlValueChanged();
    this.cardDetailsForm.get('billing_address').patchValue(false);
  }
  getYear() {
  var d = new Date();
  var n = d.getFullYear();
  console.log(n);
    for(var i = 0;i<50;i++) { 
      this.year.push(n+i)
    }
  }
  onSubmit(){
    console.warn(this.cardDetailsForm.value);
    // debugger;
    this.submitted = true;
    this.loader = true;
    if (this.cardDetailsForm.invalid) {
      this.loader = false;
      return;
    }
    this.account.cardDetails(this.cardDetailsForm.value,this.clientId)
    .subscribe(
      data => {
        this.success_message= data.message;
        this.error_message = '';
        this.submitted = false;
        // reset form
        this.cardDetailsForm.reset({
          exp_day:[''],
          exp_year:[''],
          billing_address:true,
          shipping_address:true,
        });
        this.cardDetailsForm.value.address_billing.billing_state=['CA'];
        this.cardDetailsForm.value.address_shipping.shipping_state=['CA'];
        // ! reset form 

        this.notify.emit(data);
        this.loader = false;
        setTimeout(() => {
          this.success_message='';
        }, 2500);
        // this._router.navigate(['account/carddetails/65']) 
      },error=>{
        this.error_message = error;
        this.success_message= '';
        this.loader = false;
        setTimeout(() => {
          this.error_message='';
        }, 2500);

      }
    );  
  }
  getStates() {
    this.commonService.getState().subscribe(
        data => {
            this.states = data as string[];
        }
    );
  }
  // address_submitted=true;
  formControlValueChanged() { 
    const billingName = this.cardDetailsForm.get('address_billing.billing_first_name');
    const billingAddress = this.cardDetailsForm.get('address_billing.billing_address1');
    const billingCity = this.cardDetailsForm.get('address_billing.billing_city');
    const billingZip = this.cardDetailsForm.get('address_billing.billing_zip');
    this.cardDetailsForm.get('billing_address').valueChanges.subscribe(
    (mode: boolean) => {
        console.log("test mode",mode);
        if (mode === false) {
            billingName.setValidators([Validators.required]);
            billingAddress.setValidators([Validators.required]);
            billingCity.setValidators([Validators.required]);
            billingZip.setValidators([Validators.required]);
        }
        else {
            billingName.clearValidators();
            billingAddress.clearValidators();
            billingCity.clearValidators();
            billingZip.clearValidators();
            // this.submitted = false;
        }
        billingName.updateValueAndValidity();
        billingAddress.updateValueAndValidity();
        billingCity.updateValueAndValidity();
        billingZip.updateValueAndValidity();
    });

    const shippingName = this.cardDetailsForm.get('address_shipping.shipping_first_name');
    const shippingAddress = this.cardDetailsForm.get('address_shipping.shipping_address1');
    const shippingCity = this.cardDetailsForm.get('address_shipping.shipping_city');
    const shippingZip = this.cardDetailsForm.get('address_shipping.shipping_zip');

    this.cardDetailsForm.get('shipping_address').valueChanges.subscribe(
    (mode: boolean) => {
        console.log(mode);
        if (mode === false) {
            shippingName.setValidators([Validators.required]);
            shippingAddress.setValidators([Validators.required]);
            shippingCity.setValidators([Validators.required]);
            shippingZip.setValidators([Validators.required]);
        }
        else {
            shippingName.clearValidators();
            shippingAddress.clearValidators();
            shippingCity.clearValidators();
            shippingZip.clearValidators();
            // this.submitted = false;
        }
        billingName.updateValueAndValidity();
        shippingAddress.updateValueAndValidity();
        shippingCity.updateValueAndValidity();
        shippingZip.updateValueAndValidity();
    });
  }
  closeModal(event) {
    this.notify.emit(event);  
  }
}

 
