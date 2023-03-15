import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Router,ActivatedRoute } from '@angular/router';
import {AddTransactionComponent} from '../../components/add-transaction/add-transaction.component';
import { TransactionService } from '../../services/transaction.service' 
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment'
import{ JobService } from '../../../intake/services/job/job.service'

@Component({
  selector: 'app-accounting-transactions-list',
  templateUrl: './accounting-transactions-list.component.html',
  styleUrls: ['./accounting-transactions-list.component.scss']
})
export class AccountingTransactionsListComponent implements OnInit {
  public oldSite = environment.apiSite;
  public location = '' ;
  jobId
  recordsCount = 0;
  transactionList;
  loderDivShow = true;
  loading = false;
  public allJobsData;
  showJobsDropdown = false;  
  parentChildJobId;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _router: Router,
    private router: ActivatedRoute,
    private transactionService: TransactionService,
    private jobService : JobService
  ) { 
    let locationHash = _router.url.split("/");
  	if(locationHash.length >= 2){
  		this.location = locationHash[1]+'/'+locationHash[2];
  	}
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      if (params.jobId) {
       this.jobId = params.jobId;
       this.parentChildJobId = this.jobId;
       this.getAllJobs();
       this.showJobsDropdown = true;
      } else {
        this.showJobsDropdown = false;
      }
    })

    this.getTransactions();
  }
  openFormModal(id) {
    const modalRef = this.modalService.open(AddTransactionComponent,{size:'lg'});
    modalRef.componentInstance.jobId = this.jobId;
    modalRef.result.then((result) => {
      this.getTransactions();
    }).catch((error) => {
        console.log(error);
    });
  }

  getTransactions() {
    this.transactionService.getAllTransactions(this.jobId).subscribe(
      data => {
        this.recordsCount = data.result.data.length;
        this.transactionList = data.result.data;
        console.log(data);
        this.loderDivShow = false;
      }
    )
  }

  deleteTransaction(transaction_id) {
    Swal({
      title: 'Are you sure?',
      text: 'Delete Transaction!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.transactionService.deleteTransaction(transaction_id).subscribe(
          data => {
                console.log(data);
                this.getTransactions();
                Swal(
                  'Deleted!',
                  'Transaction has been deleted.',
                  'success'
                )
          } 
         );
        
    } else if (result.dismiss === Swal.DismissReason.cancel) {
       
      }
    })
  }

  makeBillingStatementPdf() {
    this.loading = true
    this.transactionService.generateBillingStatement(this.jobId).subscribe(
      data => {
        this.loading  = false
        if(data.status==200) {
          // this.getTransactions();
          Swal(
            'Success!',
            data.result.message,
            'success'
          )
        } else if(data.status==400){
          Swal(
            'Error!',
            data.result.message,
            'warning'
          )
        }
      }
    )  
  }

  getAllJobs() {
    this.jobService.getAllJobs(this.jobId).subscribe(
      data => {
        console.log(data);
        this.allJobsData = data.result.data;
          console.log(this.allJobsData);
      }
    )
}

goTotheParentJob() {
  window.location.href = this.location+'/'+this.parentChildJobId; 
}

}
