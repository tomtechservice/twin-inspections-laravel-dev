<?php

namespace App\Http\Controllers\Login;

use App\Services\CommonService;
use App\Services\UserService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use URL;
use Google_Client;
use Google_Service_Sheets;
use Google_Service_Drive;

class GoogleController extends Controller
{
	protected $tokenPath = '../token.json';

	public function getClientObject(){
		$client = new Google_Client();
	    $client->setApplicationName('Google Sheets API PHP Quickstart');
	    $client->setScopes(\Google_Service_Sheets::DRIVE_READONLY, \Google_Service_Sheets::SPREADSHEETS_READONLY);
	    
	    $client->setAuthConfig('../client_secret_sheet.json');
	    $client->setAccessType('offline');
	    $client->setPrompt('select_account consent');
	    $client->setRedirectUri(URL::to('goog/callback'));
	    return $client;
	}
	public function getLogin(){
		
		$client = $this->getClientObject();
	    // $authUrl = $client->createAuthUrl();
	    // return redirect($authUrl);

	    if (file_exists($this->tokenPath)) {
	        $accessToken = json_decode(file_get_contents($this->tokenPath), true);       
	        $client->setAccessToken($accessToken);
	    }
	    // If there is no previous token or it's expired.
	    if ($client->isAccessTokenExpired()) {
	        // Refresh the token if possible, else fetch a new one.
	        if ($client->getRefreshToken()) {
	            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
	        } else {
	            // Request authorization from the user.
	            $authUrl = $client->createAuthUrl();
	            return redirect($authUrl);
	        }
	        $this->saveToken($client);
	        
	    }
	    echo 'Thank you';
	}
	public function callBack(Request $request){
		$client = $this->getClientObject();
		$accessToken = $client->fetchAccessTokenWithAuthCode($request->get('code'));
	    $client->setAccessToken($accessToken);
	    $this->saveToken($client);
	    echo 'Thank you';
	}
	public function saveToken($client){
        file_put_contents($this->tokenPath, json_encode($client->getAccessToken()));
        return true;
	}
	public function getGoogleSheet(){
		$client = $this->getClientObject();
		$spreadsheetId = '15_wgkLyThbXlLBcQI5-j72DI8cfEuQGqmD0D0vDiBmE';

		$service = new Google_Service_Sheets($client);
		if (file_exists($this->tokenPath)) {
	        $accessToken = json_decode(file_get_contents($this->tokenPath), true);       
	        $client->setAccessToken($accessToken);
	    }
		
		$range = 'AuburnHome';
		$response = $service->spreadsheets_values->get($spreadsheetId, $range);
		$values = $response->getValues();

		if (empty($values)) {
		    return [];
		} else {
		    // array_shift($values);
		    $data = collect($values);
		    dd($data);
		}
		// $service = new Google_Service_Drive($client);
		// if (file_exists($this->tokenPath)) {
	 //        $accessToken = json_decode(file_get_contents($this->tokenPath), true);       
	 //        $client->setAccessToken($accessToken);
	 //    }
		// $response = $service->files->get($spreadsheetId, 'text/csv', array('alt' => 'media'));
		// $content = $response->getBody()->getContents();
		// return $content;
	}
}