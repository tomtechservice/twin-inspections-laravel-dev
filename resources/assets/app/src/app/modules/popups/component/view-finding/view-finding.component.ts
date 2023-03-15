import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FindingService } from '../../../intake/services/finding/finding.service'
import {Observable, of} from 'rxjs';
import { findingData } from '../../../popups/findings-default'

@Component({
  selector: 'app-view-finding',
  templateUrl: './view-finding.component.html',
  styleUrls: ['./view-finding.component.scss']
})
export class ViewFindingComponent implements OnInit {
  
  @Input() findingId;
  finding = findingData.finding
  constructor(public activeModal: NgbActiveModal,private findingService : FindingService) { }

  ngOnInit() {
    this.findingData();
  }

  findingData(){
    this.findingService.findingData(this.findingId).subscribe(
      data => {
        this.finding = data;
      }
    )
  }

}
