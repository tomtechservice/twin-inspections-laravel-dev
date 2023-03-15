<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\FeesService;

class FeesController extends Controller
{
    public function __construct(FeesService $feesService)
    {
        $this->feesService = $feesService;
    }

    public function getAllFeesList() {
        $feesData = $this->feesService->getAllFeesList();
        $result = [];
        $result['message'] = 'Success';
        $result['data'] = $feesData;
        return response()->json(['status' => 200,'result' => $result]); 
    }

    public function add(Request $request){
        $fee_id = $request->get('fee_id');
        $data = $request->except('fee_id');
        // check if amount is less_than 0
        if($data['fee_amount'] < 0) {
            $data['fee_is_discount'] = 1;
        }
        else {
            $data['fee_is_discount'] = 0;
        }

        if(!empty($fee_id)) {
            $feeData = $this->feesService->getSingleFee($fee_id);
            if(!$feeData){
                return response()->error('invalid fee');
            }
            $response = $this->feesService->update($data, $fee_id);
        }
        else {
            $response = $this->feesService->add($data);
        }
        return response()->success($response);
    }

    public function getSingleFee(Request $request, $feeId) {
        $result = [];
        $feeData = $this->feesService->getSingleFee($feeId);
        if(!$feeData){
            return response()->error('invalid fee');
        }
        $result['message'] = 'Success';
        $result['data'] = $feeData;
        return response()->json(['status' => 200,'result' => $result]); 
    }

    public function deleteFee(Request $request, $feeId) {
        $result = [];
        $feeData = $this->feesService->getSingleFee($feeId);
        if(!$feeData){
            return response()->error('invalid fee');
        }
        // delete requested fee
        $this->feesService->delete($feeId);
        $result['message'] = 'Success';
        return response()->json(['status' => 200,'result' => $result]); 
    }

    public function getJobAllFeesList(Request $request, $jobId="") {
        $feesData = $this->feesService->getJobAllFeesList($jobId);
        $result = [];
        $result['message'] = 'Success';
        $result['data'] = $feesData;
        return response()->json(['status' => 200,'result' => $result]); 
    }

}
