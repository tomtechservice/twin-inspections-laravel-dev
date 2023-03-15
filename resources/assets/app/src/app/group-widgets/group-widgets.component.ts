import { Component, OnInit } from '@angular/core';
import{ SharedService } from '../shared/services/shared.service'
import { Router, RouterModule, Routes , ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-group-widgets',
  templateUrl: './group-widgets.component.html',
  styleUrls: ['./group-widgets.component.scss']
})
export class GroupWidgetsComponent implements OnInit {
  widgetList = [];
  public groupId = 0;
  groupedWidgetTitle = '';
  noaccess = false;
  mainTitle = 'Group Widgets';
  
  card={
    heading1:true,
    heading2:true,
    heading3:true,
    heading4:true,
    heading5:false,
    heading6:false,
    headingWidget:true,
    wantsEarlier:true,
  };
  head=false;
  constructor(private _router: Router,private route: ActivatedRoute,private sharedService:SharedService) { 
    this.route.params.subscribe(params => { this.groupId = params['groupId']; });
  }

  ngOnInit() {
    this.getWidgets();
  }

  getWidgets() {
		this.widgetList=[];
		this.sharedService.getGroupWidgetsDisplay(this.groupId).subscribe(
		  data=> {
        if(data.length > 0) {
          this.noaccess = false;
          for(let wid of data) {
            this.sharedService.getWidgetDatas(wid).subscribe(
              data=> {
                this.widgetList.push({ id: wid.widget_id, 
                                      title: data.title,
                                      result_data: data.data,
                                      symbol: data.data_type_symbol,
                                      goal: data.goal,
                                      is_multiple: data.is_multiple,
                                      is_null_result: data.is_null_result,
                                      exceed_goal: data.exceed_goal,
                                      percentage_value : data.percentage_value,
                                      datapercentage_val : data.datapercentage_val,
                                      shouldbepercentage_val: data.shouldbepercentage_val,
                                      shouldbe_color : data.shouldbe_color,
                                      displayStartDate: data.displayStartDate,
                                      displayEndDate: data.displayEndDate,
                                      diffrence:data.diffrence,
                                      target:data.target,
                                      shouldbe:data.shouldbe,
                                      })
                  this.widgetList.sort(function(a, b){return a.id-b.id });
                  this.groupData();

                }
              )
    
          }
        } else {
          console.log("123sdasd");
          this.noaccess = true;
          this.mainTitle = 'Access Denied';
        }            
		  }
	  )
		
}
    

groupData() {
	this.sharedService.getSingleGroupData(this.groupId).subscribe(
		data=> {
			this.groupedWidgetTitle = data.group_title
	  });
	}

}
