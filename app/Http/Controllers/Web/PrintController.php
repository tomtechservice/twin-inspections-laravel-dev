<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\CommonService;
use App\Services\JobService;
use URL;

class PrintController extends Controller
{
	public function getPrintFieldSheet($id){
		$serverName = env("OLD_SITE", " ");
		$postData['jid'] = $id;
		$curlURL = $serverName."/pdf/generate/make_findings_blank_pdf.php";
        $generatePdf = CommonService::generatePdf($postData,$curlURL);
        $url = URL::to('view-pdf/field-sheet/'.$id.'.pdf');
        return view('web.print.field_sheet', ['url'=>$url]);
        
	}
	public function viewPrint($id){

		$jobService = new JobService();
		$result = $jobService->findJob($id);
        if($result && $result->job_findings_blank_pdf_file){
        	$url = env('DO_SPACE').'media/reports/'.$id.'/'.$result->job_findings_blank_pdf_file;

        	return response(file_get_contents($url))->header('Content-Type', 'application/pdf');
        }
	}
}