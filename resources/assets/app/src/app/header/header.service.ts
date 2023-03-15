import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({ providedIn: 'root' })
export class HeaderService {
	private apiURL = environment.api;
    constructor(private http: HttpClient) { }

    private options = { headers: new HttpHeaders().set('Content-Type', 'application/json')};

    getTest() {
        return this.http.get(`${environment.api}test`, this.options);
    }
    getClients(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(this.apiURL+'search-api', {params: PARAMS.set('search', term)}).pipe(
        map(response => response)
      );
  }
  searchSite(term):Observable<any> {
		return this.http.get(environment.api+'search-api?search='+term);
	}
}