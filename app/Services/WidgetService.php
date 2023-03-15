<?php
namespace App\Services;

use App\Models\Widget;
use App\Models\WidgetSource;
use App\Models\WidgetGroup;
use App\Models\WidgetGroupUser;
use App\Models\WidgetGroupList;
use App\Models\WidgetSort;
use App\Services\CommonService;
use Auth;


class widgetService
{
   //  function __construct(Widget $widget, CommonService $service) {
	  // $this->widget = $widget;
	  // $this->service = $service;
   // 	}
	function __construct() {
	  	$this->widget = new Widget();
	  	$this->service = new CommonService();
	  	$this->widgetGroup = new WidgetGroup();
	  	$this->widgetGroupUser = new WidgetGroupUser();
	  	$this->widgetGroupList = new WidgetGroupList();
   	}
	public function save($request){
	
		$user=Auth::user();
        $user_level = $user->user_level->user_level_name;
        if($user_level=='inspector'){
            $agentId = Auth::id();
        }else{
            $agentId =  $request['agent_id'];
        }
		// $branchId =  $request['branch_id'];
		if($request['id']){
			$source = $this->widget->find($request['id']);
			// dd($request['id']);
		}else{
			$source = new widget();
		}
		$source->user_id = Auth::id();
		$source->title = $request['text'];
		$source->data_source_id = 0;
        $source->branch_id = $request['branch_id'];
        $source->agent_id = $agentId;
        $source->goal = $request['goal'];
        $source->data_type = $request['data_type'];
		$source->goal_completed = $request['goal_completed'];
		$source->is_today=$request['is_today'];
		if($request['from_date'] && $request['to_date']){
			$source->from_date = $this->service->dateFormat($request['from_date'])." 00:00:00";   
			$source->to_date = $this->service->dateFormat($request['to_date'])." 23:59:59";
		}
		
		if($source->save()){
			WidgetSource::where('widget_id', $source->id)->delete();
			foreach ($request['data_source_id'] as $dtSource) {
				$widgetSource = new WidgetSource();
				$widgetSource->widget_id = $source->id;
				$widgetSource->data_source_id = $dtSource['id'];
				$widgetSource->save();
			}
		}
		return $source;
	}
	public function discard($id){
		
		$res = Widget::where('id',$id)->where('user_id',Auth::id())->delete();
		if($res){
			WidgetSource::where('widget_id', $id)->delete();
		}
		return $res;

	}

	public function getWidgets($user_id) {
	  $data = Widget::where('user_id',$user_id)->with('dataSource')->orderBy('id', 'ASC')->get();
	  return $data;  	
	}
	public function getWidgetData($id){
		$data = Widget::where('id',$id)->with('widget_sources.data_source')->first();
		$data->from_date = $this->dateFormat($data->from_date);
		$data->to_date = $this->dateFormat($data->to_date);
		return $data; 
	}
	public function dateFormat($date)
	{
		$datetime = new \DateTime($date);
		$data=array();
		$data['year'] =(int)$datetime->format('Y');
		$data['month']= (int)$datetime->format('m');
		$data['day']= (int)$datetime->format('d');
		return $data;
		// {year: date, month: 1, day: 1};
	}

	public function saveWidgetGroup($groupId,$groupTitle,$creatorId){
		if($groupId){
			$widgetGroup = $this->widgetGroup->find($groupId);
		}else{
			$widgetGroup = new WidgetGroup();
		}
		$widgetGroup->group_title = $groupTitle;
		$widgetGroup->creator_id = $creatorId;
		$widgetGroup->save();
		return $widgetGroup->id; 
	}
	public function deleteGroupWidgets($widgetGroupId){
		WidgetGroupUser::where('widget_group_id',$widgetGroupId)->delete();
		WidgetGroupList::where('widget_group_id',$widgetGroupId)->delete();
		WidgetGroup::where('id',$widgetGroupId)->delete();
		return true;
	}
	public function saveWidgetUsers($widgetGroupId,$groupUsers) {
	    WidgetGroupUser::where('widget_group_id',$widgetGroupId)->delete();
		if(count($groupUsers) > 0) {
			foreach($groupUsers as $user) {
				$widgetGroupUser = new WidgetGroupUser();
				$widgetGroupUser->widget_group_id = $widgetGroupId; 
				$widgetGroupUser->widget_user_id = $user['user_id'];
				$widgetGroupUser->save();
			}	 
		}
		return "success";

	}

	public function saveWidgetList($widgetGroupId,$groupedWidgets) {
		WidgetGroupList::where('widget_group_id',$widgetGroupId)->delete();
		if(count($groupedWidgets) > 0) {
			foreach($groupedWidgets as $widget) {
				$widgetGroupList = new WidgetGroupList();
				$widgetGroupList->widget_group_id = $widgetGroupId; 
				$widgetGroupList->widget_id = $widget;
				$widgetGroupList->save();
			}	
		}
		return "success";	
	}

	public function geUsertWidgetGroups($creatorId) {
		return $this->widgetGroup::where('creator_id',$creatorId)->get();
	}

	public function getSingleGroupData($groupId) {
		return $this->widgetGroup::where('id',$groupId)->with(['widget_list','group_users.user'])->first();
	}

	public function getGroupWidgetDisplay($widgetIdsoftheGroup) {
		$data = Widget::whereIn('id', $widgetIdsoftheGroup)->with('dataSource')->orderBy('id', 'ASC')->get();
		return $data;  	
	  
	}

	public function getGroupWidgets($user_id){
		$groupWidgets = WidgetGroup::with('widget_list','group_users')
		->whereHas('group_users', function ($query) use ($user_id) {
		    $query->where('widget_user_id', $user_id);
		})->get();
		$widgetIds = [];
		foreach($groupWidgets as $groupWidget){
			if($groupWidget->widget_list->count() > 0){
				foreach ($groupWidget->widget_list as $widgetList) {
					if(!in_array($widgetList->widget_id, $widgetIds)){
						$widgetIds[] = $widgetList->widget_id;
					}
				}
			}
		}
		if($widgetIds){
			return $this->getGroupWidgetDisplay($widgetIds);
		} else {
			return FALSE;
		}
		
	}
	public function reOrderWidget($user_id,$key,$widget_id)
	{
		$widget = new WidgetSort;
		$widget->user_id = $user_id;
		$widget->order_id = $key;
		$widget->widget_id =$widget_id;
		$widget->save();
		return $widget;
	}
	public function deleteOrderWidget($user_id){
		return WidgetSort::where('user_id',$user_id)->delete();
	}
	public function getWidgetSort($user_id)
	{
		return WidgetSort::where('user_id',$user_id)->get();
	}

   	
}