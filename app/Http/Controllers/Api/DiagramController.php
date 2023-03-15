<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\DiagramService;

class DiagramController extends Controller
{
    public function __construct(DiagramService $diagram)
    {
        $this->diagram = $diagram;
    }
    public function add(Request $request){
        $result = $this->diagram->upload($request->all());
        return $result;
    }
    public function cacheClear($job_id){
        $result = $this->diagram->clearCache($job_id);
        return $result;
    }
}
