<?php
namespace App\Services;

use App\Models\DataSource;

class DataSourceService
{
    // function __construct(DataSource $dataSource) {
    //    $this->dataSource = $dataSource;
   	// }
	function __construct() {
       $this->dataSource = new DataSource();
   	}
	public function getAll(){
		return $this->dataSource->orderBy('id','ASC')->get();
	}
	public function get($id){
		return $this->dataSource->find($id);
	}

	public function save($request){
		$source = new $this->dataSource;
		$source->name = $request->name;
		$source->status = $request->status;
		$source->api_url = $request->api_url;
		$source->slug = $request->slug;
		$source->save();
		return true;
	}

	public function update($request, $id){
		$source = $this->get($id);
		$source->name = $request->name;
		$source->status = $request->status;
		$source->api_url = $request->api_url;
		$source->slug = $request->slug;
		$source->save();
		return true;
	}
   	
}