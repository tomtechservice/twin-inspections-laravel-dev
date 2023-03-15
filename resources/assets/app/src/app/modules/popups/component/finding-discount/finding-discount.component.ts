import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-finding-discount',
  templateUrl: './finding-discount.component.html',
  styleUrls: ['./finding-discount.component.scss']
})
export class FindingDiscountComponent implements OnInit {
  @Input() finding_id;
  @Input() finding_discount;
  @Input() finding_discount_party;
  findingData = {
    finding_id : 0,
    finding_additional_discount : 0.00,
    finding_additional_discount_party : '',
  }
  constructor(
    public activeModal: NgbActiveModal,
    private modelService : NgbModal
  ) { }

  ngOnInit() {
    this.findingData.finding_id = this.finding_id; 
    this.findingData.finding_additional_discount = this.finding_discount; 
    this.findingData.finding_additional_discount_party = this.finding_discount_party; 
  }

  discountSubmit(){
    this.activeModal.close({case: 'add_discount',discountData : this.findingData})
    // console.log(this.findingData);
  }

  

}
