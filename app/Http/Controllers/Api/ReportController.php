<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Services\JobService;
use App\Services\ClientService;
use App\Services\CommonService;


class ReportController extends Controller
{
    public function __construct(ReportService $reportService, JobService $jobService, ClientService $clientService)
    {
        $this->reportService = $reportService;
        $this->jobService = $jobService;
        $this->clientService = $clientService;
    }

    public function getReportForJob($jobId) {
        $reportData = $this->reportService->getReportforJob($jobId);
        return $reportData;
    }
    public function postReport(Request $request){
        $reportData = $this->reportService->saveReport($request);
        return $reportData;
    }

    public function getReportDocsForJob($jobId) {
        $data = [];
        $data['is_reports_exist'] = 0;
        $reportData = $this->reportService->getReportforJob($jobId);    
        $jobData = $this->jobService->findJobWithClient($jobId); 

        if ($reportData->report_pdf_file != '') {
            $data['reportPdfFile'] = $reportData->report_pdf_file;
            $data['is_reports_exist'] = 1;
        }
        if ($reportData->report_pdf_file_w_contract != '') {
            $data['reportPdfFileContract'] = $reportData->report_pdf_file_w_contract;
            $data['is_reports_exist'] = 1;
        }
        
        if ($jobData->job_card_crew_pdf_file != '') {
            $data['jobCardCrewPdfFile'] = $jobData->job_card_crew_pdf_file;
            $data['is_reports_exist'] = 1;
        }
        if ($jobData->job_card_contractor_pdf_file != '') {
            $data['jobCardContractorPdfFile'] = $jobData->job_card_contractor_pdf_file;
            $data['is_reports_exist'] = 1;
        }
        if ($jobData->job_card_treater_pdf_file != '') {
            $data['jobCardTreaterPdfFile'] = $jobData->job_card_treater_pdf_file;
            $data['is_reports_exist'] = 1;
        }
        if ($jobData->job_work_completion_pdf_file != '') {
            $data['jobWorkCompletionPdfFile'] = $jobData->job_work_completion_pdf_file;
            $data['is_reports_exist'] = 1;
        }
        if ($jobData->job_billing_statement_pdf_file != '') {
            $data['jobBillingStatementPdfFile'] = $jobData->job_billing_statement_pdf_file;
            $data['is_reports_exist'] = 1;
        }

        return $data;
        //echo "<pre>"; print_r($reportData); echo "</pre>"; exit;   
            

    }

    public function postDownloadDocs(Request $request) {
        $jobId = $request->input('jobId'); 
        $docName = $request->input('docName'); 
        $docType = $request->input('docType');
        if($docType == 'reprts_download') {
            $this->reportService->downloadReportDocs($jobId,$docName);  
        }
        return 0;
    }

    public function getJobReport($jobId)
    {
        return $this->reportService->findJob($jobId);
    }

    public function generateNoc(Request $request)
    {
        return $this->reportService->generateNoc($request->all());
    }
    public function generateReport(Request $request)
    {
        $data = $request->all();
        // dd($data);
        $postData['jid'] = $data['job_id'];
        $serverName = env("OLD_SITE", " ");
        $curlURL='';
        if($data['report']=='billing'){
            $curlURL = $serverName."/pdf/generate/make_billing_statement_pdf.php";
        }
        if($data['report']=='field_sheet')
        $curlURL = $serverName."/pdf/generate/make_findings_blank_pdf.php";
        $generatePdf = CommonService::generatePdf($postData,$curlURL);
        // return $generatePdf;
        $result = $this->jobService->getJobRelation($data['job_id']);
        return response()->success($result);
    }

}    