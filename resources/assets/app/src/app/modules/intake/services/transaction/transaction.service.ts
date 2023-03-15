import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiURL = environment.api;
  authKey:any;
  constructor(
    private http: HttpClient) { }
  
  public doTransaction(data):Observable<any>{
    return this.http.post(this.apiURL+'transaction/do-transaction',data, httpOptions);
  }

}
