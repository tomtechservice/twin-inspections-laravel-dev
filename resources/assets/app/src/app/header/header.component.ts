import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, first} from 'rxjs/operators';
import{HeaderService} from './header.service';
import { AuthenticationService } from '../login/authentication.service';
import { environment } from '../../environments/environment';
import {Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'abe-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public apiSite;
    public old_site;
    public oldSite;
    headerText:any = '';
    model: any;
    searching = false;
    searchFailed = false;
    searchparam = '';
  	constructor(
      private headerService: HeaderService,
      private authenticationService: AuthenticationService,
      private  _router : Router
    ) { }
  	public userData;
  	ngOnInit() {
      this.old_site = environment.apiSite;
  		this.userData = JSON.parse(localStorage.getItem('user'));
      this.apiSite = environment.apiSite;
      this.oldSite = environment.oldSite;
      this.headerText = environment.appDashboard;
		}
		signOut(){
			localStorage.removeItem('app_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      // this.authenticationService.signOut()
      // .subscribe(
      //   data => {
      //     console.log(data);
      //     localStorage.removeItem('app_token');
      //     localStorage.removeItem('user');
      //     window.location.href = '/login';
      //   },error=>{
      //     // localStorage.removeItem('app_token');
      //     // localStorage.removeItem('user');
      //     console.log(error);
      //   }
      // );
		}
    redirectInspection(data){
      // window.location.href = this.apiSite+'url/inspections_completed_sheet/'+data.item.job_id;
      this._router.navigate(['inspections-completed-sheet/',data.item.job_id]);
    }
    searchResults = false;
    isSearching = false;
    searchJobs: string[];
    searchProperties: string[];
    searchClients: string[];

    searchApiSite(){
      if(!this.isSearching){
        this.isSearching = true;
        setTimeout(() => {
          this.headerService.searchSite(this.searchparam).subscribe(
              data => { 
                  this.searchResults = true;
                  this.isSearching = false;
                  this.searchJobs = data.jobs
                  this.searchClients = data.clients
                  this.searchProperties = data.properties
                  console.log(this.searchClients);
              }
          );
        }, 500);
      }
      
    }
    navigateFromSearch(data){
      // window.location.href = this.apiSite+'url/inspections_completed_sheet/'+data.job_id;
      //this._router.navigate(['inspections-completed-sheet/',data.job_id]);
        window.location.href = 'inspections-completed-sheet/'+data.job_id;
    }
    onClickedOutside(e: Event) {
      this.searchResults = false;
    }
    search = (text$: Observable<string>) =>
    text$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => this.searching = true),
          switchMap(term =>
          this.headerService.getClients(term).pipe(
              tap(() => {this.searchFailed = false} ),
              catchError(() => {
               this.searchFailed = true;
                return of([]);
              }))
          ),
          tap(() => this.searching = false)
    )
    formatter = (x: {text: string}) => x.text;

}
