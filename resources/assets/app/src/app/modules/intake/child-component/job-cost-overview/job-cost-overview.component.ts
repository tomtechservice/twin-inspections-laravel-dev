import { Component, OnInit,Input } from '@angular/core';
import { JobService } from '../../services/job/job.service';
@Component({
  selector: 'app-job-cost-overview',
  templateUrl: './job-cost-overview.component.html',
  styleUrls: ['./job-cost-overview.component.scss']
})
export class JobCostOverviewComponent implements OnInit {
  @Input() job_id
  jobDetails:{
    chem_cost_perc: any,
    chem_tot:any,
    chem_wages_perc: any,
    crew_tot: any,
    crew_wages_perc: any,
    insp_comm_perc: any,
    mat_perc: any,
    report: any,
    subcon_tot:any,
    subcon_tot_tot: any,
    tot_all_perc: any,
    tot_charges: any,
    tot_chem_cost: any,
    tot_crew_cost: any
  };
  estimated:{
    ahours:number,
    amats:any,
    ehours:any,
    emats:any,
    perc_hours:any,
    perc_mats:any
  };
  constructor(public jobService:JobService,) { }

  ngOnInit() {
    this.makeJobCosting()
  }
  makeJobCosting(){
    this.jobService.makeJobCosting(this.job_id).subscribe(
      data => {
        this.jobDetails = data.data.job;
        this.estimated = data.data.estimated;
        // console.log(data)
      }
    );
  }
}
