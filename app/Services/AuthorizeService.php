<?php
namespace App\Services;

use net\authorize\api\contract\v1 as AnetAPI;
use net\authorize\api\controller as AnetController;
use Illuminate\Http\Request;

class AuthorizeService
{
	protected $merchantAuthentication = '';
	protected $paymentCreditCard = '';
	protected $billTo = '';
	protected $customerShippingAddress = '';
	protected $paymentProfiles = [];
	protected $paymentProfile = '';
	protected $customerProfile = '';

	public function __construct(Request $request)
    {
        $this->request = $request;
        // $this->authorize = new AuthorizeService();
    }
	public function setAuth(){
		$this->merchantAuthentication = new AnetAPI\MerchantAuthenticationType();
    	$this->merchantAuthentication->setName(env('MERCHANT_LOGIN_ID'));
    	$this->merchantAuthentication->setTransactionKey(env('MERCHANT_TRANSACTION_KEY'));
    	return true;
	}
	public function setCreditCard(){
		$creditCard = new AnetAPI\CreditCardType();
	    $creditCard->setCardNumber($this->request->card_number);
	    $creditCard->setExpirationDate($this->request->card_date);
	    $creditCard->setCardCode($this->request->card_vcc);
	    $this->paymentCreditCard = new AnetAPI\PaymentType();
	    $this->paymentCreditCard->setCreditCard($creditCard);
	    return TRUE;
	}
	public function setBilling(){
		$this->billTo = new AnetAPI\CustomerAddressType();
	    $this->billTo->setFirstName($this->request->billing_first_name);
	    $this->billTo->setLastName($this->request->billing_last_name);
	    $this->billTo->setCompany($this->request->billing_company_name);
	    $this->billTo->setAddress($this->request->billing_address1);
	    $this->billTo->setCity($this->request->billing_city);
	    $this->billTo->setState($this->request->billing_state);
	    $this->billTo->setZip($this->request->billing_zip);
	    $this->billTo->setCountry("USA");
	    $this->billTo->setPhoneNumber($this->request->billing_phone);
	    return TRUE;
	}
	public function setPaymentProfile(){
		$this->paymentProfile = new AnetAPI\CustomerPaymentProfileType();
	    $this->paymentProfile->setCustomerType('individual');
	    $this->paymentProfile->setBillTo($this->billTo);
	    $this->paymentProfile->setPayment($this->paymentCreditCard);
	    $this->paymentProfile->setDefaultpaymentProfile(true);
	    return TRUE;
	}
	public function setPaymentProfiles(){
	    $this->paymentProfiles[] = $this->paymentProfile;
	    return TRUE;
	}
	public function createProfile(){
		$this->setAuth();
		$this->setCreditCard();
		$this->setBilling();
		$this->setPaymentProfile();
		$this->setPaymentProfiles();

		$this->customerProfile = new AnetAPI\CustomerProfileType();
	    $this->customerProfile->setDescription($this->request->client_description);
	    $this->customerProfile->setMerchantCustomerId("M_" . time());
	    if(env('AUTHORIZE_TYPE') == 'PRODUCTION'){
	    	$this->customerProfile->setEmail($this->request->client_email);
	    } else {
	    	$this->customerProfile->setEmail(mt_rand()."@ecodons.com");
	    }
	    $this->customerProfile->setpaymentProfiles($this->paymentProfiles);
	    /////////////
    	$refId = 'REF_' . time();
    	// Assemble the complete transaction request
	    $request = new AnetAPI\CreateCustomerProfileRequest();
	    $request->setMerchantAuthentication($this->merchantAuthentication);
	    $request->setRefId($refId);
	    $request->setProfile($this->customerProfile);
	    // Create the controller and get the response
	    $controller = new AnetController\CreateCustomerProfileController($request);
	    $response = $controller->executeWithApiResponse(
	    	( env('AUTHORIZE_TYPE') == 'PRODUCTION') ? \net\authorize\api\constants\ANetEnvironment::PRODUCTION : \net\authorize\api\constants\ANetEnvironment::SANDBOX
	    );
		$result =array();
	    if (($response != null) && ($response->getMessages()->getResultCode() == "Ok")) {
			// echo "Succesfully created customer profile : " . $response->getCustomerProfileId() . "\n";
			$result['profile_id']= $response->getCustomerProfileId();
	        $paymentProfiles = $response->getCustomerPaymentProfileIdList();
			// echo "SUCCESS: PAYMENT PROFILE ID : " . $paymentProfiles[0] . "\n";
			$result['payment_id'] = $paymentProfiles[0];
			$result['status']=200;
			$result['message']="SUCCESS";
	    } else {
	        // echo "ERROR :  Invalid response\n";
	        $errorMessages = $response->getMessages()->getMessage();
			// echo "Response : " . $errorMessages[0]->getCode() . "  " .$errorMessages[0]->getText() . "\n";
			 
			$result['status']= $errorMessages[0]->getCode();
			$result['message']= $errorMessages[0]->getText();
	    }
		// return $response;
		return $result;
	}

