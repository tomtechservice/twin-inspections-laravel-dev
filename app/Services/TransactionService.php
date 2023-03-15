<?php
namespace App\Services;

use App\Models\Job;
use App\Models\Transaction;
use App\Services\LogService;
use App\Services\CommonService;
use App\Models\AuthorizePayment;
use App\Models\InventoryTransaction;

use Auth;

class TransactionService
{
	function __construct(
        // Job $job,
        // LogService $logService
        )
	{
        // $this->job = $job;
        // $this->logService = $logService;
        $this->service = new CommonService();
        $this->inventoryTransaction = new InventoryTransaction();
    }
    public function findJob($job_id){
        return Job::where('job_id',$job_id)->first();
    }

    public function getTransactionList($jobId) {
        $currentjobData = Job::where('job_id',$jobId)->first();
        $jobData = Job::where('job_id',$jobId)->orWhere('job_ref_parent',$jobId)->orWhere('job_ref_parent',$currentjobData->job_ref_parent)->pluck('job_id')->toArray();
        //dd($jobData);
        $data =  Transaction::whereIn("job_id",$jobData)
             ->with('user','agent')
             ->where('transaction_is_deleted',0)
             ->orderBy('transaction_date_created', 'asc')
             ->get();    
        $result = [];
        $i=0;
        $bal = 0.00;
        foreach($data as $dt) {
            $payment = number_format($dt->transaction_payment,2);
            $charge = number_format($dt->transaction_charge,2);

            $charge = str_replace(',', '', $charge);
            $payment = str_replace(',', '', $payment);

            $bal = floatval($bal) - floatval($payment);
            $bal = floatval($bal) + floatval($charge);
            $result[$i]['by_name'] ='';
            if($dt->user){
                $result[$i]['by_name'] =  $dt->user->user_last_name ? $dt->user->user_last_name : '';
            }
            $result[$i]['date_posted'] =  $dt->transaction_date_posted ? date('m-d-Y',strtotime($dt->transaction_date_posted)) : '';
            $result[$i]['ref_text'] = $dt->transaction_ref_text;
            $result[$i]['description'] = $dt->transaction_description;
            if($dt->agent) {
                $result[$i]['inspector'] = $dt->agent->user_last_name ? $dt->agent->user_last_name : '';
            } else {
                $result[$i]['inspector'] ='';
            }
            
            $result[$i]['transaction_charge'] = $dt->transaction_charge ? number_format($dt->transaction_charge,2) : '';
            $result[$i]['transaction_payment'] = $dt->transaction_payment ? number_format($dt->transaction_payment,2) : '';
            $result[$i]['bal'] = number_format($bal,2);
            $result[$i]['transaction_work_type'] = $dt->transaction_work_type;
            $result[$i]['transaction_sub_type'] = $dt->transaction_sub_type;
            $result[$i]['transaction_id'] = $dt->transaction_id;
            $i++;
        }
        return $result;       
    } 

