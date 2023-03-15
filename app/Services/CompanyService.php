<?php
namespace App\Services;

use App\Models\User;
use App\Models\Company;

use Auth;


class CompanyService
{
    // function __construct(User $user, Company $company)
	// {
    //     $this->user = $user;
    //     $this->company = $company;
    // }
    function __construct()
	{
        $this->user = new User();
        $this->company = new Company();
    }
    public function save( $data)
    {
        $company = new $this->company;
        $result = $company->create($data);
        return $result->company_id;
    }
    public function update($data,$id)
    {
        $company = $this->company->find($id);
        if($company){
             $company->update($data);
        }
        return $id;
    }
    public function getAllCompany()
    {
        return $this->company->get();
    }
    public function searchCompany($request){
        return $this->company->where('company_name', 'LIKE', "%$request->search%")
        ->limit(10)
        ->get();
    }
    public function searchAll($company){
        return $this->company->where('company_name', 'LIKE', "%$company%")
        ->get();
    }
    

   
}    