<?php
namespace App\Services;

use DB;

class ChargesService
{
    function __construct()
	{
    }

    //
    public function totalCharges($startDate, $endDate, $branch=NULL, $agent=NULL){

        $chargeQuery = DB::table('job');
        $chargeQuery->join('transaction', 'transaction.job_id', '=', 'job.job_id');
        $chargeQuery->select(DB::raw('SUM(transaction.transaction_charge) as charge'));
        $chargeQuery->whereBetween('transaction.transaction_date_posted', [$startDate, $endDate]);
        $chargeQuery->where('job.job_is_deleted', 0);
        $chargeQuery->where('transaction.transaction_is_deleted', 0);
        $chargeQuery->where('transaction.transaction_charge', '!=', '0.00');
        if($branch){
            if(is_array($branch)){
                $chargeQuery->whereIn('branch_id', $branch);
            } else {
                $chargeQuery->where('branch_id', $branch);
            }
        }
        if($agent){
            if(is_array($agent)){
                $chargeQuery->whereIn('job.agent_id', $agent);
            } else {
                $chargeQuery->where('job.agent_id', $agent);
            }
        }
        $result = $chargeQuery->first();
        if($result){
            return $result->charge;
        } else {
            return 0;
        }
        
        
    }


}    