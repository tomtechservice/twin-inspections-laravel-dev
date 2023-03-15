<?php
namespace App\Services;

use App\Models\Setting;
use App\Models\Branch;
use App\Models\User;
use App\Models\Lead;
use App\Models\Code;
use App\Models\Property;
use App\Helpers\DateHelper;

use DB;

class CommonService
{
    function __construct()
	{
        $this->setting = new Setting(); 
    }

    public function getSettings() {
        $settings_data = $this->setting->first();
        return $settings_data; 
    }
    public function getBranches(){
        return Branch::where('branch_is_deleted',0)->get();
    }

    public function getUser($user_id){
        return User::where('user_id', $user_id)->first();
    }
    public function getInspectors(){
        return User::where([['user_level_id', '=', '2'],['user_id', '!=', '1'],['user_is_deleted', '=', '0'],['user_active', '=', '1']])
                    ->orderBy('user_last_name', 'asc')
                    ->get();
     
    }

    public function getInspectorsWithPreferredLabel($cid){
        $nonPreferred = [];
        $preferred = [];
        $results = [];
        $users = DB::select("SELECT u.user_id, user_first_name, u.user_last_name, (SELECT COUNT(id) FROM preferred_inspectors p WHERE p.client_id='$cid' AND p.inspector_user_id=u.user_id) as preferred FROM user u WHERE (u.user_level_id = 2 AND u.user_level_id != 1 AND u.user_is_deleted = 0 AND u.user_active = 1)");
        foreach($users as $user) {
            if($user->preferred) {
                $preferred[] = $user;
            }
            else {
                $nonPreferred[] = $user;
            }
        }
        return array_merge($preferred, $nonPreferred);
    }

