<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\CompanyService;

class CompanyController extends Controller
{
    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }
    public function getAllCompany(){
        return $this->companyService->getAllCompany();
    }
    public function searchCompany(Request $request){
        return $this->companyService->searchCompany($request);
    }
    public function searchAllCompany($search){
        // dd($search);
        $company =  $this->companyService->searchAll($search);
        if(!$company){
            return response()->error('No Data');
        } 
        return response()->success($company);
    }
}