	public function createPaymentProfile($existingcustomerprofileid){
		$this->setAuth();
		$this->setCreditCard();
		$this->setBilling();
		$this->setPaymentProfile();
		
    	$refId = 'REF_' . time();
		// Assemble the complete transaction request
	    $paymentprofilerequest = new AnetAPI\CreateCustomerPaymentProfileRequest();
	    $paymentprofilerequest->setMerchantAuthentication($this->merchantAuthentication);
	    // Add an existing profile id to the request
	    $paymentprofilerequest->setCustomerProfileId($existingcustomerprofileid);
	    $paymentprofilerequest->setPaymentProfile($this->paymentProfile);
	    // Create the controller and get the response
	    $controller = new AnetController\CreateCustomerPaymentProfileController($paymentprofilerequest);
	    $response = $controller->executeWithApiResponse(
	    	( env('AUTHORIZE_TYPE') == 'PRODUCTION') ? \net\authorize\api\constants\ANetEnvironment::PRODUCTION : \net\authorize\api\constants\ANetEnvironment::SANDBOX
		);
		$result =array();
	    if (($response != null) && ($response->getMessages()->getResultCode() == "Ok") ) {
			// echo "Create Customer Payment Profile SUCCESS: " . $response->getCustomerPaymentProfileId() . "\n";
			$result['payment_id'] = $response->getCustomerPaymentProfileId();
			$result['status']=200;
			$result['message']="SUCCESS";
	    } else {
	        // echo "Create Customer Payment Profile: ERROR Invalid response\n";
	        $errorMessages = $response->getMessages()->getMessage();
			// echo "Response : " . $errorMessages[0]->getCode() . "  " .$errorMessages[0]->getText() . "\n";
			$result['status']= $errorMessages[0]->getCode();
			$result['message']= $errorMessages[0]->getText();
	    }
	    return $result;
	}
	public function deleteCustomerPaymentProfile($customerProfileId, $customerpaymentprofileid ) {
    	$this->setAuth();
    
    	// Set the transaction's refId
    	$refId = 'REF_' . time();
    
		// Use an existing payment profile ID for this Merchant name and Transaction key

		$request = new AnetAPI\DeleteCustomerPaymentProfileRequest();
		$request->setMerchantAuthentication($this->merchantAuthentication);
		$request->setCustomerProfileId($customerProfileId);
		$request->setCustomerPaymentProfileId($customerpaymentprofileid);
		$controller = new AnetController\DeleteCustomerPaymentProfileController($request);
		$response = $controller->executeWithApiResponse( 
			( env('AUTHORIZE_TYPE') == 'PRODUCTION') ? \net\authorize\api\constants\ANetEnvironment::PRODUCTION : \net\authorize\api\constants\ANetEnvironment::SANDBOX
		);
			
		if (($response != null) && ($response->getMessages()->getResultCode() == "Ok") )
		{
			//   echo "SUCCESS: Delete Customer Payment Profile  SUCCESS  :" . "\n";
			$result['status']=200;
			$result['message']="SUCCESS";
		}
		else
		{
			// echo "ERROR :  Delete Customer Payment Profile: Invalid response\n";
			$errorMessages = $response->getMessages()->getMessage();
			// echo "Response : " . $errorMessages[0]->getCode() . "  " .$errorMessages[0]->getText() . "\n";
			$result['status']= $errorMessages[0]->getCode();
			$result['message']= $errorMessages[0]->getText();
		}
	  	return $result;
  	}
  	public function chargeCustomerProfile($profileid, $paymentprofileid, $amount,$type=null,$job_id=null)
  	{
	    $this->setAuth();
	    
	    // Set the transaction's refId
	    $refId = 'REF_' . time();
	    $profileToCharge = new AnetAPI\CustomerProfilePaymentType();
	    $profileToCharge->setCustomerProfileId($profileid);
	    $paymentProfile = new AnetAPI\PaymentProfileType();
	    $paymentProfile->setPaymentProfileId($paymentprofileid);
	    $profileToCharge->setPaymentProfile($paymentProfile);
		$transactionRequestType = new AnetAPI\TransactionRequestType();
		if($type==null){
			$transactionRequestType->setTransactionType( "authCaptureTransaction");
		}else{
			$transactionRequestType->setTransactionType('authOnlyTransaction');
		}   
		

	    $transactionRequestType->setAmount($amount);
		$transactionRequestType->setProfile($profileToCharge);
		// Create order information
		if($job_id){
			$order = new AnetAPI\OrderType();
			$order->setInvoiceNumber("$job_id");
			// $order->setDescription("Report # $job_id");
			$transactionRequestType->setOrder($order);
		}
	    $request = new AnetAPI\CreateTransactionRequest();
	    $request->setMerchantAuthentication($this->merchantAuthentication);
	    $request->setRefId( $refId);
	    $request->setTransactionRequest( $transactionRequestType);
	    $controller = new AnetController\CreateTransactionController($request);
	    $response = $controller->executeWithApiResponse( 
	    	( env('AUTHORIZE_TYPE') == 'PRODUCTION') ? \net\authorize\api\constants\ANetEnvironment::PRODUCTION : \net\authorize\api\constants\ANetEnvironment::SANDBOX
		);
		if ($response != null){
			if($response->getMessages()->getResultCode() == "Ok") {

			    $tresponse = $response->getTransactionResponse();
			    
			    if ($tresponse != null && $tresponse->getMessages() != null) {
			    	$result['data']['transaction_code'] = $tresponse->getResponseCode();
			    	$result['data']['auth_code'] = $tresponse->getAuthCode();
			    	$result['data']['transaction_id'] = $tresponse->getTransId();
					$result['status'] = 200;
					$result['message'] = "SUCCESS";
					$result['data']['description'] = $tresponse->getMessages()[0]->getDescription();
			    } else {
		      		if($tresponse->getErrors() != null){
				      	$result['status'] = $tresponse->getErrors()[0]->getErrorCode();
						$result['message'] = $tresponse->getErrors()[0]->getErrorText();            
		      		}
		    	}
		  	} else {
		    
			    $tresponse = $response->getTransactionResponse();
			    if($tresponse != null && $tresponse->getErrors() != null)
			    {
			      	$result['status'] = $tresponse->getErrors()[0]->getErrorCode();
					$result['message'] = $tresponse->getErrors()[0]->getErrorText();                         
			    }
			    else
			    {
			      	$result['status'] = $tresponse->getErrors()[0]->getErrorCode();
					$result['message'] = $tresponse->getErrors()[0]->getErrorText();   
			    }
		  	}
		} else {
			$result['status'] = '400';
			$result['message'] = 'Payment Server not responding, Please try again later';
		}
		return $result;
	  }
	
