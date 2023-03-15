<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ScheduleService;
use App\Helpers\DateHelper;
use App\Services\AuthorizeService;
use App\Services\CardDetailsService;
use App\Services\ClientService;
use App\Services\TransactionService;
use Auth;

class ScheduleController extends Controller
{
    public function __construct(
        ScheduleService $scheduleService,
        CardDetailsService $card)
    {
        $this->scheduleService = $scheduleService;
        $this->card = $card;
        $this->clientService = new ClientService();
        $this->transactionService = new TransactionService();
    }
    // schedule search
    public function search(Request $request){
    	// agent ID - Use comma seperated values for more than one agent
    	$agent = $request->get('agent','');
    	// search for a span of time // default to next 7 days
    	// $toDate = $request->get('to_date', DateHelper::addDate(date('Y-m-d'),'P7D'));
    	$toDate = $request->get('to_date', date('Y-m-d'));
    	// this is current day /// but can have a future date
    	$fromDate = $request->get('from_date', date('Y-m-d'));
    	// implement in future to calculate driving time
    	$propertyId = $request->get('property', '');
    	// reurn data
    	$returnData = [];
    	if($agent){
    		// multiple agents search support //
    		$agent = explode(',', $agent);
    		$returnData['data'] = $this->scheduleService->searchAgentSchedules(
    			$toDate, $fromDate, $agent, $propertyId
    		);
    		$returnData['type'] = 'time';
    	} else {
    		$returnData['data'] = $this->scheduleService->searchAgentSchedules(
    			$toDate, $fromDate, $agent, $propertyId
    		);
    		$returnData['type'] = 'agent';
    	}
        // dd($returnData);
    	return $returnData;
    }
    public function add(Request $request){
        $response = ['status' => '400'];
        $is_payment=false;
        // if(($request->charge_card==true) && ($request->selected_card!='')){
        if(($request->job_payment_type=="Credit Card") && ($request->selected_card!='')){
            if($request->charge_card==true || $request->charge_card_inspection==true){

                $paymentAmount = $request->job_fee - $request->job_fee_discount;
                if($paymentAmount>0){
                    $paymentProfileId = $request->selected_card;
                    $clientId = $request->client_id;

                    $cardDetails = $this->card->getCardForPayment($paymentProfileId, $clientId);
                    if($cardDetails){
                        $is_payment=true;
                        // $clientProfileId = $cardDetails->client_profile_id;

                        // $authprizeService = new AuthorizeService($request);

                        // $response = $authprizeService->chargeCustomerProfile(
                        //     $clientProfileId,
                        //     $paymentProfileId,
                        //     $paymentAmount,
                        //     'authOnlyTransaction'
                        // );
                        // if($response['status']!=200){
                        //     return response()->error($response['message']);
                        // }

                    } else {
                        return response()->error('Invalid Card');
                    }

                }else{
                    return response()->error('Base Fee must be greater than Fee Discount ');
                }
            }
        }
        $result =  $this->scheduleService->add($request);
        if($is_payment && $result['jobId']){
            $clientProfileId = $cardDetails->client_profile_id;
            $authprizeService = new AuthorizeService($request);

            $response = $authprizeService->chargeCustomerProfile(
                $clientProfileId,
                $paymentProfileId,
                $paymentAmount,
                'authOnlyTransaction',
                $result['jobId']
            );
            if($response['status']!=200){
                return response()->error($response['message']);
            }
        }
        if($response && $response['status'] == 200 && $result['jobId']){
            $data = $response['data'];
            $data['payment_amount'] = $paymentAmount;
            $data['card_details_id'] = $cardDetails->id;
            $data['client_id'] = $cardDetails->client_id;
            $data['job_id'] = $result['jobId'];
            $data['status'] = 'HOLD';
            $this->clientService->addAuthorizePayment($data);

        }
        if($result['jobId']&& $request->charge_card==true ){
            $serviceAuth = new AuthorizeService($request);
        // $response =  $serviceAuth->getHeldTransactionList();
        // $this->transactionService = (new \App\Services\TransactionService);
            $transaction = $this->transactionService->authorizeHoldList($result['jobId']);
            if($transaction){
                foreach($transaction as $hold_transaction){
                    $response=$serviceAuth->approveOrDeclineHeldTransaction($hold_transaction->transaction_id,'approve');
                    if($response['status']!=200){
                        return response()->error($response['message']);
                    }
                    $payment = array(
                                        'status'=>'SUCCESS'
                                    );
                                    $this->transactionService->updateAuthorizePayment($payment,$hold_transaction->transaction_id);
                    if($response['status'] == 200 && $result['jobId']){
                            $jobData = $this->transactionService->findJob($result['jobId']);
                            $datim_created =  date('Y-m-d h:i:s');
                            $data = array(
                                'property_id' => $jobData->property_id,
                                'job_id' => $jobData->job_id,
                                'user_id' => Auth::id(), // session user id
                                'agent_id' => $jobData->agent_id,
                                'transaction_ref_text' => "$jobData->job_id $jobData->job_ref_suffix",
                                'transaction_type' => 'payment',	 //input*
                                'transaction_work_type' => $jobData->job_type,
                                'transaction_sub_type' => 'Inspection',  //input*
                                'transaction_description' => 'PAID CC',	 //input* UPPER CASE

                                'transaction_charge' => 0,	// input*
                                'transaction_payment' => $hold_transaction->payment_amount,	 //input*

                                'transaction_notes' => 'PAID CC',  //input*
                                'transaction_date_created' => $datim_created,  //input*
                                'transaction_is_inspection_fee' =>  0,
                                'transaction_date_posted' => $datim_created, //input* ceated date
                            );
                            $this->transactionService->add($data);
                    }
                }
                // dd($data);
            }
        }
        return $result;
    }
    public function getSchedule($jobId){
        return $this->scheduleService->getSchedule($jobId);
    }
    public function getCalendarStatus($agent_id){
        return $this->scheduleService->getAgentCalendarStatus($agent_id);
    }

