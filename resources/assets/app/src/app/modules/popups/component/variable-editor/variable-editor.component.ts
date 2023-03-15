import { Component,OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-variable-editor',
  templateUrl: './variable-editor.component.html',
  styleUrls: ['./variable-editor.component.scss']
})
export class VariableEditorComponent implements OnInit {

  @Input() code_item_data;

  resultData = {
    finding_description: '',
    finding_recommendation: '',
    finding_notes: '',
    // need_validation : 1
  }

  codeFinding = '';
  codeRecommendation='';
  codeFindingInputArray = []
  codeRecommendationInputArray = []
  codeNoteInputArray = []

  editFormDatas = {
    finding : [],
    recommendation : [],
    notes : []
  }
  

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.setEditForm()
  }

  setEditForm() {
    var n1 = 0;
    var n2 = 0;
    var n3 = 0;
    var n4 = 0;
    var ctr = 0;
	  var num_of = 0;

	
	
    if (this.code_item_data.code_finding != '') {
      // this.editFormDatas['finding'] = [];
      n1 = this.code_item_data.code_finding.search("@");
      if (n1 < 0) { 
		    this.resultData.finding_description = this.code_item_data.code_finding; 
	    } else { 
        // this.resultData.need_validation = 0;
	      var codeFinding = this.code_item_data.code_finding;
        var codeFindingsplit = this.splitData(codeFinding,'@')
        var codeFindingsplitData = codeFindingsplit['splitData'];
        num_of = codeFindingsplit['count']; 
        this.editFormDatas['finding'] = this.setEditFormFileds('finding',codeFindingsplitData,num_of);
      }
    }
    
    if (this.code_item_data.code_recommendation != '') {
      // this.editFormDatas['recommendation'] = [];
      n2 = this.code_item_data.code_recommendation.search("@");
      
      if (n2 < 0) {
        this.resultData.finding_recommendation = this.code_item_data.code_recommendation; 
      } else {
        // this.resultData.need_validation = 0;
        var codeRecommendation = this.code_item_data.code_recommendation;
        var codeRecommendationsplit = this.splitData(codeRecommendation,'@')
        var codeRecommendationsplitData = codeRecommendationsplit['splitData'];
        num_of = codeRecommendationsplit['count'];
        this.editFormDatas['recommendation'] = this.setEditFormFileds('recommendation',codeRecommendationsplitData,num_of);				
      }
    }
    
    if (this.code_item_data.code_notes != '') {
      // this.editFormDatas['notes'] = [];
      n3 = this.code_item_data.code_notes.search("@"); 
      if (n3 < 0) {
        this.resultData.finding_notes = this.code_item_data.code_notes;
      } else {
        // this.resultData.need_validation = 0;
        var codeNote = this.code_item_data.code_notes;
        var codeNotesplit = this.splitData(codeNote,'@')
        var codeNotesplitData = codeNotesplit['splitData'];
        num_of = codeNotesplit['count'];
        this.editFormDatas['notes'] = this.setEditFormFileds('note',codeNotesplitData,num_of);											
      }
    }

  }

  replaceVarsInFields() {
    var n1 = 0;
    var n2 = 0;
    var n3 = 0;
    var n4 = 0;
    var ctr = 0;
	  var num_of = 0;
    if (this.code_item_data.code_finding != '') {
      n1 = this.code_item_data.code_finding.search("@");
      if (n1 < 0) { 
		    this.resultData.finding_description = this.code_item_data.code_finding; 
	    } else { 
	      var codeFinding = this.code_item_data.code_finding;
        var codeFindingsplit = this.splitData(codeFinding,'@')
        var codeFindingsplitData = codeFindingsplit['splitData'];
        num_of = codeFindingsplit['count']; 
        this.resultData.finding_description = this.setResultFileds('finding',codeFindingsplitData,num_of); 
      }
      
    }
    
    if (this.code_item_data.code_recommendation != '') {
      n2 = this.code_item_data.code_recommendation.search("@");
      if (n2 < 0) { 
		    this.resultData.finding_recommendation = this.code_item_data.code_recommendation; 
	    } else { 
	      var codeRecommendation = this.code_item_data.code_recommendation;
        var codeRecommendationsplit = this.splitData(codeRecommendation,'@')
        var codeRecommendationsplitData = codeRecommendationsplit['splitData'];
        num_of = codeRecommendationsplit['count']; 
        this.resultData.finding_recommendation = this.setResultFileds('recommendation',codeRecommendationsplitData,num_of); 
      }
      
    }

    if (this.code_item_data.code_notes != '') {
      n3 = this.code_item_data.code_notes.search("@");
      if (n3 < 0) { 
		    this.resultData.finding_notes = this.code_item_data.code_notes; 
	    } else { 
	      var codeNote = this.code_item_data.code_notes;
        var codeNotesplit = this.splitData(codeNote,'@')
        var codeNotesplitData = codeNotesplit['splitData'];
        num_of = codeNotesplit['count']; 
        this.resultData.finding_notes = this.setResultFileds('note',codeNotesplitData,num_of); 
      }
      
    }

    this.activeModal.close({case: 'set_code_datas',result : this.resultData})

  }

  splitData(data,split_char) {
    var splitData = data.split(split_char);
    var num_of = splitData.length-1; 
    var resultData = {}
    resultData['splitData'] = splitData;
    resultData['count'] = num_of;
    return resultData;
  }

  setEditFormFileds(caseType,codeFindingsplitData,num_of) {
    var resultData = [];
    if(caseType == 'finding') {
      resultData.push({
          type: 'title',
          value: '...in the Code - Findings'
		  }) 
    } else if(caseType == 'recommendation') {
      resultData.push({
          type: 'title',
          value: '...in the Code - Recommendation'
		  }) 
    } else if(caseType == 'note') {
      resultData.push({
          type: 'title',
          value: '...in the Code - Notes'
		  }) 
    }
    let i;
    let i_Input = 1;
    for (i = 0; i <= num_of; i++) {
      resultData.push({
        type: 'text',
        value: codeFindingsplitData[i]
		  }) 
		  if (i != num_of) {
        resultData.push({
         type: 'input',
          value: i_Input
		    }) 
		    i_Input++;
      }
    }
    
    return resultData; 
  }

  setResultFileds(caseType,codeFindingsplitData,num_of) {
    var result = '';
    let i;
    let i_Input = 1;
    for (i = 0; i <= num_of; i++) {
      result += codeFindingsplitData[i];       
      if (i != num_of) {
        if(caseType == 'finding') {
          if(this.codeFindingInputArray[i_Input]){
            result += ' '+this.codeFindingInputArray[i_Input]+' ';
          } else {
            result += '@';
          }
        }
        if(caseType == 'recommendation') {
          if(this.codeRecommendationInputArray[i_Input]){
            result += ' '+this.codeRecommendationInputArray[i_Input]+' ';
          } else {
            result += '@';
          }
        }
        if(caseType == 'note') {
          if(this.codeNoteInputArray[i_Input]){
            result += ' '+this.codeNoteInputArray[i_Input]+' ';
          } else {
            result += '@';
          }
        }
        i_Input++;
      }
    }
    return  result;
  }


}
