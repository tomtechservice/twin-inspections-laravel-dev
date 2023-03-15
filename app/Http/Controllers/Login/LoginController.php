<?php

namespace App\Http\Controllers\Login;

use App\Services\CommonService;
use App\Services\UserService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use JWTAuth;
use App\Models\AppUrl;
use URL;

class LoginController extends Controller
{
    
    public function __construct()
    {
        
    }
    
    public function getLogin(CommonService $commonService)
    {
        // Auth::logout();
        // echo JWTAuth::getToken(); die;
        // if(JWTAuth::getToken()){
        //     return redirect(URL::to('callback'));
        // }
        $settings_data = $commonService->getSettings();
        return view('login.login')->with('settings',$settings_data);
    }

    public function postLogin(Request $request, UserService $userService)
    {
     
        $validatedData = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if($user = $userService->loginCheck($request)){
            if($userService->setLogin($user, $request)){
                return $userService->autoLoginGlobal($user);
            }
        } else {
            return back()->with('error','Wrong email or password');
        }
    }

    public function callback()
    {
        return view('login/callback');
    }

    public function authToken(Request $request)
    {
        $user = Auth::user();
        $userInfo = [
            'user_first_name' => $user->user_first_name, 
            'user_last_name' => $user->user_last_name,
            'user_level' => $user->user_level->user_level_name
        ];
        // Get the token
        $token = JWTAuth::fromUser($user);
        return ['status' => '1','token' => $token, 'user' => $userInfo ];
    }

    public function redirectManage($slug, $id=NULL){
        if(Auth::user()){
            $newSlug = str_replace('_', '-', $slug);
            $exists = AppUrl::where('url', $newSlug)->where('active', 1)->first();
            if($exists){
                if($id){
                    $newSlug = $newSlug.'/'.$id;
                }
                return redirect(config('site.ang_site').'/'.$newSlug);
            } else {
                $user = Auth::user();
                $slug = str_replace('~', '/', $slug);
                if($id){
                    $slug = $slug.'/'.$id;
                }
                if($user->user_level->user_level_name == 'administrator' || $user->user_level->user_level_name == 'inspector'){
                    $slug = $user->user_level->user_level_name.'/'.$slug;
                } else {
                    $slug = 'staff/'.$slug;
                }
                return redirect(config('site.old_site').'/index.php?/'.$slug);
            }
        } else {
            return redirect('/login');
        }
        
    }

}    