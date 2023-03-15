<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\WidgetService;
use Validator;
use Auth;
class WidgetController extends Controller
{
    public function __construct(WidgetService $widgetService)
    {
        $this->widget = $widgetService;
    }
    public function addWidget(Request $request){
    
        $this->validate($request,[
            'data_source_id'=>'required',
        ]);

        $result = $this->widget->save($request->all());
        return $result;
        // dd();
    }

    public function getWidget() {
        $result = [];
        $user_id = Auth::id();
        $widgets = $this->widget->getWidgets($user_id);
        $groupWidgets = $this->widget->getGroupWidgets($user_id);
        
        // $allWidgets = $widget_data->merge($groupWidgets);


        $returnData = [];
        if($widgets){
            
            foreach($widgets as $widgets) {
                $result['widget_id'] = $widgets->id; 
                $result['title'] = $widgets->title; 
                if($widgets->dataSource){
                    $result['apiUrl'] =$widgets->dataSource->api_url;
                } else {
                    $result['apiUrl'] =''; 
                }
                $result['created'] = 'yes';
                $returnData[] = $result;
            }
        }
        if($groupWidgets){
            
            foreach($groupWidgets as $widgets) {
                $key = array_search($widgets->id, array_column($returnData, 'widget_id'));
                if(!$key){
                    $result['widget_id'] = $widgets->id; 
                    $result['title'] = $widgets->title; 
                    if($widgets->dataSource){
                        $result['apiUrl'] =$widgets->dataSource->api_url;
                    } else {
                        $result['apiUrl'] =''; 
                    }
                    $result['created'] = 'no';
                    $returnData[] = $result;
                }
                
            }
        }
        // dd($returnData);
        $widgetsort = $this->widget->getWidgetSort($user_id);
      
        foreach ($returnData as $key => $value) {
            
            $returnData[$key]['order_id'] = $this->getSortValue($widgetsort, $value['widget_id']);
        }
        // dd($returnData);
        $collection = collect($returnData);
        $sorted = $collection->sortBy('order_id')->values();
        return $sorted;
    }
    public function getSortValue($sorts, $widgetId){
        $sort = $sorts->where('widget_id', $widgetId)->first();
        if($sort){
            return $sort->order_id;
        } else {
            return 0;
        }
    }
    public function remove($id){
        $result = $this->widget->discard($id);
        return $result;
    }
    public function editWidget($id){
        $widget_data = $this->widget->getWidgetData($id);
        return $widget_data;
    }

    public function postWidgetGroups(Request $request) {
       $data = $request->all();
       //dd($data);
       $widgetGroupId = $this->widget->saveWidgetGroup($data['groupId'],$data['groupTitle'],Auth::id());
       $saveWidgetUsers = $this->widget->saveWidgetUsers($widgetGroupId,$data['groupUsers']);
       $saveWidgetList = $this->widget->saveWidgetList($widgetGroupId,$data['groupedWidgets']);
       return response()->json(['status' => 200,'result' => $saveWidgetList]); 
    }
    public function postWidgetGroupsDelete(Request $request) {
       $group_widget_data = $this->widget->deleteGroupWidgets($request->get('id'));
       return response()->json(['status' => 200,'result' => []]); 
    }
    public function getWidgetGroups() {
        $group_widget_data = $this->widget->geUsertWidgetGroups(Auth::id());
        return $group_widget_data;
    }

    public function getSingleGroupData($groupId) {
        $single_group_data = $this->widget->getSingleGroupData($groupId);
        return $single_group_data;
    }

    
    public function getGroupWidgetDisplay($groupId) {
        $result = [];
        $user_id = Auth::id();
        $widgetIdsoftheGroup = [];
        $single_group_data = $this->widget->getSingleGroupData($groupId);
        $isValidUser = false;
        if($single_group_data->creator_id==$user_id) {
            $isValidUser = true;  
        }
        
        if($single_group_data->group_users){
            foreach($single_group_data->group_users as $widgetUser) {
                if($widgetUser->widget_user_id==$user_id) {
                    $isValidUser = true; 
                }
            }
        }
        if(!$isValidUser) {
            return $result; 
        }
        if($single_group_data->widget_list) {
            foreach($single_group_data->widget_list as $widgetData) {
                array_push($widgetIdsoftheGroup,$widgetData->widget_id);
            }
        }
        $widget_data = $this->widget->getGroupWidgetDisplay($widgetIdsoftheGroup);
        if($widget_data){
            $i=0;
            foreach($widget_data as $widgets) {
                $result[$i]['widget_id'] =$widgets->id; 
                $result[$i]['title'] =$widgets->title; 
                if($widgets->dataSource){
                    $result[$i]['apiUrl'] =$widgets->dataSource->api_url;
                } else {
                    $result[$i]['apiUrl'] =''; 
                }
                $i++; 
            }
        }
        return $result;
    }
    public function reOrderWidget(Request $request)
    {
        $user_id = Auth::id();
        $data = $request->all();
        $widget_data = $this->widget->deleteOrderWidget($user_id);
        foreach ($data as $key => $value) {
            $widget_data = $this->widget->reOrderWidget($user_id,$key,$value['widget_id']);
        }
        return response()->success($widget_data); 
    }
}
