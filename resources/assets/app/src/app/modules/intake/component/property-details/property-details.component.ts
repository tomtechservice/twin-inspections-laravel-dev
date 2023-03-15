import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {
  @Input() intakeTab;
  constructor() { }

  ngOnInit() {
  }
  nextPage(){
  		
    this.intakeTab.select('tab-selectbyid4');
 }

}