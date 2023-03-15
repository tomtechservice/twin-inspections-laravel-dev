<?php

namespace App\Http\Controllers\Api\Report;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use BPDF;
use App\Services\AppJobService;
use App\Services\PdfService;
use App\Services\WorkContractService;

class WorkContractController extends Controller
{
	public function index(
		Request $request, 
		AppJobService $jobService, 
		PdfService $pdfService,
		WorkContractService $workContractService

	){

		$this->validate($request, [
            'id' => 'required|numeric'
        ]);

        $id = $request->get('id');
        $type = $request->get('type','new');

        $job = $jobService
        	->with('agent')
        	->with('property')
        	->with('findings')
        	->with('report')
        	->with('client')
        	->with('branch')
        	->find($id);

        $reportData = [];
		if($job){

			$reportData['companyInfo'] =  $pdfService->getPdfCommonData($job);
			$reportData['findings'] = $workContractService->filterFindingsWithType($job->findings, $type);
            
		}

	}
}