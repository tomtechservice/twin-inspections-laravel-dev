<?php
namespace App\Services;
use App\Models\CalendarToken;
use App\Models\JobEvent;
use App\Services\JobService;
use App\Services\JobEventService;
use Google_Client;


class CalendarService
{
    // public function __construct(JobService $jobservice, JobEventService $jobEvent)
    // {
    //     $this->jobService = $jobservice;
    //     $this->jobEvent = $jobEvent;
    //     $this->client = new Google_Client();
    //     $this->client->setApplicationName('Twinhouse');
    //     $this->client->setScopes(\Google_Service_Calendar::CALENDAR);
    //     $this->client->setAuthConfig('../client_secret.json');
    //     $this->client->setAccessType('offline');  // offline access
    //     $this->client->setIncludeGrantedScopes(true);   // incremental auth
    //     $this->client->setApprovalPrompt('force');
    // }
    public function __construct()
    {
        $this->jobService = new JobService();
        $this->jobEvent = new JobEventService();
        $this->client = new Google_Client();
        $this->client->setApplicationName('Twinhouse');
        $this->client->setScopes(\Google_Service_Calendar::CALENDAR);
        $this->client->setAuthConfig('../client_secret.json');
        $this->client->setAccessType('offline');  // offline access
        $this->client->setIncludeGrantedScopes(true);   // incremental auth
        $this->client->setApprovalPrompt('force');
    }
    public function generateAuthUrl(){
        $authUrl = $this->client->createAuthUrl();
        return $authUrl;
    }
    public function generateTokenByVerificationCode($authCode){
        // authorization code for an access token.
        $result = $this->client->fetchAccessTokenWithAuthCode($authCode);
        return $result;
    }
    public function accessToken($result){
        $datetime = new \DateTime($result->created);
        $created = $datetime->format('U');
        $accessToken = array(
            'access_token'=>$result->access_token,
            'token_type'=>$result->token_type,
            'expires_in'=>$result->expires_in,
            'refresh_token'=>$result->refresh_token,
            'created'=>$created

        );
        $client =  $this->client->setAccessToken($accessToken);

    }
    public function insertEvent($job_id, $inspector_id, $inspectionMinutes){

        $job = $this->jobService->getJobForEvent($job_id);
        $calendar = $this->calendar($job, $inspectionMinutes);

        $token = $this->getToken($inspector_id);
        if($token){
            $aceesstoken = $this->accessToken($token);
            $service = new \Google_Service_Calendar($this->client);
            $event = new \Google_Service_Calendar_Event($calendar);
            // dd($event);
            $calendarId = 'primary';
            try {
                $event = $service->events->insert($calendarId, $event);
                if ($event['id']) {
                    $events = array(
                        'inspector_id'=>$inspector_id,
                        'job_id'=>$job_id,
                        'event_id'=>$event['id']
                    );
                    $result = $this->jobEvent->setEvent($events);
                 }
                return true;
            }
            // catch exception
            catch(\Google_Service_Exception $e) {
                return true;
            }
        // dd($service->events);
        }

    }
    public function getToken($inspector_id){
        return CalendarToken::where('inspector_id',$inspector_id)->first();
    }
    public function checkEvent($inspector_id,$job_id){
        return JobEvent::where('inspector_id',$inspector_id)->where('job_id',$job_id)->first();
    }
    public function getEventJob($job_id){

        return JobEvent::where('job_id',$job_id)->get();
    }
    public function deleteJobEvent($event_id){
        return JobEvent::where('event_id',$event_id)->delete();
    }
    public function abortEvent($job_id){
        $job_event = $this->getEventJob($job_id);
        if ($job_event) {
            foreach ($job_event as $event) {
                $result = $this->getToken($event->inspector_id);
                if ($result) {
                    $token = $this->accessToken($result);
                    // events delete from table
                    $this->deleteJobEvent($event->event_id);
                    // events delete from calendar
                    $this->deleteEvent($event->event_id);
                    // $service = new \Google_Service_Calendar($this->client);
                    // $service->events->delete('primary', $event->event_id);

                }
            }
        }
    }
    public function deleteAgentEvent($inspector_id,$job_id){
        $result = $this->getToken($inspector_id);
        if ($result) {
             $token = $this->accessToken($result);
            // Refresh the token if it's expired.
            if ($this->client->isAccessTokenExpired()) {
                $data = $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
            }
            $exist = $this->checkEvent($inspector_id,$job_id);
            if ($exist) {
                $eventId = $exist->event_id;
                $exist->delete();
                $this->deleteEvent($eventId);
            }
        }
        return 0;
    }
    public function calendar($job, $inspectionMinutes){
        $intrested =  $this->jobService->intrested($job);
        $contact = $this->contact($intrested);

        $job_request = ( $job->job_is_requested=='yes')?'REQUEST ':'';

        $agent_id = $job->agent_id;
        $jid = $job->job_id;
        $this->deleteAgentEvent($agent_id,$jid);
        $datetime = new \DateTime($job->job_date_scheduled);
        $start_time = $datetime->format('c');
        // $end_time
        if($inspectionMinutes){
          $datetime->add(new \DateInterval('PT' . $inspectionMinutes . 'M'));
          $end_time = $datetime->format('c');
        } else {
          $end_time = $start_time;
        }


        $calendar =   array('summary' =>
($job->anytime ? "ANYTIME " : "") . "$job_request  $job->job_sub_type ".$job->property->property_foundation."  ".$job->property->property_address1."
".$job->property->property_address2." ".$job->property->property_city." " ,
'location' =>
" ".$job->property->property_address1."  ".$job->property->property_address2."  ".$job->property->property_city."  ".$job->property->property_state."
".$job->property->property_zip."    ",
'description' => "
Inspection Type:  ".$job->job_sub_type."

Foundation:  ".$job->property->property_foundation."

Property Type:  ".$job->property->property_type."

Year Build:  ".$job->property->property_year."

Square Feet:  ".$job->property->property_square_feet."

Access :  ".$job->property->property_access."

Gate Code:  ".$job->property->property_gate_code."

Lock Box Code:  ".$job->property->property_lock_box_code."

Notes:  ".$job->property->property_notes."

Inspector:  ".$job->property->property_notes."

Appointment Details

Payment Type : ".$job->job_payment_type."

Contact Info :

Property Owner:
".$contact['property']['name']."
".$contact['property']['co_name']."
Phone: ".$contact['property']['phone']."
Email: ".$contact['property']['email']."

Billed Party:
".$contact['billing']['name']."
".$contact['billing']['co_name']."
Phone: ".$contact['billing']['phone']."
Email: ".$contact['billing']['email']."

Buyer's Agent:
".$contact['buyer_agent']['name']."
".$contact['buyer_agent']['co_name']."
Phone: ".$contact['buyer_agent']['phone']."
Email: ".$contact['buyer_agent']['email']."

Seller's Agent:
".$contact['seller_agent']['name']."
".$contact['seller_agent']['co_name']."
Phone: ".$contact['seller_agent']['phone']."
Email: ".$contact['seller_agent']['email']."

Title/Escrow Company:
".$contact['title_escrow']['name']."
".$contact['title_escrow']['co_name']."
Phone: ".$contact['title_escrow']['phone']."
Email: ".$contact['title_escrow']['email']."

Buyer:
".$contact['buyer']['name']."
".$contact['buyer']['co_name']."
Phone: ".$contact['buyer']['phone']."
Email: ".$contact['buyer']['email']."


                                      ",
                                      'start' => array(
                                        'dateTime' => $start_time,
                                        'timeZone' => 'America/Los_Angeles',
                                      ),
                                      'end' => array(
                                        'dateTime' => $end_time,
                                        'timeZone' => 'America/Los_Angeles',
                                      ),
                                      'reminders' => array(
                                        'useDefault' => FALSE,
                                        'overrides' => array(
                                          array('method' => 'email', 'minutes' => 24 * 60),
                                          array('method' => 'popup', 'minutes' => 10),
                                        ),
                                      ),
                                );
        return $calendar;
    }
    public function contact($contact){
        $interest = array();
        if($contact->property_owner){
            $interest['property']['name']= $contact->property_owner->client_first_name." ".$contact->property_owner->client_last_name;
            if($contact->property_owner->company){
                $interest['property']['co_name']=$contact->property_owner->company->company_name."-".$contact->property_owner->company->company_city.", ".$contact->property_owner->company->company_state;
            }else{
                $interest['property']['co_name']='';
            }

            $interest['property']['phone']= $contact->property_owner->client_phone;
            $interest['property']['email']= $contact->property_owner->client_email;
        }else{
            $interest['property']['name']= '';
            $interest['property']['co_name']='';
            $interest['property']['phone']= '';
            $interest['property']['email']= '';
        }
        // billing
        if($contact->billing){
            $interest['billing']['name']= $contact->billing->client_first_name." ".$contact->billing->client_last_name;
            if($contact->billing->company){
                $interest['billing']['co_name']=$contact->billing->company->company_name."-".$contact->billing->company->company_city.", ".$contact->billing->company->company_state;
            }else{
                $interest['billing']['co_name']='';
            }
            $interest['billing']['phone']= $contact->billing->client_phone;
            $interest['billing']['email']= $contact->billing->client_email;
        }else{
            $interest['billing']['name']= '';
            $interest['billing']['co_name']='';
            $interest['billing']['phone']= '';
            $interest['billing']['email']= '';
        }
        // Buyer's Agent
        if($contact->buyer_agent){
            $interest['buyer_agent']['name']= $contact->buyer_agent->client_first_name." ".$contact->buyer_agent->client_last_name;
            if($contact->buyer_agent->company){
                $interest['buyer_agent']['co_name']=$contact->buyer_agent->company->company_name."-".$contact->buyer_agent->company->company_city.", ".$contact->buyer_agent->company->company_state;
            }else{
                $interest['buyer_agent']['co_name']='';
            }
            $interest['buyer_agent']['phone']= $contact->buyer_agent->client_phone;
            $interest['buyer_agent']['email']= $contact->buyer_agent->client_email;
        }else{
            $interest['buyer_agent']['name']= '';
            $interest['buyer_agent']['co_name']='';
            $interest['buyer_agent']['phone']= '';
            $interest['buyer_agent']['email']= '';
        }
        // Seller's Agent:
        if($contact->seller_agent){
            $interest['seller_agent']['name']= $contact->seller_agent->client_first_name." ".$contact->seller_agent->client_last_name;
            if($contact->seller_agent->company){
                $interest['seller_agent']['co_name']=$contact->seller_agent->company->company_name."-".$contact->seller_agent->company->company_city.", ".$contact->seller_agent->company->company_state;
            }else{
                $interest['seller_agent']['co_name']='';
            }
            $interest['seller_agent']['phone']= $contact->seller_agent->client_phone;
            $interest['seller_agent']['email']= $contact->seller_agent->client_email;
        }else{
            $interest['seller_agent']['name']= '';
            $interest['seller_agent']['co_name']='';
            $interest['seller_agent']['phone']= '';
            $interest['seller_agent']['email']= '';
        }
        // Title/Escrow Company:
        if($contact->title_escrow){
            $interest['title_escrow']['name']= $contact->title_escrow->client_first_name." ".$contact->title_escrow->client_last_name;
            if($contact->title_escrow->company){
                $interest['title_escrow']['co_name']=$contact->title_escrow->company->company_name."-".$contact->title_escrow->company->company_city.", ".$contact->title_escrow->company->company_state;
            }else{
                $interest['title_escrow']['co_name']='';
            }
            $interest['title_escrow']['phone']= $contact->title_escrow->client_phone;
            $interest['title_escrow']['email']= $contact->title_escrow->client_email;
        }else{
            $interest['title_escrow']['name']= '';
            $interest['title_escrow']['co_name']='';
            $interest['title_escrow']['phone']= '';
            $interest['title_escrow']['email']= '';
        }
         // buyer
         if($contact->buyer){
            $interest['buyer']['name']= $contact->buyer->client_first_name." ".$contact->buyer->client_last_name;
            if($contact->buyer->company){
                $interest['buyer']['co_name']=$contact->buyer->company->company_name."-".$contact->buyer->company->company_city.", ".$contact->buyer->company->company_state;
            }else{
                $interest['buyer']['co_name']='';
            }
            $interest['buyer']['phone']= $contact->buyer->client_phone;
            $interest['buyer']['email']= $contact->buyer->client_email;
        }else{
            $interest['buyer']['name']= '';
            $interest['buyer']['co_name']='';
            $interest['buyer']['phone']= '';
            $interest['buyer']['email']= '';
        }
        return $interest;


    }
    public function deleteEvent($eventId){
      $service = new \Google_Service_Calendar($this->client);
      return $service->events->delete('primary', $eventId);
    }
    public function haveGoogleCalendar($inspector_id){
        $calendar = CalendarToken::where('inspector_id',$inspector_id)->where('status','connected')->first();
        if($calendar){
            return true;
        } else {
            return false;
        }
    }



}
