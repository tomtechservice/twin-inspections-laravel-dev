<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\EstimatedService;

class EstimatedController extends Controller
{
    public function __construct(EstimatedService $estimatedServices)
    {
        $this->estimated = $estimatedServices;
    }//
    public function estimatedReport(Request $request){
        $result = $this->estimated->accountingReportEstimatedVsActual($request->all());
        return $result;
    }
}
