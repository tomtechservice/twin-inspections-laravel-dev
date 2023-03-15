import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../services/job/job.service';
import { NgbDateStruct, NgbCalendar,NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../reports/component/inspections-scheduled/ngb-date-fr-parser-formatter";
@Component({
  selector: 'app-change-escrow',
  templateUrl: './change-escrow.component.html',
  styleUrls: ['./change-escrow.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ChangeEscrowComponent implements OnInit {
  title="Change Escrow Info"
  @Input() job
  escrow={
    job_escrow_number:'',
    job_escrow_closing_date:{}
  }
  constructor(
    public activeModal: NgbActiveModal,
    public jobService:JobService,
    private calendar: NgbCalendar,
  ) { }

  ngOnInit() {
    console.log("fine",this.job)
    this.escrow.job_escrow_number = this.job.job_escrow_number
    
    this.escrow.job_escrow_closing_date = this.dateFormat(this.job.job_escrow_closing_date)
    
    // this.escrow.job_escrow_closing_date = this.job.job_escrow_closing_date
  }
  
  submitEscrow(){
    // console.log(this.status)
    this.jobService.changeEscrow(this.escrow ,this.job.job_id).subscribe(
      data => {
        console.log()
        this.activeModal.close(data.data);
      //  this.job = data as string[];
      //  console.log(data)
      }
    );
  }
  dateFormat(date){
    var d = new Date(date)
    let month = (d.getMonth()+1)
    let  day = d.getDate()
    let year = d.getFullYear()
    return {
        "year": year,
        "month": month,
        "day": day
      }
  }
 

}
