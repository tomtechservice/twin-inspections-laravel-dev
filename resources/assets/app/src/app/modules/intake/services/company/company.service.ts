import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
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
export class CompanyService {

  private apiURL = environment.api;
  public dateData = {};
  
  constructor(private http: HttpClient) {
     
  }
  getAllCompany():Observable<any> {
    return this.http.get(this.apiURL+'all_company');
  }
  searchCompany(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.http
      .get(this.apiURL+'get_company', {params: PARAMS.set('search', term)}).pipe(
        map(response => response)
      );
  }
}
