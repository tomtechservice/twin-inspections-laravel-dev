<?php
namespace App\Services;

use App\Models\Job;

class AppJobService
{
	function __construct(Job $job)
	{
        $this->job = $job;
    }


    public function with($attribute){
    	return $this->job->with($attribute);
    }

    

    public function find($id){
    	return $this->job->find($id);
    }


    

}