	public function getCustomerPaymentProfile($customerProfileId, $customerPaymentProfileId) {
	    $this->setAuth();
		    
		    // Set the transaction's refId
		$refId = 'REF_' . time();
		//request requires customerProfileId and customerPaymentProfileId
		$request = new AnetAPI\GetCustomerPaymentProfileRequest();
		$request->setMerchantAuthentication($this->merchantAuthentication);
		$request->setRefId( $refId);
		$request->setCustomerProfileId($customerProfileId);
		$request->setCustomerPaymentProfileId($customerPaymentProfileId);
		$controller = new AnetController\GetCustomerPaymentProfileController($request);
		$response = $controller->executeWithApiResponse( 
			( env('AUTHORIZE_TYPE') == 'PRODUCTION') ? \net\authorize\api\constants\ANetEnvironment::PRODUCTION : \net\authorize\api\constants\ANetEnvironment::SANDBOX
		);
		return $response;
	}
	public function approveOrDeclineHeldTransaction($transactionId, $status = 'approve')
	{
		/* Create a merchantAuthenticationType object with authentication details
		retrieved from the constants file */
		$this->setAuth();
		
		// Set the transaction's refId
		$refId = 'REF_' . time();
		//create a transaction
		$transactionRequestType = new AnetAPI\HeldTransactionRequestType();
		$transactionRequestType->setAction($status); //other possible value: decline / approve
		$transactionRequestType->setRefTransId($transactionId);
		
		$request = new AnetAPI\UpdateHeldTransactionRequest();
		$request->setMerchantAuthentication($this->merchantAuthentication);
		$request->setHeldTransactionRequest( $transactionRequestType);
		$controller = new AnetController\UpdateHeldTransactionController($request);
		// $response = $controller->executeWithApiResponse( \net\authorize\api\constants\ANetEnvironment::SANDBOX);
		$response = $controller->executeWithApiResponse( ( env('AUTHORIZE_TYPE') == 'PRODUCTION') ? \net\authorize\api\constants\ANetEnvironment::PRODUCTION : \net\authorize\api\constants\ANetEnvironment::SANDBOX);
		if ($response != null)
		{
			if($response->getMessages()->getResultCode() == "Ok")
			{
			$tresponse = $response->getTransactionResponse();
			
				if ($tresponse != null && $tresponse->getMessages() != null)   
			{
				$result['data'] = $tresponse->getResponseCode();
				$result['status']=200;
				$result['message']="success";
			}
			else
			{
				// echo "Transaction Failed \n";
				if($tresponse->getErrors() != null)
				{
					$result['status']= $tresponse->getErrors()[0]->getErrorCode();
					$result['message']= $tresponse->getErrors()[0]->getErrorText();            
				}
			}
			}
			else
			{
			// echo "Transaction Failed \n";
			$tresponse = $response->getTransactionResponse();
			if($tresponse != null && $tresponse->getErrors() != null)
			{ 
				$result['status']= $tresponse->getErrors()[0]->getErrorCode();
				$result['message']= $tresponse->getErrors()[0]->getErrorText();                   
			}
			else
			{
				$result['status']= $response->getMessages()->getMessage()[0]->getCode();
				$result['message']= $response->getMessages()->getMessage()[0]->getText();
			}
			}      
		}
		else
		{
			echo  "No response returned \n";
		}
		return $result;
	}
	public function getHeldTransactionList() 
	{
		/* Create a merchantAuthenticationType object with authentication details
		retrieved from the constants file */
		$this->setAuth();
		
		// Set the transaction's refId
		$refId = 'ref' . time();
		$request = new AnetAPI\GetUnsettledTransactionListRequest();
		$request->setMerchantAuthentication($this->merchantAuthentication);
		$request->setStatus("pendingApproval");
		$controller = new AnetController\GetUnsettledTransactionListController($request);
		$response = $controller->executeWithApiResponse( \net\authorize\api\constants\ANetEnvironment::SANDBOX);
		// $response = $controller->executeWithApiResponse( ( env('AUTHORIZE_TYPE') == 'PRODUCTION') ? \net\authorize\api\constants\ANetEnvironment::PRODUCTION : \net\authorize\api\constants\ANetEnvironment::SANDBOX);
		
		$result = array();
		if (($response != null) && ($response->getMessages()->getResultCode() == "Ok"))
		{
			if(null != $response->getTransactions())
			{
				foreach($response->getTransactions() as $tx)
				{
				// echo "SUCCESS: TransactionID: " . $tx->getTransId() . "\n";
					$result ['data'][] = $tx->getTransId();
				}
				$result['status'] = 200;
				$result['message'] = "SUCCESS";
			}
			else{
				// echo "No suspicious transactions for the merchant." . "\n";
				$result['status'] = 400;
				$result['message'] = "No suspicious transactions for the merchant";
			}
		}
		else
		{
			// echo "ERROR :  Invalid response\n";
			$errorMessages = $response->getMessages()->getMessage();
			// echo "Response : " . $errorMessages[0]->getCode() . "  " .$errorMessages[0]->getText() . "\n";
			$result['status']= $errorMessages[0]->getCode();
			$result['message']= $errorMessages[0]->getText();
		}
		// return $response;
		return $result;
	}
	


}