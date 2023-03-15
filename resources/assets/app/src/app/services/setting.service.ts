import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private apiURL = environment.api;
  public imagePath = environment.doSpace;
  constructor(private http: HttpClient) { }

  getSettingData():Observable<any> {
    return this.http.get(this.apiURL+'get_setting_data').pipe(
			map(res => res)
		);
  }

  setReportContent(settingId, data):Observable<any>{
    return this.http.post(this.apiURL+'set-report-content/'+settingId, data, httpOptions).pipe(
      map(res => res)
    );
  }

  setWorkReportHeader(settingId, data):Observable<any>{
    return this.http.post(this.apiURL+'set-work-report-header/'+settingId, data, httpOptions).pipe(
      map(res => res)
    );
  }

  setFindingsReportContent(settingId, data):Observable<any>{
    return this.http.post(this.apiURL+'set-findings-report-content/'+settingId, data, httpOptions).pipe(
      map(res => res)
    );
  }

  setFindingsReportHeader(settingId, data):Observable<any>{
    return this.http.post(this.apiURL+'set-findings-report-header/'+settingId, data, httpOptions).pipe(
      map(res => res)
    );
  }

  setStateLawSection(settingId, data):Observable<any>{
    return this.http.post(this.apiURL+'set-state-law-section/'+settingId, data, httpOptions).pipe(
      map(res => res)
    );
  }
  

}