    /**
     * POST : compare the inspection schdule time. 
     */
    public function getAgentScheduleAvailability(Request $request)
    {
        try {
            $agent = $request->get('agent', '');
            $rawFromDate = $request->get('from_date', date('Y-m-d'));
            $fromDate = DateHelper::timeFix($rawFromDate, $request->get('from_time', '00:00:00'));
            $toDate = DateHelper::timeFix(
                $rawFromDate,
                DateHelper::addMinutes($fromDate, $request->get('calculated_time', 0))
            );
            
            $schedule = $this->scheduleService->getAgentConflictedScheduleTimeJobs($agent, $fromDate, $toDate, $request->get('job_id'));
            
            return [
                'status' => $schedule == 0,
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error' => $e->getMessage()
            ];
        }
        
    }

    // get office calendar status
    public function getOfficeCalendarStatus($agent_id){
        return $this->scheduleService->getAgentOfficeCalendarStatus($agent_id);
    }

    // search date based on number of slots avaialble
    public function searchDate(){
        return $this->scheduleService->getSearchDate();
    }
    // schedule search
    public function searchAvailable(Request $request){

        $toDate = $request->get('to_date', date('Y-m-d'));
        // this is current day /// but can have a future date
        $fromDate = $request->get('from_date', date('Y-m-d'));

        $jobId = $request->get('job_id', '');
        // reurn data
        $returnData = [];
        $returnData = $this->scheduleService->searchAvailable(
            $toDate, $fromDate, $jobId
        );
        return $returnData;
    }
    // agent update
    public function postAgentSchedule(Request $request){
        return $this->scheduleService->updateAgentSchedule($request);
    }
    public function fillData(){

        // $agents = \App\Models\User::select('user_id','user_first_name','user_last_name')->where('user_level_id', 2)->where('user_is_deleted', 0)->orderBy('user_last_name', 'asc')->get();

        // $weekDays = ['mon','tue','wed','thu','fri'];

        // foreach($agents as $agent){
        //     $weekly = new \App\Models\AgentWeeklySchedule();
        //     $weekly->user_id = $agent->user_id;
        //     $weekly->mon = 1;
        //     $weekly->tue = 1;
        //     $weekly->wed = 1;
        //     $weekly->thu = 1;
        //     $weekly->fri = 1;
        //     $weekly->sat = 0;
        //     $weekly->sun = 0;
        //     $weekly->save();
        //     foreach($weekDays as $week){
        //         $daily = new \App\Models\AgentDailySchedule();
        //         $daily->user_id = $agent->user_id;
        //         $daily->week_day = $week;
        //         $daily->start_time = '08:00:00';
        //         $daily->end_time = '17:00:00';
        //         $daily->save();
        //     }
        // }
    }
}
