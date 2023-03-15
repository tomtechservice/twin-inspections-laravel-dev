import { Component, OnInit } from '@angular/core';

import { HeaderService } from '../header/header.service';

@Component({
  selector: 'abe-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  card={
    heading1:true,
    heading2:true,
    heading3:true,
    heading4:true,
    heading5:false,
    heading6:false,
    headingpayroll2:false,
    headingWidget:true,
    wantsEarlier:true,
  };
  head=false;
  constructor(private headerService: HeaderService) { 
   
  }
  userData;
  inspector=false;
  // Counter = 0;
  dateRange={
    job_cost:0,
    inspection_scheduled:0,
    payroll:0,
    payroll2:0,
    estimated:0
    
  }
  ngOnInit() {
    this.getData();
    this.getJobs();
    this.userData = JSON.parse(localStorage.getItem('user'));
    if(this.userData.user_level == 'inspector'){
      this.inspector = false;
    }else{
      this.inspector = true;
    }
  }
  jobdateRange(date){
    this.dateRange.job_cost = date;
    // localStorage.setItem('date_range', JSON.stringify(this.dateRange) );
  }
  inspectiondateRange(date){
    this.dateRange.inspection_scheduled = date; 
  }
  payrolldateRange(date){
    this.dateRange.payroll = date;  
  }
  payrolldateRange2(date){
    this.dateRange.payroll2 = date; 
  }
  estimateddateRange(date){
    this.dateRange.estimated = date;  
  }
  
  toggleHead(){
    this.head=true;
  }
  toggleCard() {
    this.head=false;
    localStorage.setItem('card', JSON.stringify(this.card) );
    localStorage.setItem('date_range', JSON.stringify(this.dateRange) );
 
  }
  getData(){
    if(localStorage.getItem("card") != null){
      this.card = (JSON.parse(localStorage.getItem("card")));
    }
    if(localStorage.getItem("date_range") != null){
      this.dateRange = (JSON.parse(localStorage.getItem("date_range")));
    
    } 
    
   
  }

    getJobs() {
      console.log('123')
      this.headerService.getTest()  
          .subscribe((data) => {
            console.log(data);
        });
    }
  // getStorage(val){
  //   return localStorage.getItem(val);
  // }
  // deleteStorage(val) {
  //   return localStorage.removeItem(val);
  // }

}
