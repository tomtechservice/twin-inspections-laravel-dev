import { Component, OnInit,Input,OnChanges } from '@angular/core';
import {AccountServicesService} from '../../services/account-services.service';
import {Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit,OnChanges {
  @Input() notice:string;
  cardList=[];
  clientId;
  error_message='';
  success_message='';
  hideme = {};
  constructor(
    private _router: Router,
    private router: ActivatedRoute,
    private account: AccountServicesService
    ) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      if (params.clientId) {
       this.clientId = params.clientId;
       this.getCardDetals(params.clientId);
      }
    })
    
  }
  ngOnChanges(){ 
    // date range check from dashboard
    if(this.notice){
      this.getCardDetals(this.clientId);
    }
  }
  getCardDetals(clientId){
    this.account.cardList(clientId)
    .subscribe(
      data=>{
        this.cardList = data.data;
      }
    );
  }
  cardDelete(id){
    Swal({
					title: 'Warning',
					text: 'Do You Want To Delete?',
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes'
				})
				.then((result) => {
					if (result.value) {
        		console.log(result)
              this.account.cardDelete(id)
              .subscribe(
                  data => {
                      // console.log(data.data.status)
                      if (data.data.status == 200) {
                          this.error_message = '';
                          this.success_message = data.data.message;
                          this.getCardDetals(this.clientId);
                          setTimeout(() => {
                              this.success_message = '';
                          }, 2000);
                      }
                  }, error => {
                      this.error_message = error;
                      this.success_message = '';
                      setTimeout(() => {
                          this.error_message = '';
                      }, 2000);
                  }
              );
					}
				})
    
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  onNotify(message:string):void {
    // alert(message);
    console.log(".essage",message);
  }

}
