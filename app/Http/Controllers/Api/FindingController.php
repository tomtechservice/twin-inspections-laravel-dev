<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Services\FindingService;
use App\Services\CommonService;
use App\Services\JobService;
use App\Services\LogService;

use Illuminate\Support\Facades\Input;

class FindingController extends Controller
{
    public function __construct(ReportService $reportService, FindingService $findingService)
    {
        $this->reportService = $reportService;
        $this->findingService = $findingService;
        $this->jobService = new JobService();
    }

    public function getJobFindings($jobId) {
        $data = [];
        $data['reportData'] = $this->reportService->findJob($jobId); 
        $data['findingList'] = $this->findingService->getFindingsListOfJob($jobId,0);
        $data['findingNotesOnlyList'] = $this->findingService->getFindingsListOfJob($jobId,1);
        return $data;
    }
    public function getJobInfoFindings($jobId) {
       return $this->findingService->getJobinfoFindingList($jobId);
    }
    // not deleted findings of job which is not deleted
    public function getExistingFindingsOfJob($jobId){
        return $this->findingService->getExistingFindingsOfJob($jobId);
    }

    public function getFindingCodes(Request $request){
        return $this->findingService->getFindingCodes($request);
    }

    public function getFindingCodeData($codeId){
        return $this->findingService->getFindingCodeDatas($codeId);
    }
    
    public function postFinding(Request $request) {
      return $this->findingService->addFinding($request->all());      
    } 

    public function getFinding($findingId) {
        return $this->findingService->getFinding($findingId);   
    }

    public function postFindingPrimaryBid(Request $request) {
       return $this->findingService->postFindingPrimaryBid($request->all());
    }

    public function postFindingSecondaryBid(Request $request) {
        return $this->findingService->postFindingSecondaryBid($request->all());
    }

    public function deleteFindingData($findingId) {
        return $this->findingService->deleteFinding($findingId);
    }

    public function getFindingsParent($job_ref_parent) {
      return $this->findingService->getFindingsParent($job_ref_parent);    
    }
    public function postFindingImage(Request $request) {
        $img = $request['photo'];
        $findingId = $request['findingId'];
        $extension = $img->guessExtension();
        if($extension != 'jpeg' && $extension != 'jpg' && $extension != 'png' && $extension != 'gif') {
             $result = [];
             $result['message'] = 'Invalid File Format';
             $result['data'] = [];
             return response()->json(['status' => 400,'result' => $result]); 
        } else {
             $uploadImage = $this->findingService->uploadFiningImage($img,$findingId);
             $result = [];
             $result['message'] = 'Success';
             $result['data']['finding_image_id'] = $uploadImage;
             return response()->json(['status' => 200,'result' => $result]); 
        }
    }

    public function getFindingsImages($findingId) {
      $findingImagesData = $this->findingService->getFiningImage($findingId);
      $result = [];
      $result['message'] = 'Success';
      $result['data'] = $findingImagesData;
      return response()->json(['status' => 200,'result' => $result]); 
    }
    public function deleteFindingsImages($findingImageId) {
        $deleteFindingImages = $this->findingService->deleteFindingsImages($findingImageId);
        $result = [];
        $result['message'] = 'Success';
        $result['data'] = [];
        return response()->json(['status' => 200,'result' => $result]); 
    }

    public function generateFindingReport(Request $request) {
        if($request->type == 'finding_only') {
            $reportGenerateStatus = $this->findingService->generateFindingOnlyReport($request);
            $succ_msg = 'Inspection Report Generated';
        } else if($request->type == 'generate_contract') {
            $reportGenerateStatus = $this->findingService->generateFindingContractReport(
              $request
            );
            $succ_msg = 'Work Authorization Contract PDF Generated';
        } 
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

    public function autoFillFinding($jobId) {
        $prevFinding= $this->findingService->getPrevFinding($jobId);
        $result = [];
        $result['message'] = 'Success';
        $result['data'] = $prevFinding;
        return response()->json(['status' => 200,'result' => $result]); 
    }

    public function setPerformFindings(Request $request) {
        $performFinding = $this->findingService->setPerformFindings($request->all());
        $result = [];
        $result['message'] = 'Success';
        $result['data'] = [];
        return response()->json(['status' => 200,'result' => $result]);
    }    
    public function getFindingsCompletedNotPosted($jobId)
    {
        return $this->findingService->getFindingsCompletedNotPosted($jobId);
    }
    public function getFindingCrewCommission(Request $request){
        return $this->findingService->getFindingCrewCommission($request->all());
    }
    public function jobCompletion($jid,Request $request)
    {
        // $seeAll = array(
        //     'finding_completed' => 0,
        //     'finding_partially_completed' =>0,	
        //     'finding_bid_hours_completed' => 0,	
        //     'finding_bid_material_completed' => 0,
        //     'partially_completed_discount' => 0.00,
        //     'finding_date_completed' => '0000-00-00 00:00:00'
        //  );
        // $initial = $this->findingService->update($seeAll,$jid);
        $data = $request->all();
        if($data['findingWithOutChemicals']){
            $withoutChemicals = $data['findingWithOutChemicals'];  
            // $this->chemicalsUpdate($withoutChemicals);
            foreach($withoutChemicals as $chemicals){
                if($chemicals['finding_partially_completed']){
                    $chemicals['finding_completed']=1;
                }
                $chemicals['finding_date_completed'] =  CommonService::dateChange($chemicals['finding_date_completed']);
                $result =  $this->findingService->update($chemicals,$chemicals['finding_id']);
            }
        }
        if($data['findingWithChemicals']){
            $WithChemicals = $data['findingWithChemicals'];
            $this->chemicalsUpdate($WithChemicals);
        }
        $notes = array(
            'job_completed_notes' => $data['job_completed_notes'],
            // 'job_actual_hours' => $job_actual_hours,
            'job_status_top' => 'Completed',
            'job_status' => 'Completed',
            'job_completed_date' => CommonService::dateChange($data['job_completed_date'])
         );
        $existing=$this->jobService->findJob($jid);
        $newData= $this->jobService->update($notes,$jid);
        LogService::findChanges(
            $existing, 
            $newData, 
            $jid, 
            ['job_completed_notes','job_actual_hours','job_status_top','job_status','job_completed_date']
        );
        // $this->jobService->update($notes,$jid);
        return response()->success($newData);

    }
    public function chemicalsUpdate($finding)
    {
        foreach($finding as $chemicals){
            $chemicals['finding_date_completed'] =  CommonService::dateChange($chemicals['finding_date_completed']);
            $result =  $this->findingService->update($chemicals,$chemicals['finding_id']);
        }
    }
}    