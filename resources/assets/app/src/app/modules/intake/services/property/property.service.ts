import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {Property} from '../../property';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(
    private http: HttpClient

  ) { }
  /** POST: add a new widget to the database */
  addProperty (data): Observable<Property> {
    return this.http.post<Property>(environment.api+'add_property', data, httpOptions)
     
  }
  
  // getProperty(job_id):Observable<any> {
  //   return this.http.get(environment.api+'get_property/'+job_id);
  // }
  getProperty(job_id):Observable<any> {
    return this.http.get(environment.api+'property/get/'+job_id);
  }
  getZill(data):Observable<any> {
    return this.http.post(environment.api+'property/zill',data,httpOptions).pipe(
      map(res => res) 
    );
  }
  checkZip(zip):Observable<any> {
    return this.http.get(environment.api+'property/check_zip/'+zip);
  }
 
  searchProperty(data):Observable<any> {
    return this.http.post(environment.api+'search_property',data, httpOptions).pipe(
      map(res => res) 
    );
  }

  getJobProperty(property_id):Observable<any>{
    return this.http.get(environment.api+'property/get_property/'+property_id);
  }
  
  setLockboxCode(data):Observable<any> {
    return this.http.post(environment.api+'set_lockbox_code',data, httpOptions).pipe(
      map(res => res) 
    );
  }

}
