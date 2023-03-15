import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class CommonService {
    configUrl = 'assets/states.json';
    private apiURL = environment.api;
    constructor(
        private http: HttpClient
    ) { }

    public getState() {
        return this.http.get(this.configUrl);
    }
    getBranch(): Observable<any> {
        return this.http.get(this.apiURL + 'branch');
    }
    getCode(data): Observable<any> {
        return this.http.get(this.apiURL + 'code/' + data)
    }
    getLockoutSettings(): Observable<any> {
        return this.http.get(this.apiURL + 'lockout/settings')
    }
    getLockoutPin(pin): Observable<any> {
        return this.http.get(this.apiURL + 'lockout/pin/verify/' + pin)
    }
    getFindingsLockoutPin(pin): Observable<any> {
        return this.http.get(this.apiURL + 'finding-lockout/pin/verify/' + pin)
    }
}
