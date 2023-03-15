import { Component, OnInit,ViewChild } from '@angular/core';


@Component({
  selector: 'app-inspection-reports',
  templateUrl: './inspection-reports.component.html',
  styleUrls: ['./inspection-reports.component.scss']
})
export class InspectionReportsComponent implements OnInit {
  additional_recip_show = false;
  content; 
  // @ViewChild('tinymce') tinymce;
  constructor() { }

  ngOnInit() {
  }
  
// ngAfterViewInit() {
//   console.log(this.tinymce);
// }
  
 
  

}
