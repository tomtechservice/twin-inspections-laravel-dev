import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Schedule } from '../../schedule';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  	private apiURL = environment.api;

  	constructor( private http: HttpClient ) {

  	}

  	/*
  	Search api - Avaialble schedules in that day
  	 */
  	getData(query):Observable<any> {
	    return this.http.get(this.apiURL+'schedule/search?'+query);
	}
	/*
  	Magin Custom Search - Slots and Agents
  	 */
	searchAvailable(query):Observable<any> {
	    return this.http.get(this.apiURL+'schedule/search-available?'+query);
	}

	checkAgentAvailability(query):Observable<any> {
	    return this.http.post(this.apiURL+'schedule/check-agent-schedule', query, httpOptions);
	}

	/*
  	Simple Save/Update schedule
  	 */
	addSchedule (dataOne): Observable<any> {
		return this.http.post(environment.api+'schedule/add', dataOne, httpOptions)

	}


  /*
    Agent Switching
     */
  switchAgent (data): Observable<any> {
    return this.http.post(environment.api+'schedule/switch-agent', data, httpOptions)

  }
	/*
  	Schedule api data of a job
  	 */
	getSchedule(job_id):Observable<any> {
		return this.http.get(environment.api+'schedule/get/'+job_id);
	}

	/*
  	Get Total Inspection Minutes for a job
  	 */
	getInspectionMinutes(job_id):Observable<any> {
		return this.http.get(environment.api+'schedule/minutes/'+job_id);
	}
    /*
    Search Date Api
     */
    getAvailDate():Observable<any> {
        return this.http.get(environment.api+'schedule/search-date');
    }

    /*
      get Inspector Calendar Status
       */
    getCalendarStatus(inspectorId):Observable<any> {
        return this.http.get(environment.api+'schedule/calendar-status/'+inspectorId);
		}

		/*
      get Inspector Calendar Status
       */
	  getOfficeCalendarStatus(inspectorId):Observable<any> {
        return this.http.get(environment.api+'schedule/office-calendar-status/'+inspectorId);
		}

		/*
		 hold transaction list
		*/
		getAuthorizeTransactionListJob(jobId):Observable<any> {
			return this.http.get(environment.api+'transaction/list/'+jobId);
		}
    /*
    Cancel Hold Payment
     */
    cancelHoldPayment (data): Observable<any> {
      return this.http.post(environment.api+'transaction/cancel', data, httpOptions)
    }
}
