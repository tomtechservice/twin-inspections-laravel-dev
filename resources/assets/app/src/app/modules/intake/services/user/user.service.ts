import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = environment.api;

  authKey:any;

  constructor(
    private http: HttpClient
  ) { }

  getContractorsList(): Observable<any>{
    return this.http.get(this.apiURL+'get-contractors-list');
  }
  getCrewTreaterList(): Observable<any>{
    return this.http.get<any>(this.apiURL+'get-crew-treater-list');
  }
  getCrewListSpec(): Observable<any>{
    return this.http.get<any>(this.apiURL+'get-crew-list-spec');
  }
  getAssigneeList():Observable<any> {
    return this.http.get(this.apiURL+'getAssigneeList');  
  }
}
