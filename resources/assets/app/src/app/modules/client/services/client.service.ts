import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import {environment} from '../../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiURL = environment.api;
  constructor(private http: HttpClient) { }
  addClient(data,client_id):Observable<any>{
    return this.http.post(`${this.apiURL}client/add/`+client_id,data,httpOptions);
  }
  searchCompany(data):Observable<any>{
    return this.http.get(`${this.apiURL}company/search/`+data);
  }
  editClient(client_id):Observable<any>{
    return this.http.get(`${this.apiURL}client/edit/`+client_id);
  }
  deleteClient(client_id):Observable<any>{
    return this.http.get(`${this.apiURL}client/delete/`+client_id);
  }
}
