import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiURL = environment.api;
  private doSpace = environment.doSpace;
  private apiSite = environment.apiSite;

  constructor(private http: HttpClient) { }

  getReportDatas(jobId):Observable<any> {
    console.log(jobId)
    return this.http.get(this.apiURL+'reportdocs/'+jobId); 
  }

  // downloadDoc(params):Observable<any> {
  //   console.log(params); 
  //   return this.http.post<any>(this.apiURL+'downloadDoc',params,httpOptions)
  // }

  downloadDoc (data){
    
    return this.apiSite+'pdf/download?url=media/reports/'+data.jobId+'/'+data.docName;
  }
}
