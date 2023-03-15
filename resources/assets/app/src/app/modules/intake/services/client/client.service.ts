import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import {Observable} from 'rxjs/Observable';
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
export class ClientService {

  private apiURL = environment.api;
  public dateData = {};
  
  constructor(private http: HttpClient) {
     
  }
  searchClient (data): Observable<any> {
    return this.http.post<any>(this.apiURL+'search_client', data, httpOptions);
  }
  newClientOrder (data): Observable<any> {
    return this.http.post<any>(this.apiURL+'new_order', data, httpOptions);
  }
  
  getAllClients():Observable<any> {
    return this.http.get(this.apiURL+'all_clients');
  }
  getClients(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(this.apiURL+'get_clients', {params: PARAMS.set('search', term)}).pipe(
        map(response => response)
      );
  }
  getLead():Observable<any> {
    return this.http.get(this.apiURL+'all_lead');
  }
  getOrder(job_id,intakeTab):Observable<any> {
    return this.http.get(this.apiURL+'get_order/'+job_id+'/'+intakeTab).pipe(
       map(response => response)
    );
  }

  getClient(clientId):Observable<any>{
    return this.http.get(`${this.apiURL}client/edit/`+clientId);
  }  
  getJobClient(clientId):Observable<any>{
    return this.http.get(this.apiURL+'client/get_client/'+clientId).pipe(
      map(response => response)
    )
  }
  removeClient(job_id,intakeTab):Observable<any>{
    return this.http.get(`${this.apiURL}client/remove_client/${job_id}/${intakeTab}`).pipe(
      map(response => response)
    )
  }
  
  getPreferredInspectors(client_id):Observable<any>{
    return this.http.get(`${this.apiURL}client/preferred_inspectors/`+client_id);
  }

}
