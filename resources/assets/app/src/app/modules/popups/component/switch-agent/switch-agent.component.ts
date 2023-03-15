import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../reports/services/common/common.service';
import { SwitchAgentService } from '../../services/switch-agent/switch-agent.service';
import { AgentSchedule } from '../../agent-schedule';
import { ScheduleService } from '../../../intake/services/schedule/schedule.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-switch-agent',
  templateUrl: './switch-agent.component.html',
  styleUrls: ['./switch-agent.component.scss']
})
export class SwitchAgentComponent implements OnInit {
	modal_title="Change Inspector and Schedule";
    inspectors = [];
    submitted = false;

    @Input() job;
    schedule = new AgentSchedule(null, '', '', '', null);
    
    spinners = false;
    meridian = true;

    saved = false;

    from_date_str = '';
    from_time_str = '';
    to_time_str = '';
  	constructor(
  		private commonService: CommonService,
   	 	public activeModal: NgbActiveModal,
   	 	private agentService: SwitchAgentService,
        private scheduleService: ScheduleService,
  	) { }

  	ngOnInit() {
      this.getInspectors();
      this.getJob();
  	}

  	closeModal() {
        if(this.saved){
            this.activeModal.close(0);
        } else {
            this.activeModal.close(1);
        }
		
  	}
    formatDate(dt){
        if(dt){
            return dt.month+'-'+dt.day+'-'+dt.year;
        }
        
    }
    onDateChange(){
        if (this.schedule.from_date != null) {
            this.schedule.from_date = null;
        }
    }
    getJob(){
        let jobId = this.job.jobId;
        this.scheduleService.getSchedule(jobId).subscribe(
            data => {
                if (data) {
                    this.from_date_str = this.formatDate(data.from_date);
                    this.from_time_str = data.from_time
                    this.to_time_str = data.to_time
                }
            }
        );
    }
    getInspectors(){
        this.commonService.getInspectors().subscribe(
            data => {
                this.inspectors = data;
            }
        );
    }
    scheduleSubmit() {

        this.submitted = true;
        this.schedule.job_id = this.job.jobId;
        this.scheduleService.switchAgent(this.schedule).subscribe(
            data => {
                if(data.data == 'error'){
                    
                } else {
                    this.saved = true;
                    Swal({
                        title: 'Message',
                        text: 'Saved sucessfully'
                    })
                }
                
            }
        );
    }

}
