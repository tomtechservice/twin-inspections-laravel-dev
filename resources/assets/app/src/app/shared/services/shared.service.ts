import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {Widget} from '../widget';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private apiURL = environment.api;
  constructor(private http: HttpClient) { }
  
  /** POST: add a new widget to the database */
  addWidget (data): Observable<Widget> {
    return this.http.post<Widget>(environment.api+'post_widget', data, httpOptions)
     
  }
  /**Delete: remove Widget */
  removeWidget (id: number): Observable<{}> {
    return this.http.delete(`${environment.api+'discard_widget'}/${id}`, httpOptions)
      .pipe(
        // catchError(this.handleError('del'))
      );
  }
  getdataSources():Observable<any> {
    return this.http.get(this.apiURL+'data_sources');
  }
  // editWidget (id: number): Observable<{}> {
  //   return this.http.get(`${environment.api+'edit_widget'}/${id}`, httpOptions)
  //     .pipe(
  //       // catchError(this.handleError('del'))
  //     );
  // }
  editWidget(id):Observable<any> {
    return this.http.get(this.apiURL+'edit_widget/'+id);
  }

  getWidgets():Observable<any> {
    return this.http.get(this.apiURL+'widget')
  }
  getGroupWidgetsDisplay(groupId):Observable<any> {
    return this.http.get(this.apiURL+'group-widget-display/'+groupId)
  }

  getWidgetDatas(data): Observable<any> {
    return this.http.post(this.apiURL+'sources/widget-data', data, httpOptions)
  }
  getBranch():Observable<any> {
    return this.http.get(this.apiURL+'branch').pipe(
      map(res => res) 
    );
  }
  wantsEarlier(data):Observable<any>{
      return this.http.post(environment.api+'report/wants_earlier',data);
  }
  getUsersList():Observable<any> {
    return this.http.get(this.apiURL+'users_list')
  }
  postGroupedWidget(data):Observable<any> {
    return this.http.post(this.apiURL+'post_widget_groups',data);
  }
  getGroupedWidget():Observable<any> {
    return this.http.get(this.apiURL+'get_widget_groups');
  }

  getSingleGroupData(groupId):Observable<any> {
    return this.http.get(this.apiURL+'get_single_group_data/'+groupId);
  }
  postDeleteGroupWidget(data):Observable<any> {
    return this.http.post(this.apiURL+'post_widget_groups_delete',data);
  }
  reOrderWidgets(data):Observable<any> {
    return this.http.post(`${this.apiURL}widget/reorder`,data);
  }
  
}
