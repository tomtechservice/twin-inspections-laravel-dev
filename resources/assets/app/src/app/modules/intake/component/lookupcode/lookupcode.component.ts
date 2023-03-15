import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common/common.service';

@Component({
  selector: 'app-lookupcode',
  templateUrl: './lookupcode.component.html',
  styleUrls: ['./lookupcode.component.scss']
})
export class LookupcodeComponent implements OnInit {
  modal_title="Special Text Lookup / Inserter";
  lookup='';
  codes: string [];
  noData=false;
  @Input() caseValue;
  constructor(
    private commonService: CommonService,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    
  }
  closeModal() {
		this.activeModal.close('Modal Closed');
  }
  lookupdate(event){
    if(this.lookup){
      this.commonService.getCode(this.lookup).subscribe(data=>{
        this.codes=data;
        if(data.length>0){
          this.noData=false;
        }else{
          this.noData=true;
        }
    
       })
      }
      else{
        this.codes=null;
      }
  }
  lookupCode(event){
    if(this.caseValue == 'recommends') {
      this.activeModal.close(event.code_recommendation + '<br><br>' + event.code_notes);
    } else {
      this.activeModal.close(event.code_notes);
    }
  }
   
}