    public function add($data)
    {
        $transaction = new Transaction();
        $result = $transaction->create($data);
        return $result;
    }

    
    public function deleteTransaction($transactionId) {
    // dd($transactionId) ; 
    // $data = array('transaction_is_deleted' => 1);
	Transaction::where('transaction_id', $transactionId)->update(['transaction_is_deleted' => 1]);

    $deletedTransaction = Transaction::where('transaction_id', $transactionId)->with('user','agent')->first();
    // dd($deletedTransaction);
    $serialisingArray = array(
        'Transaction Date Created' => $deletedTransaction->transaction_date_created,
        'Transaction Description' => $deletedTransaction->transaction_description,
        'Transaction Type' => $deletedTransaction->transaction_type,	
        'Transaction Sub Type' => $deletedTransaction->transaction_sub_type,
        'Transaction Charge' => $deletedTransaction->transaction_charge,	
        'Transaction Notes' => $deletedTransaction->transaction_notes,
    );
    if($deletedTransaction->user) {
        $serialisingArray['Agent Name'] = $deletedTransaction->user->user_first_name;  
    }
    $transaction_data =serialize($serialisingArray);
            
        (new \App\Services\LogService )->transactionLogs(
                 $deletedTransaction->job_id, 
        		'delete',
        		$transaction_data 
        	);
        

    return 1;

    }
    public function authorizePaymentList($job_id){
        return AuthorizePayment::where(function ($query) {
            $query->orWhere('status', 'HOLD')
                ->orWhere('status', 'SUCCESS');
        })->where('job_id',$job_id)->get();
    }
    public function authorizeHoldList($job_id){
        return AuthorizePayment::where('status', 'HOLD')->where('job_id',$job_id)->get();
    }
    public function updateAuthorizePayment($data,$id){

        // return AuthorizePayment::where('status','HOLD')->where('job_id',$job_id)->get();
        $payment = AuthorizePayment::where('transaction_id',$id)->first();
        if($payment){
             $payment->update($data);
        }
        return $payment;
    }
    public function getTotalCompletions($data,$client_id,$branch_sql2,$type=null){
        $fromDate =  $this->service->dateFormat($data['start'])." 00:00:00";
        $toDate = $this->service->dateFormat($data['end'])." 23:59:59";
        // $client_sql = " AND client_id = " . $client_id;   
        
        if($type=='inspector'){
            $client_sql = " AND job.agent_id = " . $client_id;
        }else{
            $client_sql = " AND job.client_id = " . $client_id;
        }

        $sqlcompletion = "SELECT SUM(transaction.transaction_charge) as total_charge FROM transaction INNER JOIN job ON transaction.job_id = job.job_id WHERE transaction.transaction_date_posted >= '$fromDate' AND transaction.transaction_date_posted <= '$toDate' AND transaction.transaction_date_posted != '0000-00-00 00:00:00' AND transaction.transaction_sub_type LIKE '%Completion%' AND transaction.transaction_is_deleted = 0"  . $client_sql . $branch_sql2;
        // echo $sqlcompletion; die;
        $result = $this->service->dbQuery($sqlcompletion);
        if($result && isset($result[0]->total_charge)){
            return $result[0]->total_charge;
        } else {
            return 0;
        }
        // $tot_completions = 0;
        // foreach($result as $res){
        //      $tot_completions = ($tot_completions + $res->total_charge);
        // }
        // return $tot_completions;
    }
    public function totalCompletions($data,$client_id,$branch_sql2,$type=null){
        $fromDate =  $this->service->dateFormat($data['start'])." 00:00:00";
        $toDate = $this->service->dateFormat($data['end'])." 23:59:59";
        // $client_sql = " AND client_id = " . $client_id;   
        if($type=='inspector'){
            $client_sql = " AND job.agent_id = " . $client_id;
        }else{
            $client_sql = " AND job.client_id = " . $client_id;
        }

        $sqlcompletion2 = "SELECT SUM(transaction.transaction_charge) as total_charge FROM transaction INNER JOIN job ON transaction.job_id = job.job_id WHERE transaction.transaction_date_posted >= '$fromDate' AND transaction.transaction_date_posted <= '$toDate' AND transaction.transaction_date_posted != '0000-00-00 00:00:00' AND transaction.transaction_is_deleted = 0"  . $client_sql . $branch_sql2;
        // echo $sqlcompletion2; die;
        $result = $this->service->dbQuery($sqlcompletion2);
        if($result && isset($result[0]->total_charge)){
            return $result[0]->total_charge;
        } else {
            return 0;
        }
        // $tot_completions = 0;
        // foreach($result as $res){
        //     $tot_completions = $tot_completions + $res->total_charge;
        // }
        // return $tot_completions;
    }
    public function doInventoryTransaction($data)
    {
        $job = $this->findJob($data['job_id']);
        if(!$job)
        {   
            return response()->error("Report Id Not Found !");
            // $result = null;
            // return response()->json(['status' => 'error' ,'message'=>'Job Cant Find !', 'result-data'=>$result]);
        }
        if($data['inventory_transaction_type'] == 'In'){
            $credit = $data['inventory_transaction_cost'];
            $debit = 0;
        }else{
            $credit = 0;
            $debit = $data['inventory_transaction_cost'];
        }
        $date = $this->service->formatDate($data['inventory_transaction_date_created']);
        $data['inventory_transaction_debit'] = $debit;
        $data['inventory_transaction_credit'] = $credit;
        $data['inventory_transaction_date_created'] = $date;
        $data['user_id'] = Auth::id();
        unset($data['inventory_transaction_cost']);
        $result = $this->inventoryTransaction->create($data);
        if($result){
            return response()->json(['status' => 'success' , 'message'=>'Inventory Transaction Added !', 'result-data'=>$result]);
        }
    }
    public function getCurrentBalance($jobId)
    {
        // $result = Transaction::where('property_id',$pid)->where('transaction_is_deleted',0)->get();
        // return $result;
        $currentjobData = Job::where('job_id',$jobId)->first();
        $jobData = Job::where('job_id',$jobId)->orWhere('job_ref_parent',$jobId)->orWhere('job_ref_parent',$currentjobData->job_ref_parent)->pluck('job_id')->toArray();
        //dd($jobData);
        $data =  Transaction::whereIn("job_id",$jobData)
             ->with('user','agent')
             ->where('transaction_is_deleted',0)
             ->orderBy('transaction_date_created', 'asc')
             ->get(); 
        return $data ;
    }

    

}