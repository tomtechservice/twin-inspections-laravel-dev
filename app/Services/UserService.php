<?php
namespace App\Services;

use App\Models\User;
use App\Models\AutoLogin;
use App\Services\CommonService;
use Auth;
use URL;
use DB;

class UserService
{
 //    function __construct(User $user)
	// {
 //        $this->user = $user;
 //    }
    function __construct()
    {
		$this->user = new User();
		$this->service = new CommonService();
    }
    public function loginCheck($request) {
        return $this->user
        	->where('user_email', $request->username)
        	->where('user_password', md5($request->password))
        	->where('user_is_deleted', 0)
        	->first();
    }

    public function setLogin($user, $request){
    	if($request->has('remember')){
    		Auth::login($user, true);
    	} else {
    		Auth::login($user);
    	}
    	return TRUE;
    }

    public function autoLoginGlobal($user){
    	$token = md5(mt_rand());
    	$minutes_to_add = 30;

		$time = new \DateTime(date('Y-m-d H:i:s'));
		$time->add(new \DateInterval('PT' . $minutes_to_add . 'M'));
		$expiryDate = $time->format('Y-m-d H:i:s');


    	$autoLogin = new AutoLogin();
    	$autoLogin->token = $token;
    	$autoLogin->user_id = $user->user_id;
    	$autoLogin->created_date = date('Y-m-d H:i:s');
    	$autoLogin->expiry_date = $expiryDate;
    	$autoLogin->save();

    	return redirect(config('site.old_site').'/index.php?/autologin/index/'.$token.'?redir='.urlencode(URL::to('callback')));

	}


	public function getContractorsList(){
		return $this->user
				->where('user_level_id','=','16')
				->where('user_is_deleted','=','0')
				->orderBy('user_last_name','asc')
				->get();
	}
	public function getNameStringOfUser($userId){
		$user = $this->getUser($userId);
		if (!empty($user)) {
			$userArray = $user->toArray();
			$userArray = $userArray['0'];
			return $userArray['user_last_name'].', '.$userArray['user_first_name'];
		}
	}
	public function getUser($id, $keyword = '', $search_type = '', $limit = 0, $offset = 0){
		if ($id == 0) {
			if ($search_type == 'search') {
				return	DB::table('user')
					->where('user_last_name','like','%'.$keyword.'%')
					->where('user_id', '!=', '1')
					->where('user_is_deleted', '=', '0')
					// ->limit($limit)
					// ->offset($offset)
					->get();
			} elseif ($search_type == 'sort') {
				return	DB::table('user')
					->where('user_level_id','=', $keyword)
					->where('user_id', '!=', '1')
					->where('user_is_deleted', '=', '0')
					->orderBy('user_first_name','asc')
					// ->limit($limit)
					// ->offset($offset)
					->get();
			} else {
				return	DB::table('user')
					->where('user_id', '!=', '1')
					->where('user_is_deleted', '=', '0')
					// ->limit($limit)
					// ->offset($offset)
					->get();
			}
		}else{
			return $this->user->where('user_id','=', $id)->get();		
		}
	}
	public function getCrewTreaterList(){
		 return  $this->user->where('user_is_treater','1')
							->where('user_is_deleted','0')
							->orderBy('user_last_name','asc')
							->get();
	}
	public function getCrewListSpec(){
		$crewListQuery = "SELECT * FROM `user` WHERE `user_level_id` = '15' OR ( `user_level_id` = '2' AND `user_is_crew` ) AND `user_is_deleted` = '0' ORDER BY `user_last_name` ASC";
		return $this->service->dbQuery($crewListQuery);
	}


	public function findUser($id) {
        return $this->user->find($id);
    }

	
	public function getAssigneeList($type) {
		if($type == 'crew') {
			$data = $this->user->where('user_is_deleted',0)
					->where(function ($query) {
						$query->where('user_level_id',15)
						->orWhere(function ($query) {
							$query->where('user_level_id',2)	 
							->where('user_is_crew',1); 
						});
					})
					->orderBy('user_last_name', 'asc')
					->get();
		}
		if($type == 'contractor') {
			$data = $this->user->where('user_is_deleted',0)
					->where('user_level_id',16)
					->orderBy('user_last_name', 'asc')
					->get();
		}
		if($type == 'inspector') {
			$data = $this->user->where('user_is_deleted',0)
					->where('user_level_id',2)
					->orderBy('user_last_name', 'asc')
					->get();
		}
		if($type == 'treater') {
			$data = $this->user->where('user_is_deleted',0)	
					->where(function ($query) {
						$query->where('user_level_id',15)
							->orWhere('user_level_id',2);	 	
					})
					->where('user_is_treater',1)
					->orderBy('user_last_name', 'asc')
					->get();
		}
		$result = [];
		$i= 0;
		if(count($data) > 0) {
			foreach($data as $dt) {
				$result[$i]['user_id'] = $dt->user_id;
				$result[$i]['user_is_treater'] = $dt->user_is_treater;
				$result[$i]['user_last_name'] = $dt->user_last_name; 
				$result[$i]['user_first_name'] = $dt->user_first_name; 
				$result[$i]['assignee_type'] = $type; 
				$result[$i]['user_is_treater'] = $dt->user_is_treater;
				$result[$i]['user_level_id'] = $dt->user_level_id;
				$i++;
			}	
		}
		return $result;
	}


	public function getUsersList() {
		return $this->user->select('*', DB::raw("CONCAT(user_first_name,' ',user_last_name) AS user_full_name"))
		->where('user_is_deleted','=','0')
		->orderBy('user_last_name','asc')
		->get();
	}
}    