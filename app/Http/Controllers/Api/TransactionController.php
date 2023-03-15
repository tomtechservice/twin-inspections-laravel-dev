<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\JobService;
use App\Services\TransactionService;
use App\Services\CommonService;
use App\Services\FindingService;

use App\Services\ClientService;
use App\Services\AuthorizeService;
use App\Services\CardDetailsService;
use Illuminate\Support\Facades\Validator;

// use App\Http\Controllers\Api\ClientController;
use Auth;

class TransactionController extends Controller
{
    public function __construct(
     JobService $jobServices,
     TransactionService $transaction,
     CommonService $common,
     CardDetailsService $card,
     FindingService $finding
     )
    {
        $this->jobService = $jobServices;
        $this->transaction =  $transaction;
        $this->common = $common;
        $this->card = $card;
        $this->finding = $finding;
        $this->clientService = new ClientService();

    }
    // public function __construct()
    // {
    //     // $this->job = new JobService();
    //     $this->transaction = new TransactionService();
    // }
    public function add(Request $request,$jobId){
        // dd($request->all());
        // echo strtoupper($request->note);
        // die;
        $jobData = $this->jobService->findJob($jobId);
        // $jobData = $this->transaction->findJob($jobId);
        if(!$jobData){
            return response()->error('invalid job Id');
        }
        // payment
        // dd($request->charge_card);
        if($request->selected_card && $request->charge_card){
            // $request->payment_amount = $request->transaction_payment;
            // $request->payment_profile_id = $request->selected_card;
            $paymentAmount = $request->transaction_payment;
            $paymentProfileId = $request->selected_card;
            $clientId = $jobData->client_id;
            if($paymentAmount <= 0){
                return response()->error('Payment amount must be greater than zero');
            }
            $cardDetails = $this->card->getCardForPayment($paymentProfileId, $clientId);
            if($cardDetails){

                $clientProfileId = $cardDetails->client_profile_id;

                $authprizeService = new AuthorizeService($request);

                $response = $authprizeService->chargeCustomerProfile(
                    $clientProfileId, 
                    $paymentProfileId,
                    $paymentAmount,
                    '',
                    $jobId
                );
                if($response && $response['status'] == 200){
                    $data = $response['data'];
                    $data['payment_amount'] = $paymentAmount;
                    $data['card_details_id'] = $cardDetails->id;
                    $data['client_id'] = $cardDetails->client_id;
                    $this->clientService->addAuthorizePayment($data);
                    // return response()->success($response['message']);
                } else {
                    return response()->error($response['message']);
                }
            } else {
                return response()->error('Error');
            }
          
        }
        
        // 
        // dd($request->transaction_charge);
        if ($request->transaction_type == 'adjustment') {
            $charge = $request->transaction_charge;
            $payment = 0;
            $sub_type = $request->transaction_sub_type;
        } elseif ($request->transaction_type == 'charge') {
            $charge = $request->transaction_charge;
            $payment = 0;
            $sub_type = $request->transaction_sub_type;
        } else {
            $charge = 0;
            $payment = $request->transaction_payment;
            $sub_type = $request->transaction_sub_type;
        }
        $date = $this->common->dateFormat($request->date);
        $datim_created = $this->common->datim_format($date, 2);
        $data = array(
            'property_id' => $jobData->property_id,
            'job_id' => $jobId,
            'user_id' => Auth::id(), // session user id
            'agent_id' => $jobData->agent_id,
            // 'transaction_ref_text' => "$jobId $jobData->transaction_ref_text",
            'transaction_ref_text' => "$jobId $jobData->job_ref_suffix",
            'transaction_type' => $request->transaction_type,	 //input*
            'transaction_work_type' => $jobData->job_type,	
            'transaction_sub_type' => $request->transaction_sub_type,  //input*
            'transaction_description' => strtoupper($request->description),	 //input* UPPER CASE

            'transaction_charge' => $charge,	// input*
            'transaction_payment' => $payment,	 //input*

            'transaction_notes' => $request->note,  //input*
            'transaction_date_created' => $datim_created,  //input*
            'transaction_is_inspection_fee' =>  0,
            'transaction_date_posted' => $datim_created //input* ceated date
         );
        $response = $this->transaction->add($data);
        return response()->success($response);
    }

    public function getTransactionList($jobId) {
        $jobData = $this->jobService->findJob($jobId);
        // $transactionData = $this->transaction->getTransactionList($jobData->property_id);
        $transactionData = $this->transaction->getTransactionList($jobData->job_id);
        $result = [];
        $result['message'] = 'Success';
        $result['data'] = $transactionData;
        return response()->json(['status' => 200,'result' => $result]); 
    }

    public function deleteTransaction($transactionId) {
        return $this->transaction->deleteTransaction($transactionId);
    }

    public function generateBillingStatement(Request $request) {
        $data = $request->all();
        $reportGenerateStatus = $this->finding->generateBillingStatement($request->all());
        $succ_msg = 'Billing Statement Generated';
        $result = [];
        if ($reportGenerateStatus=='success') {
          $status = 200;
          $message = $succ_msg;
		} else { 
          $status = 400;
          $message = 'Operation Fialed';  
        }
        $result['message'] = $message; 
        $result['data'] = []; 
        return response()->json(['status' => $status,'result' => $result]);
    }
    public function authorizePaymentList($job_id){
        return $this->transaction->authorizePaymentList($job_id);
    }

    public function cancelHoldPayment(Request $request){
        $serviceAuth = new AuthorizeService($request);
        $response = $serviceAuth->approveOrDeclineHeldTransaction($request->transaction_id,'decline');
        if($response['status'] == 200){
            $payment = array(
                'status'=>'DECLINE'
            );
            $transaction = $this->transaction->updateAuthorizePayment($payment,$request->transaction_id);
            return response()->json(['status' => '200','result' => $transaction]);
        }
        
    }

    public function doTransaction(Request $request){
        return $this->transaction->doInventoryTransaction($request->all());
    }
    public function accounting($jobId)
    {
        $data =  $this->transaction->getCurrentBalance($jobId);
        $charge = 0;
		$payment = 0;
		$ctr = 0;
		
		$bal = 0.00;
		
		foreach ($data as $trans_items) {
			
			$payment = number_format($trans_items->transaction_payment,2);
			$charge = number_format($trans_items->transaction_charge,2);
			
			$charge = str_replace(',', '', $charge);
			$payment = str_replace(',', '', $payment);
			
			$bal = floatval($bal) - floatval($payment);
			$bal = floatval($bal) + floatval($charge);			
			
		
		}

		return $bal;
    }
}
