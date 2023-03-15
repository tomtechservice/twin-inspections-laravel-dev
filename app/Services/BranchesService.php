<?php
namespace App\Services;

use App\Models\Branch;

use Auth;
use DB;

class BranchesService{
    public function __construct(){
        $branch = new Branch();
    }
    public function getBranch($id, $keyword = '', $search_type = '', $limit = 0, $offset = 0){
        if ($id == 0) {
			if ($search_type == 'search') {                
                return Branch::where('branch_name','LIKE','%'.$keyword.'%')
                                ->where('branch_is_deleted','0')
                                ->get();
			} else {
                return Branch::where('branch_is_deleted','0')
                                ->get();
			}
		} else {
            return Branch::where('branch_id',$id)->get();	
		}
    }
}