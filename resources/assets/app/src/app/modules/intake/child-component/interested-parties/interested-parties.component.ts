import { Component, OnInit, Input } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ChangeEscrowComponent} from '../change-escrow/change-escrow.component';
@Component({
  selector: 'app-interested-parties',
  templateUrl: './interested-parties.component.html',
  styleUrls: ['./interested-parties.component.scss']
})
export class InterestedPartiesComponent implements OnInit {
  @Input() job: any;  
  constructor(
    config : NgbModalConfig,
    private modalService: NgbModal
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
  }
  openFormModal() {
    const modalRef = this.modalService.open(ChangeEscrowComponent);
    modalRef.componentInstance.job = this.job;
    modalRef.result.then((result) => {
     this.job['job_escrow_number']= result.job_escrow_number
     this.job['job_escrow_closing_date']= result.job_escrow_closing_date
    }).catch((error) => {
        console.log(error);
    });
  }

}
