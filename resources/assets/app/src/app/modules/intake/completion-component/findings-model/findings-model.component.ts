import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-findings-model',
  templateUrl: './findings-model.component.html',
  styleUrls: ['./findings-model.component.scss']
})
export class FindingsModelComponent implements OnInit {
  @Input() job_id;
  @Input() status;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
