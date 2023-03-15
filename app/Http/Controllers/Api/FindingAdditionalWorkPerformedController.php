<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\FindingAdditionalWorkPerformedService;

class FindingAdditionalWorkPerformedController extends Controller
{
    function __construct(){
        $this->additionalWorkService = new FindingAdditionalWorkPerformedService();
    }
    public function getAdditionalWork($jobId){
        return $this->additionalWorkService->getAdditionalWork($jobId);
    }
    public function doAdditionalWork(Request $request){
        return $this->additionalWorkService->doAdditionalWork($request->all());
    }
    public function getFindingAdditionalWork($id){
        return $this->additionalWorkService->getFindingAdditionalWork($id);
    }
    public function updateCompletionDate(Request $request){
        return $this->additionalWorkService->updateCompletionDate($request->all());
    }
    public function onDelete(Request $request){
        return $this->additionalWorkService->onDelete($request->all());
    }
}
