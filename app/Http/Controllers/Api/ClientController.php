<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ClientService;
use App\Services\AuthorizeService;
use App\Services\CardDetailsService;
use App\Services\CommonService;
use App\Services\CompanyService;
use Illuminate\Support\Facades\Validator;
use Auth;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->clientService = new ClientService();
        $this->card = new CardDetailsService();
        $this->commonService = new CommonService();
        $this->companyService = new CompanyService();
    }
    public function searchClient(Request $request){
        return $this->clientService->searchClient($request);
    }
    public function getClients(Request $request){
        return $this->clientService->getClients($request);
    }
    public function getAllClients(){
        return $this->clientService->getAllClients();
    }
    public function cardDetails(Request $request, $id)
    {
        // dd($request->address_billing['billing_first_name']);
        // dd($request->all());
        $validator = $this->validation($request->all());
        if ($validator->fails()) {
            $result =  $validator->messages()->first();
            return response()->error($result);
        }

        $client =  $this->clientService->findClient($id);
        if(!$client){
            return response()->error('invalid Client Id');
        }
        $request->card_number = $request->card_number;
        $request->card_date = "$request->exp_year-$request->exp_day";
        $request->card_vcc = $request->cvv;
        
        if($request->billing_address){
            $request->billing_first_name = $client->client_first_name;
            $request->billing_last_name = $client->client_last_name;
            $request->billing_company_name = $client->client_company_name;
            $request->billing_address1 = $client->client_address1;
            $request->billing_city = $client->client_city;
            $request->billing_state = $client->client_state;
            $request->billing_zip = $client->client_zip;
            $request->billing_phone = $client->client_phone;
        }else{
            // dd($request->address_billing['billing_first_name']);
            $request->billing_first_name = $request->address_billing['billing_first_name'];
            $request->billing_last_name = $request->address_billing['billing_last_name'];
            $request->billing_company_name = $request->address_billing['billing_company_name'];
            $request->billing_address1 = $request->address_billing['billing_address1'];
            $request->billing_city = $request->address_billing['billing_city'];
            $request->billing_state = $request->address_billing['billing_state'];
            $request->billing_zip = $request->address_billing['billing_zip'];
            $request->billing_phone = $request->address_billing['billing_phone'];
        }

        $serviceAuth = new AuthorizeService($request);

        if($client && $client->client_profile_id==null ){
            
            $response =  $serviceAuth->createProfile();
            if($response['status']!=200){
                return response()->error($response['message']);
            }
            // client info save
            $profile_id = $response['profile_id'];
            $client_info = array(
                'client_profile_id'=>$response['profile_id']
            );
            $this->clientService->update($client_info,$id);
            // return response()->success($response['message']);
        } else {
            $profile_id = $client->client_profile_id;
            $response = $serviceAuth->createPaymentProfile($client->client_profile_id);
            if($response['status']!=200){
                return response()->error($response['message']);
            }
        }

        $cardType = 'Unknown';
        // checking if customer payment profile is done
        
        $paymentProfile = $serviceAuth->getCustomerPaymentProfile(
            $profile_id, $response['payment_id']
        );
        if(($paymentProfile != null)){
            if ($paymentProfile->getMessages()->getResultCode() == "Ok"){
                $cardType = $paymentProfile->getPaymentProfile()->getPayment()->getCreditCard()->getCardType();
            }
        } else {
            return response()->error('Error');
        }
        // card info save
        $masked =  str_pad(
            substr($request->card_number, -4), strlen($request->card_number), '*', STR_PAD_LEFT
        );
        $card_info =array(
            'client_profile_id' => $profile_id,
            'payment_profile_id' => $response['payment_id'],
            'card_display_name' => "$client->client_first_name $client->client_last_name",
            'card_number' => $masked,
            'card_type' => $cardType,
            'exp_date' => $request->card_date,
            'client_id' => $id,
            'is_delete' => 0,

            'billing_first_name'=>$request->billing_first_name,
            'billing_last_name'=>$request->billing_last_name,
            'billing_company_name'=>$request->billing_company_name,  
            'billing_address1'=>$request->billing_address1,
            'billing_city'=>$request->billing_city,  
            'billing_state'=>$request->billing_state, 
            'billing_zip'=>$request->billing_zip,  
            'billing_phone'=>$request->billing_phone,

        );
        $this->card->save($card_info);
        
        return response()->success($response);
    }
    public function cardPublic(Request $request)
    {
        
        $validator = $this->validationFromApi($request->all());
        if ($validator->fails()) {
            $result =  $validator->messages()->first();
            return response()->error($result);
        }

        $cardNumber = $this->commonService->encrypt_decrypt('decrypt', $request->card_number);
        $cardCvv = $this->commonService->encrypt_decrypt('decrypt', $request->cvv);
        $id = $this->commonService->encrypt_decrypt('decrypt', $request->client_id);

        $client =  $this->clientService->findClient($id);
        if(!$client){
            return response()->error('invalid Client Id');
        }
        $request->card_number = $cardNumber;
        $request->card_date = "$request->exp_year-$request->exp_day";
        $request->card_vcc = $cardCvv;
        
        if($request->client_first_name && $request->client_address1){
            $request->billing_first_name = $request->client_first_name;
            $request->billing_last_name = $request->client_last_name;
            $request->billing_company_name = $request->client_company_name;
            $request->billing_address1 = $request->client_address1;
            $request->billing_city = $request->client_city;
            $request->billing_state = $request->client_state;
            $request->billing_zip = $request->client_zip;
            $request->billing_phone = $request->client_phone;
        }else{
            $request->billing_first_name = $client->client_first_name;
            $request->billing_last_name = $client->client_last_name;
            $request->billing_company_name = $client->client_company_name;
            $request->billing_address1 = $client->client_address1;
            $request->billing_city = $client->client_city;
            $request->billing_state = $client->client_state;
            $request->billing_zip = $client->client_zip;
            $request->billing_phone = $client->client_phone;
        }

        $serviceAuth = new AuthorizeService($request);

        if($client && $client->client_profile_id == null ){
            
            $response =  $serviceAuth->createProfile();
            if($response['status'] != 200){
                return response()->error($response['message']);
            }

            $profile_id = $response['profile_id'];
            $client_info = array(
                'client_profile_id' => $response['profile_id']
            );

            $this->clientService->update($client_info,$id);
        } else {
            $profile_id = $client->client_profile_id;

            $response = $serviceAuth->createPaymentProfile($client->client_profile_id);

            if($response['status'] != 200){
                return response()->error($response['message']);
            }
        }

        $cardType = 'Unknown';
        // checking if customer payment profile is done
        $paymentProfile = $serviceAuth->getCustomerPaymentProfile(
            $profile_id, $response['payment_id']
        );
        if(($paymentProfile != null)){
            if ($paymentProfile->getMessages()->getResultCode() == "Ok"){
                $cardType = $paymentProfile->getPaymentProfile()->getPayment()->getCreditCard()->getCardType();
            }
        } else {
            return response()->error('Error');
        }
        // card info save
        $masked =  str_pad(
            substr($request->card_number, -4), strlen($request->card_number), '*', STR_PAD_LEFT
        );
        $card_info =array(
            'client_profile_id' => $profile_id,
            'payment_profile_id' => $response['payment_id'],
            'card_display_name' => "$client->client_first_name $client->client_last_name",
            'card_number' => $masked,
            'card_type' => $cardType,
            'exp_date' => $request->card_date,
            'client_id' => $id,
            'is_delete' => 0,

            'billing_first_name'=>$request->billing_first_name,
            'billing_last_name'=>$request->billing_last_name,
            'billing_company_name'=>$request->billing_company_name,  
            'billing_address1'=>$request->billing_address1,
            'billing_city'=>$request->billing_city,  
            'billing_state'=>$request->billing_state, 
            'billing_zip'=>$request->billing_zip,  
            'billing_phone'=>$request->billing_phone,
            
        );
        $this->card->save($card_info,$id);
        
        return response()->success($response);
    }
    public function cardList($clientId)
    {
        $client =  $this->card->cardList($clientId);
        if(!$client){
            return response()->error('invalid Client Id');
        }
        return response()->success($client);
    }
    public function cardDelete(Request $request,$id)
    {
        $card =  $this->card->findCard($id);
        if(!$card){
            return response()->error('invalid');
        }
        $serviceAuth = new AuthorizeService($request);
        $response = $serviceAuth->deleteCustomerPaymentProfile($card->client_profile_id,$card->payment_profile_id);         
        if($response['status']!=200){
            return response()->error($response['message']);
        }
        $client =  $this->card->cardDelete($id);
        if(!$client){
            return response()->error('invalid ');
        }
        return response()->success($response);
    }
    public function validation($request)
    {
        $validator = Validator::make($request, [
            'card_number' => 'required|numeric',
            'exp_day' => 'required',
            'exp_year' => 'required',
            'cvv' => 'required|max:3',
        ]);
        return $validator;
    }
    public function validationFromApi($request)
    {
        $validator = Validator::make($request, [
            'card_number' => 'required',
            'exp_day' => 'required',
            'exp_year' => 'required',
            'cvv' => 'required',
        ]);
        return $validator;
    }
    //////
    ///
    public function postPayment(Request $request, $clientId){
        $validator = Validator::make($request->all(), [
            'payment_amount' => 'required',
            'payment_profile_id' => 'required'
        ]);
        if ($validator->fails()) {
            $result =  $validator->messages()->first();
            return response()->error($result);
        }
        
        $paymentProfileId = $request->payment_profile_id;
        $paymentAmount = $request->payment_amount;


        $cardDetails = $this->card->getCardForPayment($paymentProfileId, $clientId);
        if($cardDetails){

            $clientProfileId = $cardDetails->client_profile_id;

            $authprizeService = new AuthorizeService($request);

            $response = $authprizeService->chargeCustomerProfile(
                $clientProfileId, 
                $paymentProfileId,
                $paymentAmount
            );
            if($response && $response['status'] == 200){
                $data = $response['data'];
                $data['payment_amount'] = $paymentAmount;
                $data['card_details_id'] = $cardDetails->id;
                $data['client_id'] = $cardDetails->client_id;
                $this->clientService->addAuthorizePayment($data);
                return response()->success($response['message']);
            } else {
                return response()->error($response['message']);
            }
        } else {
            return response()->error('Error');
        }
        
    }
    public function getPayments($clientId){
        $payments =  $this->clientService->getAuthorizePayments($clientId);
        return response()->success($payments);
    }
    public function addClient(Request $request,$clientId){
        // new Client
        $new_client=$request->new_client;
        // new company
        $company = $request->new_client['new_company'];
        // dd($company);
        $company['company_name'] = $new_client['company_name'];
        unset($new_client['new_company']);
        unset($new_client['company_name']);
        // dd($new_client);
        $validator = Validator::make($new_client, [
            'client_first_name' => 'required',
            'client_last_name' => 'required',
            'client_type'  => 'required',
            'client_address1'  => 'required',
            'client_city'  => 'required',
            'client_zip'  => 'required|numeric',
            'client_phone'  => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
            'client_email'  => 'required|email|',
        ]);
        if ($validator->fails()) {
            $result =  $validator->messages()->first();
            return response()->error($result);
        }
        // save Company
        $coid = 0;
        if($request->company_id !=0){
            $coid = $request->company_id;
            
        }else{
            if($company['company_name'] !=''){
                $coid = $this->companyService->save($company);
            }  
        }
        $new_client['company_id']= $coid;

        if ($coid == 0) {
            // $is_company = 0;
            $new_client['client_is_company'] = 0;
        } else {
            $new_client['client_is_company'] = 1;
            // $is_company = 1;
        }
             
        // client add & edit
        if($clientId !=0){
            // update
            $client_id = $this->clientService->update($new_client,$clientId);
            // activity_meta
            $data = array(
                'user_id' => Auth::id(),
                'ref_id' => $client_id,
                'activity_meta_type' => 'client_edit',
                'activity_meta_notes' => ''					   
            );
            $ff = $this->clientService->activityMeta($data);
        }else{
            // add new client
            $client_id = $this->clientService->save($new_client);

            
            // activity_meta
            $data = array(
                'user_id' => Auth::id(),
                'ref_id' => $client_id,
                'activity_meta_type' => 'new_client_added',
                'activity_meta_notes' => ''					   
            );
            $ff = $this->clientService->activityMeta($data);

        }
        return response()->success($client_id);

    }
    public function editClient($client_id){
        $client = $this->clientService->editClient($client_id);
        if(!$client){
            return response()->error('client Not Found');
        }
        return response()->success($client);
    }
    public function getClient($client_id)
    {
        return $this->clientService->getClient($client_id);
    }
    public function clientList(Request $request){
        // dd($request->all());
        return $this->clientService->getClientDataTable($request);
    }
    public function clientDelete($client_id){
        // dd($client_id);
        $data = array('client_is_deleted' => 1);
        $this->clientService->update($data,$client_id);
        return response()->success('success');
    }

    public function getPreferredInspectors($client_id){
        return $this->clientService->getPreferredInspectors($client_id);
    }
}
