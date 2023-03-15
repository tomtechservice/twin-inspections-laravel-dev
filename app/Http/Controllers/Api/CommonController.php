<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\CommonService;
use App\Services\DataSourceService;
use App\Services\CalendarService;
use App\Services\UserService;
use App\Models\Setting;
use App\Models\Job;
use App\Models\Property;
use Carbon\Carbon;
use App\Models\Client;

class CommonController extends Controller
{
    public function __construct(CommonService $commonService,Setting $settingModel,UserService $userService)
    {
        $this->commonService = $commonService;
        $this->settingModel = $settingModel;
        $this->userService = $userService;
    }
    public function getBranch(CommonService $commonService)
    {
        $branch = $commonService->getBranches();
        return $branch;
       
    }
    public function getInspectors(CommonService $commonService)
    {
        $branch = $commonService->getInspectors();
        return $branch;
    }

    public function getInspectorsWithPreferredLabel(CommonService $commonService, $cid)
    {
        // get client id from job
        $job = Job::where('job_id', $cid)->first();
        if($job) {
            $inspectors = $commonService->getInspectorsWithPreferredLabel($job->buyer_agent_id);
            return $inspectors;
        }
        else {
            return $this->getInspectors();
        }
    }

    public function getDataSources(DataSourceService $dataSourceService)
    {
        return $dataSourceService->getAll();
        
    }
    public function getAllLead(CommonService $commonService){
        $lead = $commonService->getLead();
        return $lead;
    }
    public function getCode($code){
        $code = $this->commonService->getLookUp($code);
        return $code;
    }
    // calendar
    public function calendar(CalendarService $calendar){
        $job_id=45434;
        $inspector_id=57;
        $data = $calendar->insertEvent($job_id,$inspector_id);
        dd($data);
    }
    public function getToken($token){
        // $data = $calendar->generateAuthUrl();
        dd($token);
    }

    public function getSettingsData() {
        $settingData = $this->settingModel->first();
        $settingData->tabs_order = Setting::getInspectionTabs($settingData->inspection_tab_order);
        return $settingData;  
    }

    public function getSearch(Request $request){
        $returndata = [];
        $simpleSearch = [];
        $propertySearch = [];
        $clientSearch = [];
        $q = $request->get('search');
        if($q){
            $results = Job::where('job_is_deleted','0')
            ->where('job_status_top', '!=', 'Cancelled')
            ->where('job_ref_parent', 'LIKE', '%'.$q.'%')
            ->limit('20')
            ->get();
            
            if($results){
                foreach ($results as $key => $value) {
                    if($value->property && $value->property->property_is_deleted == 0){
                        $rSingle = [];
                        $rSingle['job_id'] = $value->job_id;
                        $text = '';
                        if ($value->job_ref_parent == $value->job_id) {
                            $report_number = $value->job_id . ' ' . $value->job_ref_suffix;
                        } else {
                            $report_number = $value->job_ref_parent . ' ' . $value->job_ref_suffix;
                        }
                        $text .= $report_number.' - ';
                        $text .= $value->property->property_address1.' ';
                        $rSingle['text'] = $text;
                        $rSingle['property_last'] = $value->property->property_city.' '.$value->property->property_state.' '.$value->property->property_zip;
                        $simpleSearch[] = $rSingle;
                    }
                    
                }
            }

            $properties = Property::where('property_address1', 'LIKE', '%'.$q.'%')
            ->whereHas('property_jobs', function ($query) {
                $query->where('job_status_top', '!=', 'Cancelled')
                ->where('job_is_deleted', '0');
            })
            ->limit('20')
            ->get();
            
            if($properties){
                foreach ($properties as $key => $value) {
                    if($value->property_jobs){
                        foreach ($value->property_jobs as $job) {
                            $rSingle = [];
                            $rSingle['job_id'] = $job->job_id;
                            $text = '';
                            if ($job->job_ref_parent == $job->job_id) {
                                $report_number = $job->job_id . ' ' . $job->job_ref_suffix;
                            } else {
                                $report_number = $job->job_ref_parent . ' ' . $job->job_ref_suffix;
                            }
                            $text .= $report_number.' - ';
                            $text .= $value->property_address1.' ';
                            if($value->property_address2){
                                $text .= ', '.$value->property_address2.' ';
                            }
                            $rSingle['text'] = $text;
                            $rSingle['property_last'] = $value->property_city.' '.$value->property_state.' '.$value->property_zip;
                            $propertySearch[] = $rSingle;
                        }
                    }
                }
            }

            $clients = Client::where('client_last_name','LIKE','%'.$q.'%')
                       ->with('company')
                       ->limit('20')
                       ->get(); 

            if($clients){
                foreach ($clients as $key => $value) {
                    $rSingle = [];
                    $rSingle['client_id'] = $value->client_id;
                    $text = '';
                    if ($value->client_is_company == 1) {
                        if($value->company) {
                            $text =$value->client_first_name.' '.$value->client_last_name.' - '.$value->company->company_name;
                        } else {
                            $text =$value->client_first_name.' '.$value->client_last_name;
                        }
                    } else {
                        $text =$value->client_first_name.' '.$value->client_last_name;
                    }
                    $rSingle['text'] = $text;
                    $clientSearch[] = $rSingle;
                }
            }           

        }
        $returndata['properties'] = $propertySearch;
        $returndata['jobs'] = $simpleSearch;
        $returndata['clients'] = $clientSearch;
        return $returndata;
    }   
    public function wantsEarlier(Request $request){
    // dd(Carbon::today());
        $job = Job::with('property','client')->where('wants_earlier', 1)->whereNotIn('job_status_top',['Completed','Cancelled']);
        if($request->branch){
            $job->where('branch_id', $request->branch);
        }   
        $job->orderBy('job_date_scheduled');
        $job->whereDate('job_date_scheduled','>', Carbon::today()->toDateString());
        return  $job->get();
        
    }
    public function encryptStr($jobId)
    {
        $data = $this->commonService->encrypt_decrypt('encrypt',$jobId);
        return response()->success($data);
    }


