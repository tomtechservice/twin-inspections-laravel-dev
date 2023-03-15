<?php

namespace App\Services;

use App\Models\Widget;
use DB;

class SourceService {

   // function __construct(Widget $widget) {
   //      $this->widget = $widget;
   // }
    function __construct() {
        $this->widget = new Widget();
    }
    public function getRevenueData($startDate,$endDate,$branch = NULL, $agent=NULL) {
        
        // $orangeOilCodes = array(205,484);
        // $fumigationCodes = array(201,401);
        // 
        $orangeOilCodes = explode(',', env('ORANGE_OIL'));
        $fumigationCodes = explode(',', env('FUMIGATION'));
        $notInhouseCrewIds = array(16);


        /* ---------------------------------------  All Findings Start    -------------------------*/
        $orangeoil = 0;
        $fumigations = 0;
        $treats = 0;
        $subcontracted = 0;
        $inHouseCrew = 0;
        
        $allFindingsQuery = DB::table('finding as F')
                       ->join('job as J','J.job_id', '=' , 'F.job_id')
                       ->join('user as U','U.user_id', '=', 'F.finding_perform_crew_id');

        $allFindingsQuery->select('U.user_level_id', 'F.finding_which_bid','F.finding_bid_secondary','F.finding_bid_primary','F.finding_uses_chemicals','F.finding_code','F.finding_partially_completed','F.partially_completed_discount','F.finding_secondary_code')
                       ->whereBetween('F.finding_date_completed', [$startDate, $endDate])
                       ->where('F.finding_perform', 1)
                       ->where('F.finding_completed', 1)
                       ->where('F.finding_is_deleted', 0);
        if($branch){
            $allFindingsQuery->where('J.branch_id', $branch);
        }
        if($agent){
            $allFindingsQuery->where('J.agent_id', $agent);
        }
        $allFindingsResult = $allFindingsQuery ->get();

        // echo $allFindingsQuery->count(); die;
        
        foreach($allFindingsResult as $finding){
            if($finding->finding_partially_completed == 1) {
                $findingAmount = $finding->partially_completed_discount;
            } else {
                if ($finding->finding_which_bid != 'secondary') {
                    $findingAmount = $finding->finding_bid_primary;
                } else{
                    $findingAmount = $finding->finding_bid_secondary;
                }
            }
            
            
            if($finding->finding_uses_chemicals==1){
                if ($finding->finding_which_bid == 'secondary' && $finding->finding_secondary_code) {
                  $findingCode = $finding->finding_secondary_code;
                } else {
                  $findingCode = $finding->finding_code;
                } 

                if(in_array($findingCode, $orangeOilCodes)){
                    $orangeoil += $findingAmount;
                }else if(in_array($findingCode, $fumigationCodes)){
                    $fumigations += $findingAmount ;
                }else{
                    $treats += $findingAmount;
                }
            }else{
                if(!in_array($finding->user_level_id, $notInhouseCrewIds)){
                    $inHouseCrew += $findingAmount;    
                }else{
                    $subcontracted += $findingAmount;
                }
            }
            
        }
        
        
        
        /* ---------------------------------------  All Findings End    -------------------------*/

        /* ---------------------------------------  Additional Findings Start    -------------------------*/
        $additionalInhouseCrew = 0;
        $additionalSubcontracted = 0;
        
        $additionalFindingsQuery = DB::table('finding_additional_work as AF')
                                   ->leftJoin('job as J', 'J.job_id', '=', 'AF.job_id')
                                   ->join('user as U', 'U.user_id', '=', 'AF.crew_id');
        $additionalFindingsQuery->select('U.user_level_id', 'AF.finding_bid_additional_work');                           
        $additionalFindingsQuery->where('AF.finding_additional_work_is_deleted',0)
        ->whereBetween('AF.finding_completed_date_additional_work', [$startDate, $endDate]);
        // ->whereBetween('AF.finding_completed_date_additional_work_date_created', [$startDate, $endDate]);
        
        if($branch){
            $additionalFindingsQuery->where('J.branch_id', $branch);
        }

        
            




        $additionalFindingsResult = $additionalFindingsQuery ->get();
        foreach($additionalFindingsResult as $AddlFinding){
            if(!in_array($AddlFinding->user_level_id, $notInhouseCrewIds)){
                $additionalInhouseCrew += $AddlFinding->finding_bid_additional_work;
            }else{
               $additionalSubcontracted += $AddlFinding->finding_bid_additional_work;
            }
        } 
         
        
        /* ---------------------------------------  Additional Findings     -------------------------*/    
    
        $totalSubcontracted = $subcontracted + $additionalSubcontracted;
        // echo "$subcontracted + $additionalSubcontracted"; die;
        $totalInHouseCrew = $inHouseCrew + $additionalInhouseCrew ;
        
        
        
        $subtotal = $totalSubcontracted + $totalInHouseCrew + $orangeoil + $fumigations+ $treats;

        

        /* ---------------------------------------  Inspection Fee Start    -------------------------*/     
        $totInspectionFeeQuery = DB::table('transaction as T')
                                 ->join('job as J', "J.job_id", "=", "T.job_id");
        $totInspectionFeeQuery->whereIn('T.transaction_sub_type', ['Inspection','Inspection Fee']);
        $totInspectionFeeQuery->where('T.transaction_is_deleted', 0);
        $totInspectionFeeQuery->whereBetween('T.transaction_date_posted', [$startDate, $endDate]);                         
        if($branch){
            $totInspectionFeeQuery->where('J.branch_id', $branch);
        }
        $inspectionFees = $totInspectionFeeQuery->sum('T.transaction_charge');
        /* ---------------------------------------  Inspection Fee End    -------------------------*/
        
        $totalBeforeDiscount = $subtotal+$inspectionFees;

        

        $insTotalDiscount =0;
        $insPrepayDiscount =0;
        $insPackageDiscount =0;
        $insInspectorDiscount=0;
        $insCustSatisfactionDiscount= 0;
        $compInspectorDiscount =0;
        $compCrewManagerDiscount= 0;
        $compExecutiveDiscount =0;
        $compCustSatisfactionDiscount = 0;
        $adjustmentAccounting =0;
        $completionInspectorMissDiscount =0;
        $completionCrewMissDiscount =0;

        /* ---------------------------------------  Adjustment Details Start -------------------------*/  
        $totAdjustmentQuery = DB::table('transaction as T')
                                ->join('job as J', 'J.job_id','=', 'T.job_id');
        $totAdjustmentQuery->whereIn('T.transaction_sub_type',['Inspection Discount - Prepay',
                                                                'Inspection Discount - Package',
                                                                'Inspection Discount - Inspector',
                                                                'Inspection Discount - Customer Satisfaction',
                                                                'Completion Discount - Inspector',
                                                                'Completion Discount - Crew Manager',
                                                                'Completion Discount - Executive',
                                                                'Completion Discount - Customer Satisfaction',
                                                                'Completion - Inspector Miss',
                                                                'Completion - Crew Miss',
                                                                'Adjustment - Accounting'
                                                               ]
                                    );                        
        $totAdjustmentQuery->where('T.transaction_is_deleted',0);
        if($branch){
          $totAdjustmentQuery->where('J.branch_id', $branch);
        }
        $totAdjustmentQuery->whereBetween('T.transaction_date_posted',[$startDate, $endDate]);
        $totAdjustmentQuery->select('T.transaction_charge','T.transaction_sub_type');
        $adjustmentDetails = $totAdjustmentQuery->get();
        /* ---------------------------------------  Adjustment Details End -------------------------*/ 
        foreach($adjustmentDetails as $adjustment){
            if($adjustment->transaction_sub_type=='Inspection Discount - Prepay'){
                $insPrepayDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Inspection Discount - Package'){
                $insPackageDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Inspection Discount - Inspector'){
                $insInspectorDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Inspection Discount - Customer Satisfaction'){
                $insCustSatisfactionDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Completion Discount - Inspector'){
                $compInspectorDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Completion Discount - Crew Manager'){
                $compCrewManagerDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Completion Discount - Executive' ){
                $compExecutiveDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Completion Discount - Customer Satisfaction'){
                $compCustSatisfactionDiscount += $adjustment->transaction_charge;
            }else if($adjustment->transaction_sub_type=='Adjustment - Accounting'){
                $adjustmentAccounting += $adjustment->transaction_charge;
            } else if($adjustment->transaction_sub_type=='Completion - Inspector Miss'){
                $completionInspectorMissDiscount += $adjustment->transaction_charge;
            } else if($adjustment->transaction_sub_type=='Completion - Crew Miss'){
                $completionCrewMissDiscount += $adjustment->transaction_charge;
            }
        }
        
       
        
        $insPrepayDiscount = abs($insPrepayDiscount);
        $insPackageDiscount = abs($insPackageDiscount);
        $insInspectorDiscount = abs($insInspectorDiscount);
        $insCustSatisfactionDiscount = abs($insCustSatisfactionDiscount);
            
        $compInspectorDiscount = abs($compInspectorDiscount);
        $compCrewManagerDiscount = abs($compCrewManagerDiscount);
        $compExecutiveDiscount = abs($compExecutiveDiscount);
        $compCustSatisfactionDiscount = abs($compCustSatisfactionDiscount);
            
        $adjustmentAccounting = abs($adjustmentAccounting);
        $completionInspectorMissDiscount = abs($completionInspectorMissDiscount);
        $completionCrewMissDiscount = abs($completionCrewMissDiscount);

        $insTotalDiscount = abs($insPrepayDiscount + $insPackageDiscount + $insInspectorDiscount + $insCustSatisfactionDiscount);
        $totalCompletionDiscount =  abs($compInspectorDiscount + $compCrewManagerDiscount + $compExecutiveDiscount + $compCustSatisfactionDiscount + $completionInspectorMissDiscount + $completionCrewMissDiscount);
            
        $totalAfterDiscount = $totalBeforeDiscount - $insTotalDiscount - $totalCompletionDiscount - $adjustmentAccounting;

        // $totalAfterDiscount = number_format($totalAfterDiscount,2); 
        $totalAfterDiscount = $totalAfterDiscount;
    

        return $totalAfterDiscount;
    }

