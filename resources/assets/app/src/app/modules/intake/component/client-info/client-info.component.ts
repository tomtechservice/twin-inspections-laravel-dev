import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit {
	page_title="Inspection: Responsible Parties"
	@ViewChild('intakeTab') ngbTabSet;
  	constructor(
        private  _router : Router,
        private  router : ActivatedRoute
    ) { }

  	new_tab:any;
  	selectedTab:any;
    jobId:any;
  	ngOnInit() {
  	    this.router.params.subscribe(params => { 
            if(!params.jobId){
                localStorage.setItem('new_tab', JSON.stringify('buyer_agent_id') );
            } else {
                this.jobId = params.jobId;
            }
        })
  	}
  	ngAfterViewInit() {
  		setTimeout(()=>{
      		if(localStorage.getItem("new_tab") != null){
				this.new_tab = (JSON.parse(localStorage.getItem("new_tab")));
				this.selectedTab = this.new_tab
                localStorage.removeItem('new_tab');
			} else {
				this.selectedTab = 'buyer_agent_id';
			}
 		}, 500);
	    
  	}
  	public beforeChange($event: NgbTabChangeEvent) {
        if(!this.jobId){
            localStorage.setItem('new_tab', JSON.stringify($event.nextId) );
            this.selectedTab = $event.nextId;
        }
  		
	}

}
