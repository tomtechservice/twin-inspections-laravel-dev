<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Google_Client;
use Google_Service_Sheets;
use Google_Service_Drive;
use URL;
use App\Services\SourceService;
use App\Services\InspectionService;
use App\Services\ChargesService;
use App\Services\widgetService;
// use input;

class SourceController extends Controller {

    protected $tokenPath = '../token.json';
    public function __construct(SourceService $source,InspectionService $inspectionService,ChargesService $chargesService) {
       $this->source = $source;
       $this->inspectionService = $inspectionService;
       $this->chargesService = $chargesService;
       $this->widget = new widgetService();
    }
    public function getWidgetData(Request $request) {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $branch = $request->input('branch');
        $agent = $request->input('agent');
        
        $dataSources = $request->get('dataSources');
        $result = 0;

        $totalSources = count($dataSources);
        $datesArray = [];
        foreach ($dataSources as $source) {
            $myResult = 0;
            switch ($source) {
                case "revenue":
                    $myResult = $this->getRevenue($request);
                    break;
                case "inspection_scheduled":
                    $myResult = $this->getInspectionScheduled($request);
                    break;
                case "inspection_performed":
                    $myResult = $this->getInspectionPeformed($request);
                    break;
                case "charges":
                    $myResult = $this->getCharges($request);
                    break;
                case "custom":
                    $myResult = $this->getCustom($request);
                    break;
                default:
                    $data = $this->getGoogleSheets($request, $source, $totalSources);
                    $myResult = $data['data'];
                    if($data['date']){
                        $datesArray[] = $data['date'];
                    }

            }
            $result = $result + $myResult;
        }
        if(count($datesArray) > 0){
            // $request->merge([
            //     'today_date' => $this->getLastDate($datesArray)
            // ]);
            $request->merge([
                'heading_date' => $this->getLastDate($datesArray)
            ]);
        }
        return $this->source->formatResult($result, $request);
    }
    public function getLastDate($dates){
        return min($dates);
    }
    public function getRevenue(Request $request) {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $branch = $request->input('branch');
        $agent = $request->input('agent');
        $result = $this->source->getRevenueData($startDate,$endDate,$branch, $agent);
        return $result;
    }
    public function getInspectionScheduled(Request $request) {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $branch = $request->input('branch');
        $agent = $request->input('agent');
        $result = $this->inspectionService->inspectionScheduledCount($startDate, $endDate, $branch, $agent);
        return $result;
    }

    public function getInspectionPeformed(Request $request) {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $branch = $request->input('branch');
        $agent = $request->input('agent');
        $result = $this->inspectionService->inspectionPerformedCount($startDate, $endDate, $branch, $agent);
        return $result;
    }

    public function getCharges(Request $request) {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $branch = $request->input('branch');
        $agent = $request->input('agent');
        $result = $this->chargesService->totalCharges($startDate, $endDate, $branch, $agent);
        return $result;
    }
    public function getCustom(Request $request)
    {
        $widget_id = $request->input('widget_id');
        
        $data=$this->widget->getWidgetData($widget_id);
        return $data['goal_completed'];
    }
    public function getClientObject(){
        $client = new Google_Client();
        $client->setApplicationName('Google Sheets API PHP Quickstart');
        $client->setScopes(\Google_Service_Sheets::DRIVE_READONLY, \Google_Service_Sheets::SPREADSHEETS_READONLY);
        
        $client->setAuthConfig('../client_secret_sheet.json');
        $client->setAccessType('offline');
        $client->setPrompt('select_account consent');
        $client->setRedirectUri(URL::to('goog/callback'));
        if (file_exists($this->tokenPath)) {
            $accessToken = json_decode(file_get_contents($this->tokenPath), true);       
            $client->setAccessToken($accessToken);
        }
        if ($client->isAccessTokenExpired()) {

            if ($client->getRefreshToken()) {
                $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
                $this->saveToken($client);
            }
            
        }
        return $client;
    }
    public function saveToken($client){
        file_put_contents($this->tokenPath, json_encode($client->getAccessToken()));
        return true;
    }
    public function getGoogleSheets(Request $request, $source, $totalSources){

        $cleanSlug = str_replace('google_sheet_', '', $source);
        $params = explode('_', $cleanSlug);

        $name = $params[0];
        $field = $params[1];

        $client = $this->getClientObject();
        $spreadsheetId = '15_wgkLyThbXlLBcQI5-j72DI8cfEuQGqmD0D0vDiBmE';

        $service = new Google_Service_Sheets($client);
        if (file_exists($this->tokenPath)) {
            $accessToken = json_decode(file_get_contents($this->tokenPath), true);       
            $client->setAccessToken($accessToken);
        }
        
        $range = $name;
        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();
        // print_r($values);
        
        $keys = ['A' => 0,'B' => 1, 'C' => 2, 'D' => 3];
        
        $row = substr ( $field , -1 );
        $row = $row - 1;

        $col = $keys[substr ( $field , 0, 1 )];   
        
        // echo $row; echo $col; die;
        $data = [];
        $data['data'] = 0;
        $data['date'] = NULL;
        if(isset($values[$row])){
            $data['data'] = isset($values[$row][$col]) ? $values[$row][$col] : 0;
            if($name != 'DashboardTotals'){
                if($totalSources == 1){
                    // $request->merge([
                    //     'today_date' => isset($values[$row]['1']) ? $values[$row]['1'] : NULL
                    // ]);
                    $request->merge([
                        'heading_date' => isset($values[$row]['1']) ? $values[$row]['1'] : NULL
                    ]);
                } else if($totalSources > 1){
                    $data['date'] =  isset($values[$row]['1']) ? $values[$row]['1'] : NULL;
                }
            }
            
            
        }
        
        $sourceService = new SourceService();
        return $data;
    }
}