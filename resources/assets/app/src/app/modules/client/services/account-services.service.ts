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
export class AccountServicesService {
  private apiURL = environment.api;
  constructor(private http: HttpClient) { }
  
  cardDetails(data,clientId):Observable<any>{
    return this.http.post(`${this.apiURL}client/card_details/`+clientId,data,httpOptions);
  }
  chargeCard(data,clientId):Observable<any>{
    return this.http.post(`${this.apiURL}client/payment/`+clientId,data,httpOptions);
  }
  cardList(clientId):Observable<any>{
    return this.http.get(`${this.apiURL}client/card_list/`+clientId);
  }
  payments(clientId):Observable<any>{
    return this.http.get(`${this.apiURL}client/payments/`+clientId);
  }
  cardDelete(id):Observable<any>{
    return this.http.delete(`${this.apiURL}client/card_delete/`+id);
  }
}
