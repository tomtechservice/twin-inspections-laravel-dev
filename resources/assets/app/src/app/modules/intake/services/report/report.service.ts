import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {Report} from '../../report';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class ReportService {

	private apiURL = environment.api;
  	constructor( private http: HttpClient ) { 
  		
  	}
  	getReportUsingJobId(jobId):Observable<any> { 
	    return this.http.get(this.apiURL+'report/'+jobId);
	}
	postReport(data: Report):Observable<Report>{
		return this.http.post<Report>(this.apiURL+'post_report',data,httpOptions)
	}
	getJobReport(job_id):Observable<any>{
    return this.http.get(environment.api+'get_job_report/'+job_id);
	}
	generateNoc(data):Observable<any>{
		return this.http.post(this.apiURL+'generate_noc',data,httpOptions)
	}
}
