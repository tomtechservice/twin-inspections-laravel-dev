<?php
namespace App\Services;

use App\Models\User;
use App\Models\Client;
use App\Models\Job;
use App\Models\ActivityMeta;
use App\Models\AuthorizePayment;
use App\Services\CommonService;
use Yajra\DataTables\Facades\DataTables;

use Auth;
use DB;


class ClientService
{
    function __construct()
	{
        $this->user = new User();
        $this->client = new Client();
        $this->authorizePayment = new AuthorizePayment();
        $this->service = new CommonService();

    }
    public function newClient(){
        return new $this->client;
    }
    public function save( $data)
    {
        $client = new $this->client;
        $result = $client->create($data);
        return $result->client_id;
    }
    public function update($data,$id)
    {
        $client = $this->client->find($id);
        if($client){
             $client->update($data);
        }
        return $id;
    }
    public function getAllClients()
    {
        return $this->client->get();
    }
    public function getLimitClients($page)
    {
        return $this->client->paginate(20,['*'],'page',$page);
    }

    public function getClientsFromJobs($fromDate, $toDate, $search = NULL){
        $fromDate =  $this->service->dateFormat($fromDate)." 00:00:00";
        $toDate = $this->service->dateFormat($toDate)." 23:59:59";

        $clients = Job::where(function ($query) use ($fromDate, $toDate) {
            $query->whereBetween('job_date_scheduled', [$fromDate, $toDate])
            ->orWhereBetween('job_completed_date', [$fromDate, $toDate]);
        });
       
        if($search){
            $clients->with('client_search')->whereHas('client_search', function ($query) use ($search) {
               $query->where('client.client_first_name', 'LIKE', "%$search%")
                ->orWhere('client.client_last_name', 'LIKE', "%$search%")
                ->orWhereRaw("concat(client.client_first_name, ' ', client.client_last_name) like '%$search%' ")
                ->orWhereRaw("concat(client.client_last_name, ' ', client.client_first_name) like '%$search%' ");
            });
        }
        $results = $clients->groupBy('client_id')->paginate(25);
        
        return $results;
    }
    public function getClient($client_id){
        return $this->client->where('client_id',$client_id)->first();
    }
    public function searchClient($request){
        $client = $this->client->select('*');
        if($request->client_first_name){
            
            $client->where('client_first_name', 'LIKE', "%$request->client_first_name%");
        }
        if($request->client_last_name){
            
            $client->where('client_last_name', 'LIKE', "%$request->client_last_name%");
        }
        if($request->client_email){
            
            $client->where('client_email', 'LIKE', "%$request->client_email%");
        }
        
        return $client->take(5)->get();
        
    }
    public function getClients($request){
        $clients = $this->client
        ->where('client_first_name', 'LIKE', "%$request->search%")
        ->orWhere('client_last_name', 'LIKE', "%$request->search%")
        ->orWhereRaw("concat(client_first_name, ' ', client_last_name) like '%$request->search%' ")
        ->limit(10)
        ->get();
        foreach ($clients as $key=>$client) {
            $client->full_name = $client->client_first_name.' '.$client->client_last_name;
            $clients[$key] = $client;
        }
        return $clients;
    }
    public function findClient($id)
    {
        $client = $this->client->find($id);
        return $client;
    }
    public function getAllEmail($idArray)
    {
        $client = $this->client->whereIn('client_id',$idArray)->get();
        return $client;
    }

    public function addAuthorizePayment($data){
        $authorizePayment = new $this->authorizePayment;
        $result = $authorizePayment->create($data);
        return $result->id;
    }
    public function getAuthorizePayments($clientId){
        return $this->authorizePayment->where('client_id', $clientId)->orderBy('id', 'DESC')->get();
    }
    public function inspectorList($user_sql){
        $sqli = "SELECT * FROM user WHERE user_level_id = 2" . $user_sql;
        $result = $this->service->dbQuery($sqli);
        return $result;
    }
    public function activityMeta($data){
        $result = ActivityMeta::create($data);
        return $result;
    }
    public function editClient($client_id){
        return $this->client->where('client_id',$client_id)->with('company','jobs.property')->first();
    }
    public function getClientDataTable($request) {
        // $req_data = $request->all();
        $client = Client::where('client_is_deleted',0)->with('company')->select('client.*');
        // if ($req_data['order'][0]['column'] == 1) {
        //     $sorting_order = $req_data['order'][0]['dir'];
        //     if($sorting_order == 'asc'){
        //     }
        // }
        return Datatables::of($client)->whitelist([
                'client_id',
                'name',
                'company.company_name', 
                'client_address1',
                'client_phone',
                'client_email',
                'client_type',
                'client_last_name',
                'client_first_name',
                'client_address2',
                'client_city',
                'client_state',
                'client_zip'

            ])
            ->addColumn('name', function (Client $user) {
                return "$user->client_last_name , $user->client_first_name";
            })
            ->addColumn('address', function (Client $user) {
                return "$user->client_address1 \n $user->client_address2 \n $user->client_city $user->client_state, $user->client_zip";
            })
            ->filterColumn('name', function($query, $keyword) {
                $query
                ->orWhere('client.client_first_name', 'LIKE', '%'.$keyword.'%')
                ->orWhere('client.client_last_name', 'LIKE', '%'.$keyword.'%');
            })
            ->filterColumn('address', function($query, $keyword) {
                $query
                ->orWhere('client.client_address1', 'LIKE', '%'.$keyword.'%')
                ->orWhere('client.client_address2', 'LIKE', '%'.$keyword.'%')
                ->orWhere('client.client_city', 'LIKE', '%'.$keyword.'%')
                ->orWhere('client.client_state', 'LIKE', '%'.$keyword.'%')
                ->orWhere('client.client_zip', 'LIKE', '%'.$keyword.'%');
            })
            ->make(true); 
    }
   
    public function getPreferredInspectors($client_id){
        $sqli = "SELECT u.user_id, u.user_first_name, u.user_last_name FROM preferred_inspectors p INNER JOIN user u ON p.inspector_user_id=u.user_id WHERE p.client_id = " . $client_id;
        $result = $this->service->dbQuery($sqli);
        return $result;
    }
   
}    