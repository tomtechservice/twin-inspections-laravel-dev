import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiURL = environment.api;
  constructor(private http: HttpClient) { }
  addTransaction(data,jobId):Observable<any>{
    return this.http.post(`${this.apiURL}transaction/add/`+jobId,data,httpOptions);
  }

  getAllTransactions(jobId):Observable<any> {
    return this.http.get(this.apiURL+'gettransactions/'+jobId);
  }

  deleteTransaction(transaction_id):Observable<any> {
		return this.http.get(this.apiURL+'deletetransaction/'+transaction_id).pipe(
		   map(res => res)
		)
	}

  cardList(clientId):Observable<any>{
    return this.http.get(`${this.apiURL}client/card_list/`+clientId);
  }
  getJob(jobId):Observable<any>{
    return this.http.get(`${this.apiURL}get_job/`+jobId);
  }

  generateBillingStatement(...param):Observable<any> {
		return this.http.post(this.apiURL+'transactionbillingstatement',param, httpOptions).pipe(
			map(res => res)
		)
	}
  
}