    public function formatResult($result, $request){
        $customWidget = [
            'google_sheet_SacramentoHome_C2',
            'google_sheet_SacramentoHome_D2',
            'google_sheet_SacramentoPest_C2',
            'google_sheet_SacramentoPest_D2',
            'google_sheet_AuburnHome_C2',
            'google_sheet_AuburnHome_D2',
            'google_sheet_AuburnPest_C2',
            'google_sheet_AuburnPest_D2',
            'google_sheet_VacavilleHome_C2',
            'google_sheet_VacavilleHome_D2',
            'google_sheet_VacavillePest_C2',
            'google_sheet_VacavillePest_D2',
            'google_sheet_SanDiegoHome_C2',
            'google_sheet_SanDiegoHome_D2',
            'google_sheet_SanDiegoPest_C2',
            'google_sheet_SanDiegoPest_D2',
            'custom'
        ];
        $diagram_data = $request->goal - $result;
        $is_multiple = 0;
        $datapercentage_val = 0;
        $shouldbepercentage_val = 0;
        $shouldbe_color = '';
        $exceed_goal = 0;
        $no_result = 0;
        $shouldbe = 0;
        
        $goal = $request->goal;
        $dataTypeSymbol = '';
    	
        

        if($diagram_data == 0 || $diagram_data < 0){
            $diagram_data = $request->goal;
            $is_multiple = 0; 
            $exceed_goal = 1; 
        } else {
            if($result == 0 || $result == 0.00) {
                $is_multiple = 0;
                $no_result = 1;
                $exceed_goal = 0; 
            } else {
                $data_perc = ($result/$request->goal) * 100;
                $goal_perc = 100 - $data_perc;
                $is_multiple = 1;
                $datapercentage_val = $data_perc." ".$goal_perc;
            } 
        }
        $today_date = $request->get('today_date');
        $shouldbe =  $this->goalDiffrence($request->startDate, $request->endDate, $request->goal, $today_date);
        $shouldbeFloat = round((float)$shouldbe);
        // $shouldbeDiff = $shouldbe - $result;
        if($request->goal==0) {
            $shouldbe_perc = 0;
        } else {
            $shouldbe_perc = ($shouldbeFloat/$request->goal) * 100;  
        }    
        $shouldbe_bal_goal_perc = 100 - $shouldbe_perc;
        $shouldbepercentage_val = $shouldbe_perc." ".$shouldbe_bal_goal_perc;

        
        if($shouldbe > $result){
            $shouldbe_color = 'red';
            $diff = $shouldbe - $result;
        } else {
            $shouldbe_color = 'green';
            $diff = $result - $shouldbe;
        }
        if($request->dataType == 'cash'){
            $dataTypeSymbol = '$';
            $result = number_format($result);
            $goal = number_format($goal);
            $shouldbeDisplay = number_format($shouldbe);
            $diffDisplay = number_format($diff);
        } else {
            $shouldbeDisplay = round((float)$shouldbe);
            $diffDisplay = round((float)$diff);
        }

        $displayStartDate = ''; 
        $displayEndDate = '';
        if($request->startDate) {
            $first_date_time_stamp = new \DateTime($request->startDate);
            $displayStartDate =$first_date_time_stamp->format('m/d/Y');
        } 
        if($request->endDate) {
            $end_date_time_stamp = new \DateTime($request->endDate);
            $displayEndDate = $end_date_time_stamp->format('m/d/Y');
        }

        $title = $request->title;
        if($request->has('heading_date')){
            $title = $title.' ('.$request->get('heading_date').')';
        }
        return [
            'data' => $result,
            'diagram_data' => $diagram_data,
    		'goal' => $goal,
    		'data_type' => $request->dataType,
    		'data_type_symbol' => $dataTypeSymbol,
            'title' => $title,
            'is_multiple' => $is_multiple, 
            'exceed_goal' => $exceed_goal,
            'is_null_result' => $no_result,
            'datapercentage_val' => $datapercentage_val,
            'shouldbepercentage_val' => $shouldbepercentage_val,
            'shouldbe_color' => $shouldbe_color,
            'shouldbe'=> $shouldbeDisplay, //targeted goal
            'target'=> round((float)$request->goal - ((float)$result + (float)$shouldbe)), 
            'diffrence'=> $diffDisplay,
            'displayStartDate' => $displayStartDate,
            'displayEndDate' => $displayEndDate
        ];
    }
    public function goalDiffrence($startDate,$endDate, $goal, $today_date = NULL)
    {
        
        $result=0;
        if($today_date){
            $date = new \DateTime($today_date.' 23:59:59');
            $today =  $date->format('d-m-Y H:i:s'); 
        } else {
            $date = new \DateTime('now');
            $today =  $date->format('d-m-Y H:i:s'); 
        }
        if(strtotime($today) >= strtotime($endDate)){
            $today = $endDate;
        }
        $totalHours = $this->hourIntervel($startDate,$endDate);
        $completedHours = $this->hourIntervel($startDate,$today);
        if($goal==0) {
            $result = 0;
        } else {
            $result =  ((float)$goal/$totalHours) * $completedHours ;
        }        
        return $result ;
    }
    public function hourIntervel($startDate,$endDate)
    {
        $first_date = new \DateTime($startDate);
        $second_date = new \DateTime($endDate);
        $difference = $first_date->diff($second_date);
        
        $first_date_formatted = $first_date->format('d-m-Y');
        $second_date_formatted = $second_date->format('d-m-Y');
        $remainHour = 0;
        if($difference->h==23){
            if($difference->i > 30) {
                $remainHour = $difference->h+1;  
            } else {
                $remainHour = $difference->h; 
            }

        } else {
            $remainHour = $difference->h;   
        }
        $hours = ($difference->days * 24) + $remainHour;
        return $hours;
    }
    public function dateIntervel($startDate,$endDate)
    {
        $first_date = new \DateTime($startDate);
        $second_date = new \DateTime($endDate);

        $difference = $first_date->diff($second_date);
        $day = $difference->format("%d");
        return $day;
    }
    // public function formatResultCustom($result, $request)
    // {
    //     $diagram_data = $request->goal - $result;
    //     $is_multiple = 0;
    //     $percentage_val = 0;
    //     $exceed_goal = 0;
    //     $no_result = 0;
    //     if($diagram_data == 0 || $diagram_data < 0){
    //         $diagram_data = $request->goal;
    //         $is_multiple = 0; 
    //         $exceed_goal = 1; 
    //     } else {
    //         if($result == 0 || $result == 0.00) {
    //             $is_multiple = 0;
    //             $no_result = 1;
    //             $exceed_goal = 0; 
    //         } else {
    //             $data_perc = ($result/$request->goal) * 100;
    //             $goal_perc = 100 - $data_perc;
    //             $is_multiple = 1;
    //             $percentage_val = $data_perc." ".$goal_perc; 
    //         }
              
    //     }
    //     $goal = $request->goal;
    //     $dataTypeSymbol = '';
    // 	if($request->dataType == 'cash'){
    //         $dataTypeSymbol = '$';
    //         $result = number_format($result);
    //         $goal = number_format($goal);
    //     }
    //     return [
    //         'data' => $result,
    //         'diagram_data' => $diagram_data,
    // 		'goal' => $goal,
    // 		'data_type' => $request->dataType,
    // 		'data_type_symbol' => $dataTypeSymbol,
    //         'title' => $request->title,
    //         'is_multiple' => $is_multiple, 
    //         'exceed_goal' => $exceed_goal,
    //         'is_null_result' => $no_result,
    //         'percentage_value' => $percentage_val
    // 	];
    // }
}


