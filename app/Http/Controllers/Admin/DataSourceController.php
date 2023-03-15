<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Services\DataSourceService;
use Auth;
use Redirect;

class DataSourceController extends Controller
{
    

    public function __construct(DataSourceService $dataSourceService)
    {
        $this->dataSourceService = $dataSourceService;
    }

    public function index()
    {
    	$sources = $this->dataSourceService->getAll();
        return view('admin.datasources.index', ['sources'=>$sources]);
    }

    public function getAdd(Request $request)
    {
    	$id = $request->get('id');
        $status = ['active','deleted'];
        if($id){
            $source = $this->dataSourceService->get($id);
        } else {
            $source = new $this->dataSourceService->dataSource;
        }
       
        return view('admin.datasources.add', [
            'source' => $source,
            'status' => $status
        ]);
    }
    
    public function postAdd(Request $request)
    {

        $v =  Validator::make($request->all(),
            [
               'name'=> 'required|min:2|max:255',
               'api_url'=> 'required|min:2|max:255|unique:data_sources,api_url,'.$request->get('id'),
               'slug'=> 'required|min:2|max:100|unique:data_sources,slug,'.$request->get('id')
            ]
        );
        if($v->fails()) {
            return back()->withInput()->withErrors($v);
        }
        if($request->get('id') === null){
            $this->dataSourceService->save($request);
            return redirect('admin/datasources/index')->with('success','Success');
        } else {
            $this->dataSourceService->update($request, $request->get('id'));
            return redirect('admin/datasources/index')->with('success','Success');
        }

    }
}