    public function getAssigneeList() {
      
      $userList = [];
      $userList['crew'] = $this->userService->getAssigneeList('crew');
      $userList['contractor'] = $this->userService->getAssigneeList('contractor');
      $userList['inspector'] = $this->userService->getAssigneeList('inspector');
      $userList['treater'] = $this->userService->getAssigneeList('treater');
      return $userList;
    }

    public function setReportContentSetting(Request $request, $settingId){
        
        $data = $request->all();
        $setting = $this->settingModel->where('setting_id',$settingId)->first();
        $setting->work_contract_text = $data['data'];
        $setting->save(); 
        return response()->json($setting);
    }

    public function setWorkReportHeaderSetting(Request $request, $settingId){
        $data = $request->all();
        $setting = $this->settingModel->where('setting_id',$settingId)->first();
        $setting->work_contract_headerbox = $data['data'];
        $setting->save(); 
        return response()->json($setting);
    }

    public function setFindingsReportContent(Request $request, $settingId){
        
        $data = $request->all();
        $setting = $this->settingModel->where('setting_id',$settingId)->first();
        $setting->findings_report_text = $data['data'];
        $setting->save(); 
        return response()->json($setting);
    }

    public function setFindingsReportHeader(Request $request, $settingId){
        $data = $request->all();
        $setting = $this->settingModel->where('setting_id',$settingId)->first();
        $setting->findings_report_header = $data['data'];
        $setting->save(); 
        return response()->json($setting);
    }
    
    public function setStateLawsReport(Request $request, $settingId) {
        $data = $request->all();
        $setting = $this->settingModel->where('setting_id',$settingId)->first();
        $setting->state_laws_report_text = $data['data'];
        $setting->save(); 
        return response()->json($setting);
    }

    // get lockout settings
    public function getLockoutSettings(){
        $response = ['date' => '', 'message' => ''];
        try {
            $data = $this->commonService->getSettings();
            if ($data) {
                $response['date'] = (!empty($data->lockout_date)) ? $data->lockout_date : '';
                $response['message'] = (!empty($data->lockout_message)) ? $data->lockout_message : '';
                $response['finding_lockout_pin'] = (!empty($data->finding_lockout_pin)) ? 1 : "";
                $response['finding_message'] = (!empty($data->finding_lockout_message)) ? $data->finding_lockout_message : '';
            }
        }
        catch(\Exception $ex) {}
        return response()->json($response);
    }

    // get lockout pin
    public function getLockoutPin($pin){
        $response = ['success' => false, 'message' => 'Invalid pin entered, please enter correct pin'];
        try {
            $data = $this->commonService->getSettings();
            if ($data && !empty($data->lockout_pin) && $data->lockout_pin == $pin) {
                $response['success'] = true;
                $response['message'] = 'Pin verified';
            }
        }
        catch(\Exception $ex) {}
        return response()->json($response);
    }

    // get finding lockout pin
    public function getFindingLockoutPin($pin){
        $response = ['success' => false, 'message' => 'Invalid pin entered, please enter correct pin'];
        try {
            $data = $this->commonService->getSettings();
            if ($data && !empty($data->finding_lockout_pin) && $data->finding_lockout_pin == $pin) {
                $response['success'] = true;
                $response['message'] = 'Pin verified';
            }
        }
        catch(\Exception $ex) {}
        return response()->json($response);
    }

}
