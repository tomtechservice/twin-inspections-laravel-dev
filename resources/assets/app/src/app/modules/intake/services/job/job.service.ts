import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Job } from '../../job';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiURL = environment.api;
    authKey: any;
    constructor(
        private http: HttpClient) { }
    public getJob(jid): Observable<any> {
        return this.http.get(this.apiURL + 'getJobWithRelation/' + jid);
    }
    public addInspectionCompleted(data): Observable<Job> {
        return this.http.post<Job>(environment.api + 'inspection-completed', data, httpOptions);
    }
    public getJobClient(jid): Observable<any> {
        return this.http.get(this.apiURL + 'getJobClient/' + jid);
    }

    public getAllJobs(jobId): Observable<any> {
        return this.http.get(this.apiURL + 'getAllJobs/' + jobId);
        // .pipe(
        //   map(response => response)
        // );
    }

    public getReportDatas(jobId): Observable<any> {
        return this.http.get(this.apiURL + 'getJobWithRelation/' + jobId);
    }
    public accounting(jobId): Observable<any> {
        return this.http.get(this.apiURL + 'job/accounting/' + jobId);
    }
    public getjobDetails(jobId): Observable<any> {
        return this.http.get(this.apiURL + 'job/detials/' + jobId);
    }
    public changeJobStatus(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/status/' + jobId, data, httpOptions);
    }
    public changeJobReportPayment(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/report-payment/' + jobId, data, httpOptions);
    }
    public changeEscrow(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/escrow/' + jobId, data, httpOptions);
    }
    public changeInspectionType(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/inspection_type/' + jobId, data, httpOptions);
    }
    public changeInspector(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/change_inspector/' + jobId, data, httpOptions);
    }
    public managerNote(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/manager_note/' + jobId, data, httpOptions);
    }
    public additionalNote(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/additional_note/' + jobId, data, httpOptions);
    }
    public makeJobCosting(jobId): Observable<any> {
        return this.http.get(this.apiURL + 'job/job_cost/' + jobId);
    }
    public newInspection(data): Observable<any> {
        return this.http.post(this.apiURL + 'job/new_inspection', data, httpOptions);
    }
    public generatePdf(data): Observable<any> {
        return this.http.post(this.apiURL + 'report/gererate_pdf', data, httpOptions);
    }
    public encript(jobId): Observable<any> {
        return this.http.get(this.apiURL + 'job/encript/' + jobId);
    }


    public getJobForJobinfo(jid): Observable<any> {
        return this.http.get(this.apiURL + 'getjobforjobinfo/' + jid);
    }

    // public setJobAsCompleted(data) : Observable<any> {
    //   return this.http.post<any>(this.apiURL+'set-job-status', data, httpOptions);
    // }

    public setJobAsCompleted(data): Observable<any> {
        return this.http.post<any>(this.apiURL + 'job-completed', data, httpOptions);
    }

    public downloadNoc(data): any {
        // return this.http.post(this.apiURL+'download-noc',data, { responseType: "blob", headers: new HttpHeaders().append("Content-Type", "application/json") });
        this.authKey = localStorage.getItem('app_token');

        const httpOptions_ = {
            responseType: 'blob' as 'json',
            headers: new HttpHeaders({
                'Authorization': this.authKey,
            })
        }

        return this.http.post(this.apiURL + 'download-noc', data, httpOptions_);
    }
    public getJobDataBySearch(term) {
        if (term === '') {
            return of([]);
        } else {

            return this.http
                .get(this.apiURL + 'get-job-data', { params: PARAMS.set('search', term) }).pipe(
                    map(response => response)
                );

        }
    }
    getBranch(data): Observable<any> {
        return this.http.get<any>(this.apiURL + 'branch/get-branch/' + data);
    }
    public postJobinfo(jobData): Observable<any> {
        return this.http.post<Job>(environment.api + 'postJobinfo', jobData, httpOptions);

    }

    public changeAdditionalNoteStatus(data, jobId): Observable<any> {
        return this.http.post(this.apiURL + 'job/additional_note_status_change/' + jobId, data, httpOptions);
    }

}
