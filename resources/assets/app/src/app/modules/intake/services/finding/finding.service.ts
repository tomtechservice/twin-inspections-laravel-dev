import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';

const httpOptions = {
  	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const PARAMS = new HttpParams({
	fromObject: {}
  });

@Injectable({
  	providedIn: 'root'
})
export class FindingService {

	  private apiURL = environment.api;
	  public imagePath = environment.doSpace;
  	constructor(private http: HttpClient) { }

  	getFindings(jobId):Observable<any> {
    	return this.http.get(this.apiURL+'jobfindings/'+jobId).pipe(
      		map(res => res) 
    	);
  	} 
	
	getFindingsForJobInfo(jobId):Observable<any> {
    	return this.http.get(this.apiURL+'jobinfofindings/'+jobId).pipe(
      		map(res => res) 
    	);
  	}  
	
	getJobFindings(jobId):Observable<any> {
	    return this.http.get(this.apiURL+'findings/job/'+jobId).pipe(
	      	map(res => res) 
	    );
	}

	getFindingCodes(term: string){
        if (term === '') {
			return of([]);
		  }
	  
		  return this.http
			.get(this.apiURL+'get_finding_codes', {params: PARAMS.set('search', term)}).pipe(
			  map(response => response)
			);
	}

	getFindingCodeDatas(codeId) {
    return this.http.get(this.apiURL+'finding_code_data/'+codeId).pipe(
			map(res => res)
		);
	}
	addFindings(finding) {
		return this.http.post<number>(this.apiURL+'add_finding',finding, httpOptions).pipe(
      map(res => res) 
    );
	}
	findingData(findingId):Observable<any> {
		return this.http.get(this.apiURL+'getfinding/'+findingId).pipe(
			map(res => res)
		)
	}

	bidPrimarySave(findingData):Observable<any> { 
		return this.http.post(this.apiURL+'finding_primary_bid',findingData, httpOptions).pipe(
			map(res => res)
		)
	}
	bidSecondarySave(findingData):Observable<any> { 
		return this.http.post(this.apiURL+'finding_secondary_bid',findingData, httpOptions).pipe(
			map(res => res)
		)
	}

	deleteFinding(findingId):Observable<any> {
		return this.http.get(this.apiURL+'deletefinding/'+findingId).pipe(
		   map(res => res)
		)
	}

	jobData(jobId):Observable<any> {
		return this.http.get(this.apiURL+'get_job/'+jobId).pipe(
			map(res => res)
		)	
	}

	parentFinding(job_ref_parent) {
		return this.http.get(this.apiURL+'get_findings_parent/'+job_ref_parent).pipe(
			map(res => res)
		)
	}
	getFindingImage(findingId):Observable<any> {
        return this.http.get(this.apiURL+'getFindingsImages/'+findingId).pipe(
			map(res => res)
		)
	}
	deleteFindingImage(finding_image_id):Observable<any> {
        return this.http.get(this.apiURL+'deleteFindingsImages/'+finding_image_id).pipe(
			map(res => res)
		)
	}

	
	generateReport (data): Observable<any> {
    	return this.http.post(this.apiURL+'findinggenerateReport', data, httpOptions)
  	}

	autoFillFindData(jobId):Observable<any> {
		return this.http.get(this.apiURL+'autoFillFinding/'+jobId).pipe(
			map(res => res)
		)	
	}

	setPerformFindings (perform_case,paramData): Observable<any> {
	   let data = {
		performCase : 0,
		findingData : {} 
	   };
	   data.performCase = perform_case	
	   data.findingData = paramData	
	   return this.http.post(this.apiURL+'setPerformFindings', data, httpOptions);
	}   
	getFindingCompletedNotPosted (jobId : number): Observable<any> {
		return this.http.get<any>(this.apiURL+'get-findings-completed-not-posted/'+jobId).pipe(
			map(res => res)
		)
	}
	getFindCrewCommission(data): Observable<any>{
		return this.http.post<any>(this.apiURL+'get-finding-crew-commission',data , httpOptions)
	}
	makeJobCardPDF(pdfData): Observable<any> {
     return this.http.post(environment.api+'makeJobCardPDF', pdfData, httpOptions);
	}
	
	  
}
