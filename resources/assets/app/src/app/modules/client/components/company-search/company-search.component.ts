import { Component, OnInit } from '@angular/core';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {ClientService} from '../../services/client.service';
@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss']
})
export class CompanySearchComponent implements OnInit {
  title="Find Company";
  company="";
  constructor(
    public activeModal: NgbActiveModal,
    public clientService:ClientService
    ) {
  }

  ngOnInit() {
  }
  closeModal() {
		this.activeModal.close('Modal Closed');
  }
  company_list=[];
  error_data="";
  onSubmit(){
    console.log("sdhsdhsdhd",this.company);
    this.clientService.searchCompany(this.company).subscribe(
      data=>{       
        if(data.data){
          this.company_list = data.data;
        }
      },
      error=>{
        this.error_data= error;
      }
    );
  }
  onSelectCompany(param1,param2){
    console.log({param1,param2});
    this.activeModal.close({param1,param2});
  }

}
