import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HeaderComponent as IntakeHeaderComponent } from '../header/header.component'

@Component({
  selector: 'app-inspections-order',
  templateUrl: './inspections-order.component.html',
  styleUrls: ['./inspections-order.component.scss']
})
export class InspectionsOrderComponent implements OnInit {
  registerForm: FormGroup;
  orderBySubmitted = false;
  order_by = {
    lookup_first_name:'',
    lookup_last_name:''
  };
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  onSubmit() {
    this.orderBySubmitted = true;
    console.log("hgjgh");
  }

}
