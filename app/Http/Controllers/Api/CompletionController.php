<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\JobService;
use App\Services\JobMetaService;

use App\Services\CompletionService;


class CompletionController extends Controller
{
	public function __construct()
    {
        $this->jobService = new JobService();
        $this->completionService = new CompletionService();
    }
	public function getCompletions($jobId){
		$job = $this->jobService->findJobforCompletion($jobId);
		$findings = $job->findings;
		$jobMetas = $job->job_metas;
		$report = $job->report;

		$additionalFindings = [];
		if($job->report && $job->report->additional_findings){
			$additionalFindings = $job->report->additional_findings->where('finding_additional_work_is_deleted', 0)->values();
		}
		
		///
		$findingWithOutChemicals = $findings
			->where('finding_is_deleted', 0)
			->where('finding_uses_chemicals', 0)
			->where('finding_notes_only', 0)
			->where('finding_perform', 1)->values();

		$findingWithChemicals = $findings
			->where('finding_is_deleted', 0)
			->where('finding_uses_chemicals', 1)->values();
		foreach($findingWithChemicals as $key => $findings){
			$findings->chemicals = JobMetaService::chemicalsApplied($findings->job_id,$findings->finding_id);
		}

		$chemicalsMeta = $jobMetas
			->where('job_meta_type', 'chemicals')
			->where('job_meta_is_deleted', 0)->values();

		$crewMeta = $jobMetas
			->where('job_meta_type', 'crew')
			->where('job_meta_is_deleted', 0)->values();

		$materialMeta = $jobMetas
			->where('job_meta_type', 'materials')
			->where('job_meta_is_deleted', 0)->values();

		$contractorMeta = $jobMetas
			->where('job_meta_type', 'contractor')
			->where('job_meta_is_deleted', 0)->values();

		$chemPlusMeta = $jobMetas
			->where('job_meta_type', 'chem_plus')
			->where('job_meta_is_deleted', 0)->values();

		$chemMeta = $jobMetas
			->where('job_meta_type', 'chem')
			->where('job_meta_is_deleted', 0)->values();

		
		$result = [
			'job' => $job,
			'report' => $report,
			'finding_with_out_chemicals' => $findingWithOutChemicals,
			'finding_with_chemicals' => $findingWithChemicals,
			'chemicals_meta' => $chemicalsMeta,
			'material_meta' => $materialMeta,
			'crew_meta' => $crewMeta,
			'contractor_meta' => $contractorMeta,
			'chem_plus_meta' => $chemPlusMeta,
			'chem_meta' => $chemMeta,
			'additional_findings' => $additionalFindings
		];
		return response()->json(['status' => 200,'result' => $result]); 

	}
}