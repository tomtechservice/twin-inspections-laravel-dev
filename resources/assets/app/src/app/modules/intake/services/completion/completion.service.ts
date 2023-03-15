import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

const httpOptions = {
  	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CompletionService {
	private apiURL = environment.api;
  	constructor(private http: HttpClient) { }

  	completionFindings(jobId):Observable<any> {
		return this.http.get(this.apiURL+'completion/get/'+jobId).pipe(
			map(res => res)
		)
	}

	addContractors(data):Observable<any> {
		return this.http.post(this.apiURL+'job-meta/add-contractors',data, httpOptions);
	}

	getChemicals():Observable<any>{
		return this.http.get(this.apiURL+'chemicals/get-chemicals').pipe(
			map(res => res)
		)
	}
	addAdditionalChemicals(data):Observable<any>{
		return this.http.post(this.apiURL+'job-meta/add-additional-chemicals',data, httpOptions);
	}
	getChemicalUnit(chemical_id):Observable<any>{
		return this.http.get(this.apiURL+'chemicals/get-chemical-unit/'+chemical_id).pipe(
			map(res => res)
		);
	}
	doMaterialsMeta(data): Observable<any>{
		return this.http.post<any>(this.apiURL+'job-meta/do-materials-meta', data, httpOptions);
	}
	doChemHoursMeta(data): Observable<any>{
		return this.http.post<any>(this.apiURL+'job-meta/do-chem-hours-meta', data, httpOptions);
	}
	doJobCrew(data): Observable<any>{
		return this.http.post<any>(this.apiURL+'job-crew/do-job-crew',data, httpOptions);
	}
	doAdditionalWork(data) : Observable<any>{
		return this.http.post<any>(this.apiURL +'finding-additional-work/do-additional-work', data, httpOptions);
	}
	getFindingAdditionalWork(id) : Observable<any>{
		return this.http.get<any>(this.apiURL+'finding-additional-work/get-additional-work/'+id).pipe(
			map(res => res)
		);
	}
	updateAdditionalWorkPerformed(data) : Observable<any>{
		return this.http.post<any>(this.apiURL+'finding-additional-work/update-additional-work', data, httpOptions);
	}
	doChemicalsApplied(data) : Observable<any>{
		return this.http.post<any>(this.apiURL+'job-meta/do-chemicals-applied', data, httpOptions);
	}
	onDeleteAdditionalWork(data): Observable<any>{
		return this.http.post<any>(this.apiURL+'finding-additional-work/delete-additional-work', data, httpOptions);
	}
	onDeleteJobMeta(data): Observable<any>{
		return this.http.post<any>(this.apiURL+'job-meta/on-delete-job-meta', data, httpOptions);
	}
	getChemicalsApplied(jid,fid) : Observable<any>{
		return this.http.get( `${this.apiURL}job-meta/get/${jid}/${fid}`).pipe(
			map(res => res)
		)
	}
	findingCompleted(jid,data){
		return this.http.put<any>(`${this.apiURL}finding/update/${jid}`, data, httpOptions);
	}

}
