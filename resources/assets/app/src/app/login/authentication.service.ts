import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    private options = { headers: new HttpHeaders().set('Content-Type', 'application/json')};

    login(username: string, password: string) {
        // console.log(this.options);
        return this.http.post<any>(`${environment.api}login`, { username, password }, this.options)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('app_token', user.token);
                    localStorage.setItem('user', JSON.stringify(user.user));
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('app_token');
    }
    signOut():Observable<any>{
        return this.http.post(`${environment.api}logout`, {'token' : localStorage.getItem('app_token')},this.options);
    }
}