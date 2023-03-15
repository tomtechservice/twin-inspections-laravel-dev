<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\BranchesService;

class BranchesController extends Controller
{
    public function __construct(){
        $this->branchesService = new BranchesService();
    }
    public function getBranch($id){
        return $this->branchesService->getBranch($id);
    }
}
