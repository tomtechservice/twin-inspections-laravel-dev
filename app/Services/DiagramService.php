<?php
namespace App\Services;
use App\Services\ReportService;
use App\Services\LogService;

use Storage;

class DiagramService
{
    // public function __construct(ReportService $reportService)
    // {
    //     $this->reportService = $reportService;
    // }
    public function __construct()
    {
        $this->reportService = new ReportService();
    }
    public function upload($data){
        $jid = $data['report']['job_id'];
        $report_id = $data['report']['report_id'];
        $snapshot = $data['snapshot'];
        $img = $data['image'];

        $img = str_replace('data:image/png;base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $data2 = base64_decode($img);
        $fname = uniqid() . '.png';

        $diagram_dir = 'media/diagrams/' . $jid . '/'.$fname;
        $contentType='image/png';
        $storage = Storage::disk('spaces')->put($diagram_dir,$data2, ['visibility' => 'public',
        'mimetype' => $contentType]);

        $report = array(
            'report_diagram_file' => $fname,
            'report_diagram_vector' => $snapshot
        );

        $result = $this->reportService->update($report,$report_id);
        LogService::singleChanges( 
            $jid,
            'Diagram Updated', 
            'report_diagram_vector'
        );
        return $result;
        
    }
    public function clearCache($job_id){
        $report = array(
            'report_diagram_vector' => Null
            );
        $result = $this->reportService->updateBaseJobId($report,$job_id);
        return $result;
    }
    public function diagramUpload($diagram_dir,$data2,$contentType){
        $storage = Storage::disk('spaces')->put($diagram_dir,$data2, ['visibility' => 'public',
        'mimetype' => $contentType]);
        return $storage;
    }

    public function getStorage()
    {
        return Storage::disk('spaces');
	}
   	
}