    public function getLead(){
        return lead::where('lead_is_deleted',0)->orderBy("lead_id", "asc")->get();
    }
    public function getInspectorsList($user_id){
        $user = User::where('user_level_id', 2);
        if($user_id){
            $user->where('user_id', $user_id);
        }   
        $user->where('user_is_deleted', 0);
        $user->orderBy('user_last_name', 'asc');
        return $user->get();

        
     
    }
    public function dbQuery($data){
        $results = DB::select( DB::raw($data) );
        return $results;
    }
    public function query($data){
        $results = DB::select($data);
        return $results;
    }
    public function queryCount($data){
        $results = DB::select($data)->count();
        return $results;
    }
    public static  function dateChange($oldFormat)
    {
        if($oldFormat){
            $newdate = \DateTime::createFromFormat('d/m/Y', vsprintf('%s/%s/%s', [
                $oldFormat['day'],
                $oldFormat['month'],
                $oldFormat['year'],
               
            ]));
            if($newdate){
                $newDate = $newdate->format('Y-m-d');
                return $newDate;
            }   
        } 
    }
    public function dateFormat($oldFormat)
    {
        $newdate = \DateTime::createFromFormat('d/m/Y', vsprintf('%s/%s/%s', [
            $oldFormat['day'],
            $oldFormat['month'],
            $oldFormat['year'],
           
        ]));
        if($newdate) {
            $newDate = $newdate->format('Y-m-d');
        } else {
            $newDate = "0000-00-00";
        }
        return $newDate;
    }
    public function dateFormatRev($date)
    {
        $datetime = new \DateTime($date);
        $data=array();
        $data['year'] =(int)$datetime->format('Y');
        $data['month']= (int)$datetime->format('m');
        $data['day']= (int)$datetime->format('d');
        return $data;
    }
    public function datim_format($datim, $which)
	{
		if ($which == 1) {
			
			$datim = date('m-d-Y',strtotime($datim));
			//
		}
		if ($which == 2) {
			
			$datim = date('Y-m-d',strtotime($datim)) . ' 00:00:00';
			// 2016-4-16 00:00:00
		}
		if ($which == 3) {
			
			$datim = date('m-d-Y g:ia',strtotime($datim));
			//4-16-2017 10:34am
		}
		if ($which == 4) {
			
			$datim = date('m/d/Y',strtotime($datim));
			//  4/16/2015
		}
		if ($which == 5) {
			
			$datim = date('D F j, Y g:ia',strtotime($datim));
			//  
		}		
		if ($which == 6) {
			
			$datim = date('g:i A',strtotime($datim));
			// 
		}		
		if ($which == 7) {
			
			$datim = date('D F j, Y',strtotime($datim));
			//$datim = 'gooddodod';
		}			
		return $datim;
    }
    public function getLookUp($code){
        return Code::where('code_name', 'LIKE', "$code%")
        ->where('code_notes','!=', '')
        ->orderBy('code_name', 'ASC')
        ->get();
    }
    public function encrypt_decrypt($action, $string) {
        
        $output = false;
    
        $encrypt_method = "AES-256-CBC";
        $secret_key = 'Do you do, feel like I do 42';
        $secret_iv = 'wok are delisously spelled wrong';
    
        // hash
        $key = hash('sha256', $secret_key);
        
        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
    
        if( $action == 'encrypt' ) {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        }
        else if( $action == 'decrypt' ){
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
            
        }
    
        return $output;
    }
    public function findTotalInspectionMinutes($property_id) {
        $settingData = Setting::where('setting_id','=',1)->first();
        
        $result = 0;
        $inspectionMinutes = $settingData->setting_inspection_minutes;
        $squareFeet = $settingData->setting_square_feet;
        $crawlSquareFeet = $settingData->setting_crawl_square_feet;
        $current_year = date("Y");
        $homeAge_diffrence = $current_year - $settingData->setting_home_age;
        $homeAge = $homeAge_diffrence;
        $subAreaAdditionalMinutes = $settingData->setting_subarea_additional_minutes;
        $additinalSquareFeetTotal = 0;
        $additinalRaisedSquareFeet = 0;
        $additinalAgeMinutes = 0;
        $additionalMinuteSquareFeet = $settingData->setting_minute_square_feet_base;
        $minuteSquareFeetSubarea = $settingData->setting_minute_square_feet_subarea;
        $multiStoryMultiplier = $settingData->setting_multi_story_multiplier;
        $minuteYearOlderBase = $settingData->setting_minute_year_older_base;

        $propertyData = Property::where('property_id',$property_id)->where('property_is_deleted',0)->first();
        
        if($propertyData) {

            /*-------------Add'l Square Feet-------------------*/
            $squareFeetDiffrence = 0;
            if($propertyData->property_square_feet > $squareFeet){
               $squareFeetDiffrence = ($propertyData->property_square_feet - $squareFeet) * $additionalMinuteSquareFeet;
            }
            $additinalSquareFeetTotal = $squareFeetDiffrence;
            /*-------------Add'l Square Feet-------------------*/
            
            /*-------------Add'l Raised Square Feet-------------------*/
            $raisedSquareFeetDiffrence = 0;
            if($propertyData->property_foundation == 'raised') {
                $raisedSquareFeetDiffrence = $raisedSquareFeetDiffrence + $subAreaAdditionalMinutes;
                if($propertyData->property_square_feet > $crawlSquareFeet){
                    $SquareFeetVariation = ($propertyData->property_square_feet - $crawlSquareFeet);
                    if($propertyData->property_type == 'multi') {
                        $SquareFeetVariation = $SquareFeetVariation * $multiStoryMultiplier;
                    } else {
                        $SquareFeetVariation = $SquareFeetVariation;
                    } 

                    $SquareFeetVariation = $SquareFeetVariation * $minuteSquareFeetSubarea;
                    $raisedSquareFeetDiffrence = $raisedSquareFeetDiffrence + $SquareFeetVariation;
                }
            }
            $additinalRaisedSquareFeet = $raisedSquareFeetDiffrence;
            /*-------------Add'l Raised Square Feet-------------------*/
            
            /*-------------Add'l Age Minutes-------------------*/
            $ageMinutesDiffrence = 0;
            if($propertyData->property_year < $homeAge) {
                if($minuteYearOlderBase){
                    $ageMinutesDiffrence = ($homeAge - $propertyData->property_year) * $minuteYearOlderBase;
                }
                
            }
            $additinalAgeMinutes = round($ageMinutesDiffrence);
            /*-------------Add'l Age Minutes-------------------*/
            $result = $inspectionMinutes + $additinalSquareFeetTotal + $additinalRaisedSquareFeet + $additinalAgeMinutes;
            $result =  round($result);
        } 
        return $result; 
        
    }
    public function formatDate($date)
    {
        $d = $date['month'] ."/". $date['day'] ."/". $date['year'];
        return DateHelper::format($d, 2);
    }
    public static function generatePdf($postData,$curlURL) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $curlURL);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec($ch);
        curl_close ($ch);
        if($server_output) {
            return "success";
         } else {
             return "error";
         }
    }

 
}    