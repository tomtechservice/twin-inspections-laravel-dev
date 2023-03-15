<?php
namespace App\Services;

use App\Models\Job;
use App\Helpers\DateHelper;
use DB;
use App\Models\User;
use App\Models\AgentDailySchedule;
use App\Models\AgentWeeklySchedule;
use App\Models\AgentWeeklyException;
use App\Models\AgentDailyException;

use App\Services\JobService;
use App\Services\CommonService;
use App\Services\CalendarService;
use App\Services\PropertyService;
use App\Services\InspectionService;
use App\Services\ClientService;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\AuthorizeService;
use App\Services\CardDetailsService;
use App\Services\Office365CalendarService;
use App\Models\JobFee;
use Auth;

class ScheduleService
{

    protected $agent;
    protected $toDate;
    protected $fromDate; // todate and fromDate Should be same ///
    protected $selectedDate;
    protected $selectedDateWeek;
    protected $propertyId;
    protected $agentLimit = 10;
    protected $scheduleLimit = 20;
    protected $jobId;

    // function __construct(Job $job, JobService $jobService, CommonService $commonService, CalendarService $calendarService, PropertyService $propertyService, InspectionService $inspectionService)
    // {
    //     $this->job = $job;
    //     $this->dailySchedule = new AgentDailySchedule();
    //     $this->weeklySchedule = new AgentWeeklySchedule();
    //     $this->dailyException = new AgentDailyException();
    //     $this->weeklyException = new AgentWeeklyException();
    //     $this->jobService = $jobService;
    //     $this->commonService = $commonService;
    //     $this->calendarService = $calendarService;
    //     $this->propertyService = $propertyService;
    //     $this->inspectionService = $inspectionService;
    //     $this->clientService = new ClientService();
    //     $this->card = new CardDetailsService();

    // }
    function __construct(){
        $this->job = new Job();
        $this->dailySchedule = new AgentDailySchedule();
        $this->weeklySchedule = new AgentWeeklySchedule();
        $this->dailyException = new AgentDailyException();
        $this->weeklyException = new AgentWeeklyException();
        $this->jobService = new JobService();
        $this->commonService = new CommonService();
        $this->calendarService = new CalendarService();
        $this->officeCalendarService = new Office365CalendarService();
        $this->propertyService = new PropertyService();
        $this->inspectionService = new InspectionService();
        $this->clientService = new ClientService();
        $this->card = new CardDetailsService();

    }
    public function searchAgentSchedules($toDate, $fromDate, $agent, $propertyId){
        $this->agent = $agent;
        $this->toDate = DateHelper::timeFix($toDate,'00:00:00');
        $this->fromDate = DateHelper::timeFix($fromDate,'23:59:59');

        $this->selectedDate = $toDate;
        $this->selectedDateWeek = strtolower(DateHelper::getWeekDay($this->selectedDate));
        $this->propertyId = $propertyId;
        return $this->searchAgentOperation();
    }

    public function searchAvailable($toDate, $fromDate, $jobId){
        $this->toDate = DateHelper::timeFix($toDate,'00:00:00');
        $this->fromDate = DateHelper::timeFix($fromDate,'23:59:59');
        $this->jobId = $jobId;
        $this->selectedDate = $toDate;
        $this->selectedDateWeek = strtolower(DateHelper::getWeekDay($this->selectedDate));
        return $this->searchWildCardAgentTiming();
    }

    // get all jobs scheduled that day
    public function getAllJobs(){
        return $this->job->with('property')
            ->where('job_is_deleted', 0)
            ->whereBetween('job_date_scheduled', [$this->toDate, $this->fromDate])
            ->get();
    }
    // get job count
    public function getScheduleJobCount($fromDate, $toDate){
        return $this->job
            ->where('job_is_deleted', 0)
            ->whereBetween('job_date_scheduled', [$fromDate, $toDate])
            ->count();
    }
    // get agent Jobs
    public function getAgentJobs($agentId, $from, $to){
        return $this->job->with('property')
            ->where('job_is_deleted', 0)
            ->where('agent_id', $agentId)
            ->whereBetween('job_date_scheduled', [$to, $from])
            ->get();
    }
    // check agent total jobs : need to compare scheduled time conflict
    public function getAgentConflictedScheduleTimeJobs($agentId, $from, $to, $jobId = null){
        $date = date('Y-m-d', strtotime($from)) . ' 00:00:00';
        $end_date = date('Y-m-d', strtotime($to)) . ' 23:59:59';
        
        $qry = $this->job
            ->where('job_is_deleted', 0)
            ->where('job_date_cancelled' , '0000-00-00 00:00:00')
            ->where('agent_id', $agentId)
            ->where(function($query) use($from, $to, $date, $end_date){
                $query
                ->orWhereBetween('job_date_scheduled', [$from, $to])
                ->orWhere(function($query) use($from, $to, $date){
                    $query->whereBetween('job_date_scheduled', [$date, $from])
                        ->whereBetween('job_scheduled_end_time', [$from, $to]);
                })
                ->orWhere(function($query) use($from, $to, $date, $end_date){
                    $query->whereBetween("job_date_scheduled", [ $date, $from])
                        ->where("job_scheduled_end_time",[$from, $end_date ]);
                });
            });
            
        $qry = $jobId ? $qry->where('job_id', '!=', $jobId) : $qry;
            
        return $qry->count();
    }
    // getting agent work hours
    public function getAgentWorkHours($agentId){
        return $this->dailySchedule
            ->where('user_id', $agentId)
            ->where('week_day', $this->selectedDateWeek)
            ->first();
    }
    // getting exceptions of that agent
    public function getAgentExceptions($agentId){

        return $this->dailyException
            ->where('user_id', $agentId)
            ->where(function($query){
                $query->orWhere('exception_date', $this->selectedDate)
                ->orWhere('is_daily', 1);
            })
            ->get();

    }
    // getting agent schedules for a week day
    public function getAllAgentsSchedule(){
        return $this->weeklySchedule
            ->with('agent')
            ->where($this->selectedDateWeek, '1')
            ->orderBy('user_id')
            ->get();
    }
    // getting agent schedules for a week day
    public function getAgentCount($week){
        return $this->weeklySchedule
            ->with('agent')
            ->where($week, '1')
            ->orderBy('user_id')
            ->count();
    }
    // getting agent schedules for a week day single agent
    public function getAgentSchedule(){
        return $this->weeklySchedule
            ->with('agent')
            ->where($this->selectedDateWeek, '1')
            ->where('user_id', $this->agent)
            ->orderBy('user_id')
            ->get();
    }

    // getting off times and other exceptions of that day
    public function getAgentFinalWorkHours($agentId, $agentWorkHours, $agentJobs){

        if($agentWorkHours){
            // getting exceptions
            $agentExceptions = $this->getAgentExceptions($agentId);
            //
            $multiLayerSlots = 0;
            $layers = 0;
            $minutesFactor = 15;
            $minutesDiv = 4;
            if($this->agent){
                $minutesFactor = 5;
                $minutesDiv = 12;
            }
            $timeRange = range(
                strtotime($agentWorkHours->start_time),
                strtotime($agentWorkHours->end_time),
                $minutesFactor*60
            );
            $returnData = [];
            $count = 0;
            $total = count($timeRange);
            foreach($timeRange as $time){
                $single = [];
                $theTime = date('H:i:s', $time);
                $single['labelClass'] = 'success';
                $single['tip'] = 'Available';
                $single['ins'] = [];
                if($count%$minutesDiv == 0){
                    $single['showLabel'] = 1;
                    $single['timeLabel'] = DateHelper::time24To12($theTime);
                } else {
                    $single['showLabel'] = 0;
                    $single['timeLabel'] = '';
                }
                // loop through agent exceptions
                foreach ($agentExceptions as $exception) {
                    if($theTime >= $exception->start_time && $theTime < $exception->end_time){
                        $single['labelClass'] = 'off';
                        $single['tip'] = 'Unavailable';
                    }
                }
                // loop through agent jobs
                foreach ($agentJobs as $job) {
                    if($job->job_date_scheduled){
                        $address = $this->propertyService->propertyAddress($job->property);
                        $startTime = DateHelper::getTime($job->job_date_scheduled);
                        if($job->job_scheduled_end_time){
                            $endTime = $job->job_scheduled_end_time;
                        } else {
                            $endTime = DateHelper::addHours($startTime, 2);
                        }
                        if($theTime >= $startTime && $theTime < $endTime){
                            if($job->job_is_requested == 'yes'){
                                $single['ins'][$job->job_id]['labelClass'] = 'info';
                            } else {
                                $single['ins'][$job->job_id]['labelClass'] = 'danger';
                            }
                            $single['ins'][$job->job_id]['tip'] = $address;
                            $single['ins'][$job->job_id]['jobId'] = $job->job_id;
                        }
                    }
                }

                $count++;
                if($total == $count){
                    $single['isl'] = '0';
                } else {
                    $single['isl'] = '1';
                }
                if(isset($single['ins'])){
                    $countLayers = count($single['ins']);
                    if($countLayers > 1){
                        $multiLayerSlots = 1;

                    }
                    if($countLayers > $layers){
                        $layers = $countLayers;
                    }
                }
                $returnData[] = $single;

            }
            return ['data' =>$returnData, 'multiLayer' => $multiLayerSlots, 'layers' => $layers];
        } else {
            return ['data' => [], 'multiLayer' => 0, 'layers' => 0];
        }

    }
    // Search agent oprtation
    public function searchAgentOperation(){

        if($this->agent){
            $agents = $this->getAgentSchedule();
        } else {
            $agents = $this->getAllAgentsSchedule();
        }
        $returnData = [];
        foreach ( $agents as $agent ) {
            $agentJobs = $this->getAgentJobs($agent->user_id, $this->fromDate, $this->toDate);
            $defaultAgentWorkHours = $this->getAgentWorkHours( $agent->user_id );
            $agentWorkHours = $this->getAgentFinalWorkHours(
                $agent->user_id, $defaultAgentWorkHours, $agentJobs
            );

            $ag['allSlots'] = $this->insFilter($agentWorkHours['data']);
            $ag['multiLayer'] = $agentWorkHours['multiLayer'];
            $ag['layers'] = $agentWorkHours['layers'];
            $ag['totalSlotsP'] = 100 / ( count($ag['allSlots']) - 1);
            $ag['totalSlots'] = count($ag['allSlots']) - 1;
            $ag['startHour'] = '08';
            $ag['startMinutes'] = '00';
            $ag['agent_id'] = $agent->user_id;
            $ag['user_first_name'] = $agent->agent->user_first_name;
            $ag['user_last_name'] = $agent->agent->user_last_name;
            $ag['is_calendar_connected'] = $this->calendarService->haveGoogleCalendar($agent->user_id);
            $returnData[] = $ag;
        }
        return $returnData;
    }

    public function getAgentCalendarStatus($agent_id){
        return ['status' => $this->calendarService->haveGoogleCalendar($agent_id)];
    }

    public function getAgentOfficeCalendarStatus($agent_id){
        return ['status' => $this->officeCalendarService->haveOfficeCalendar($agent_id)];
    }

    public function searchWildCardAgentTiming(){
        // get agents
        $agents = $this->getAllAgentsSchedule();
        $jobs = $this->getAllJobs();
        $inspectionMinutes = $this->getJobInspectionMinute($this->jobId);
        ///////////////////////////////////
        $returnData = [];
        foreach ( $agents as $agent ) {
            $agentJobs = $jobs->where('agent_id', $agent->user_id);
            $defaultAgentWorkHours = $this->getAgentWorkHours( $agent->user_id );
            $agentWorkHours = $this->getAgentAvailableSlots(
                $agent->user_id, $defaultAgentWorkHours, $agentJobs, $inspectionMinutes
            );
            $ag['slots'] = $agentWorkHours;
            $ag['slots_count'] = count($agentWorkHours);
            $ag['agent_id'] = $agent->user_id;
            $ag['ins_minutes'] = $inspectionMinutes;
            $ag['user_first_name'] = $agent->agent->user_first_name;
            $ag['user_last_name'] = $agent->agent->user_last_name;
            $ag['dt'] = $this->selectedDate;
            if($ag['slots_count'] > 0){
                $returnData[] = $ag;
            }
        }
        // make it collectable
        $returnData = collect($returnData);
        // sort with clots_count
        $returnData = $returnData->sortBy('slots_count');
        return $this->getFilterdAgents($returnData);
    }
    public function getFilterdAgents($agentData){
        $totalReturn = 10;
        $returnData = [];
        foreach ($agentData as $key => $agent) {
            $agent['startTime'] = DateHelper::removeSec($agent['slots'][0]['startTime']);
            $agent['endTime'] = DateHelper::removeSec($agent['slots'][0]['endTime']);

            $agent['st'] = DateHelper::time24To12($agent['startTime']);
            $agent['et'] = DateHelper::time24To12($agent['endTime']);
            unset($agent['slots']);
            $returnData[] = $agent;

            if(count($returnData) == $totalReturn){
                return $returnData;
            }
        }
        return $returnData;

    }
    public function getJobInspectionMinute($jobId = NULL){
        if(!$jobId){
            return 120;
        } else {
            $timeCalculated = 120;
            $job = $this->jobService->findJob($jobId);
            if($job){
                $timeCalculated = $this->inspectionService->findTotalInspectionMinutes($job->property_id);
                if($timeCalculated == 0){
                    $timeCalculated = 120;
                }
            }
            return $timeCalculated;
        }
    }
    // getting off times and other exceptions of that day
    public function getAgentAvailableSlots($agentId, $agentWorkHours, $agentJobs, $minutesFactor){

        if($agentWorkHours){
            // getting exceptions
            $agentExceptions = $this->getAgentExceptions($agentId);

            $timeRange = range(
                strtotime($agentWorkHours->start_time),
                strtotime($agentWorkHours->end_time),
                $minutesFactor*60
            );
            $returnData = [];

            foreach($timeRange as $key=>$time){
                $single = [];
                if(isset($timeRange[$key+1])){
                    $startTime = date('H:i:s', $time);
                    $endTime = date('H:i:s', $timeRange[$key+1]);
                    $avaialble = true;
                    foreach ($agentExceptions as $exception) {
                        $fromTime = $exception->start_time;
                        $toTime = $exception->end_time;
                        if($startTime >= $fromTime && $startTime < $toTime){
                            $avaialble = false;
                        }
                    }
                    foreach ($agentJobs as $job) {
                        if($job->job_date_scheduled){
                            $fromTime = DateHelper::getTime($job->job_date_scheduled);
                            if($job->job_scheduled_end_time){
                                $toTime = $job->job_scheduled_end_time;
                            } else {
                                $toTime = DateHelper::addHours($startTime, 2);
                            }
                            if($startTime >= $fromTime && $startTime < $toTime){
                                $avaialble = false;
                            }
                        }
                    }
                    if($avaialble){
                        $single['startTime'] = $startTime;
                        $single['endTime'] = $endTime;

                        $returnData[] = $single;
                    }
                }


            }
            return $returnData;
        } else {
            return [];
        }

    }


    public function insFilter($data){
        foreach ($data as $mainKey=>$value) {
            if(isset($value['ins']) && count($value['ins']) > 0){
                foreach ($value['ins'] as $key => $inskey) {
                    $value['insl'][] = $inskey;
                }
                unset($value['ins']);
            } else {
                $value['insl'] = [];
                unset($value['ins']);
            }
            $data[$mainKey] = $value;
        }
        return $data;
    }

    public function getSearchDate(){
        $date = date('Y-m-d');

        for ($i=0; $i >= 0 ; $i++) {
            if($i == 0){
                $inspectionDate = $date;
            } else {
                $inspectionDate = DateHelper::dayAdd($date,$i);
            }

            $fromDate = DateHelper::timeFix($inspectionDate,'00:00:00');
            $toDate = DateHelper::timeFix($inspectionDate,'23:59:59');
            $selectedDateWeek = strtolower(DateHelper::getWeekDay($inspectionDate));
            $count = $this->getAgentCount($selectedDateWeek);

            $totalSlots = 0;
            if($count > 0){
                $totalSlots = $count * 5;
            }

            $jobCount = $this->getScheduleJobCount($fromDate, $toDate);

            if($jobCount < $totalSlots){
                return DateHelper::ngbDateFrom($selectedDateWeek);
            }

        }
    }

    // database function
    // Save and Update job table schedule data
    public function add($data){

        $job_id = '';
        if($data->jobId){
            $job_id = $data->jobId;
        }
        $from_date = $this->commonService->dateFormat($data->from_date);

        if($job_id){
            $job_details = $this->jobService->findJob($job_id);
            $jobOldVersion = clone $job_details;
        } else {
            $job = array(
                'client_id' => 0,
                'job_status_top' => 'Active',
                'job_status' => 'Intake',
            );
            $job_id = $this->jobService->save($job);
            $job_details = $this->jobService->findJob($job_id);
            $jobOldVersion = clone $job_details;
            $job_details->job_ref_parent = $job_id;

            $property = [
                'client_id' => 0,
                'job_id' => $job_id,
            ];

            $propertyId = $this->propertyService->save($property);
            $job_details->property_id = $propertyId;
        }

        if($data->from_date){
            $dateInspection = $from_date;
            $job_details->job_date_scheduled = $dateInspection.' '.$data->from_time.':00';
            // $job_details->job_scheduled_end_time = $data->to_time.':00';
            $job_details->job_scheduled_end_time = DateHelper::addMinutes($data->from_time.':00',$data->calculated_time);
        } else {
            $job_details->job_date_scheduled = null;
            $job_details->job_scheduled_end_time = null;
        }
        // time validation

        $job_details->agent_id = $data->agent_id;
        $job_details->scheduled_id = Auth::id();

        // when Completed Inspection(means : Active-Work) Status, we should not change the Job status to Active-Inspection again.
        if(!(isset($job_details->job_status) && $job_details->job_status == 'Work')){
            $job_details->job_status = 'Inspection';
        }

        $job_details->job_fee = $data->job_fee;
        $job_details->job_fee_discount = $data->job_fee_discount;
        $job_details->job_fee_discount_type = $data->job_fee_discount_type;
        $job_details->job_payment_type = $data->job_payment_type;
        $job_details->job_payment_type_notes = $data->job_payment_type_notes;


        $job_details->job_escrow_number = $data->job_escrow_number;
        if($data->job_escrow_closing_date){
            $job_details->job_escrow_closing_date = $this->commonService->dateFormat(
                $data->job_escrow_closing_date
            ).' 00:00:00';
        } else {

            $job_details->job_escrow_closing_date = '0000-00-00 00:00:00';
        }
        if($data->job_confirmation_email_sent){
            $job_details->job_confirmation_email_sent = '1';
        } else {
            $job_details->job_confirmation_email_sent = '0';
        }
        if($data->job_is_requested){
            $job_details->job_is_requested = 'yes';
        } else {
            $job_details->job_is_requested = 'no';
        }
        if($data->wants_earlier){
            $job_details->wants_earlier = '1';
        }else{
            $job_details->wants_earlier = '0';
        }
        if($data->anytime){
            $job_details->anytime = '1';
        }else{
            $job_details->anytime = '0';
        }
        $job_details->additional_email=$data->additional_email;
        if($job_details->save()){
            // check if there are fees associated with job
            JobFee::where('job_id', $job_id)->delete();
            if($data->job_fees && count($data->job_fees) > 0) {
                foreach($data->job_fees as $fee) {
                    JobFee::create(['job_id' => $job_id, 'fee_id' => $fee['fee_id'], 'job_fee_amount' => $fee['fee_amount']]);
                }
            }

            if($data->add_to_calendar){
                if($job_details->property_id){

                    $this->calendarService->insertEvent(
                        $job_details->job_id,
                        $job_details->agent_id,
                        $this->inspectionService->findTotalInspectionMinutes($job_details->property_id)
                    );
                }

            }

            if($data->add_to_office_calendar){
                if($job_details->property_id){

                    $this->officeCalendarService->insertEvent(
                        $job_details->job_id,
                        $job_details->agent_id,
                        $this->inspectionService->findTotalInspectionMinutes($job_details->property_id)
                    );
                }

            }

            if($data->job_confirmation_email_sent){
                $this->sendConfirmEmail($job_details->job_id);
            }
            if($data->additional_email){
                $client_emails_array = explode(',', $data->additional_email);
                // dd($client_emails_array);
                foreach($client_emails_array as $email){
                    $this->sendConfirmEmail($job_details->job_id,null,$email);
                }
            }
            // client list email
            if($data && $data->client_email){
                foreach($data->client_email as $email){
                    $this->sendConfirmEmail($job_details->job_id,$email['client_id']);
                }
            }
            // if($data->job_cc_number && $data->job_cc_exp_month && $data->job_cc_exp_year && $data->job_cc_vcode){

            //     if($job_details->client_id){
            //         $this->saveCard($data, $job_details->client_id);
            //     }

            // }
            // log mass update
            LogService::findChanges(
                $jobOldVersion,
                $job_details,
                $job_id,
                config('site.track_schedule')
            );
            if($job_details->agent_id != $jobOldVersion->agent_id){
                if($user = $this->commonService->getUser($job_details->agent_id)){
                    LogService::singleChanges(
                        $job_id,
                        $user->user_first_name,
                        'agent_id'
                    );
                }
            }
            // loging agent change



            return ['data' => 'success', 'message' => 'Saved','jobId' => $job_details->job_id];
        }
    }
    public function sendConfirmEmail($job_id,$client_id=null,$additional_email=null){


        $setting = $this->commonService->getSettings();
        $job = $this->jobService->findJob($job_id);
        if(!$additional_email){
            if(!$client_id){
                $client_id =  $job->client_id;
            }
            $client = $this->clientService->getClient($client_id);
            if(!$client){
                return true;
            }
        }

        $inspector = $this->commonService->getUser($job->agent_id);
        $property = $this->propertyService->findProperty($job->property_id);


        $subject = '';
        $html_text = '';
        $from = $setting->setting_email_support;
        $replyto = $setting->setting_email_support;
        if($additional_email){
            $to = $additional_email;
            $client_name = $additional_email;
        }else{
            $to = $client->client_email;
            $client_name = $client->client_last_name.', '.$client->client_first_name;
        }


        $propertyDetails = '';
        if($property){
            $propertyDetails = $property->property_address1 . ' ' . $property->property_address2;
            $subject .= $propertyDetails.' - ';
        }
        $subject .= $setting->setting_company_name . ' - Important information regarding your upcoming inspection';

        $html_text = $setting->setting_email_inspection_scheduled_check_html;
        if ($job->job_payment_type == 'Check') {

            $html_text = $setting->setting_email_inspection_scheduled_check_html;

        }
        if ($job->job_payment_type == 'Credit Card') {

            $html_text = $setting->setting_email_inspection_scheduled_cc_html;

        }
        if ($job->job_payment_type == 'Invoice') {

            $html_text = $setting->setting_email_inspection_scheduled_invoice_html;

        }
        if ($job->job_payment_type == 'Escrow') {

            $html_text = $setting->setting_email_inspection_scheduled_escrow_html;

        }


        if ($inspector->user_image_file == '') {
            $image = 'no_inspector_photo.jpg';
        } else {
            $image = $inspector->user_image_file;
        }

        $img = '<img src="' . env('DO_SPACE') . 'media/inspectors/' . $inspector->user_id . '/' . $image . '" width="130" height="130" border="0" align="right" />';

        $insp_fee_tot = $job->job_fee - $job->job_fee_discount;

        $html_text = str_replace('[@INSPECTOR_PHOTO]', $img, $html_text);
        $html_text = str_replace('[@INSPECTOR_NAME]', $inspector->user_first_name . ' ' . $inspector->user_last_name, $html_text);
        $html_text = str_replace('[@IADDR]', $property->property_address1, $html_text);
        $html_text = str_replace('[@ICITY]', $property->property_city, $html_text);
        $html_text = str_replace('[@ISTATE]', $property->property_state, $html_text);
        $html_text = str_replace('[@IZIP]', $property->property_zip, $html_text);
        $html_text = str_replace('[@INSPDATE]', DateHelper::format($job->job_date_scheduled, 7), $html_text);
        $html_text = str_replace('[@INSPTIME]', DateHelper::format($job->job_date_scheduled, 6), $html_text);
        $html_text = str_replace('[@FEE]', number_format($insp_fee_tot, 2), $html_text);
        $html_text = str_replace('[@pinspect2.INSPTIME3]', $to, $html_text);
        // $html_text = str_replace('[@pinspect2.INSPTIME3]', $client->client_email, $html_text);

        $emailService = new EmailService();
        $emailService->sendConfirmEmail(
            $to, $subject, $html_text, $job_id, $client_name, $setting
        );

    }
    //
    public function clientEmail($job)
    {
        $clientIds = [];

        if($job->client_id != $job->billing_id){
            $clientIds[] = $job->billing_id;
        }
        if($job->client_id != $job->property_owner_id){
            $clientIds[] = $job->property_owner_id;
        }
        if($job->client_id != $job->buyer_id){
            $clientIds[] = $job->buyer_id;
        }
        if($job->client_id != $job->buyer_agent_id){
            $clientIds[] = $job->buyer_agent_id;
        }
        if($job->client_id != $job->seller_agent_id){
            $clientIds[] = $job->seller_agent_id;
        }
        if($job->client_id != $job->title_escrow_id){
            $clientIds[] = $job->title_escrow_id;
        }
        if($job->client_id != $job->other_id){
            $clientIds[] = $job->other_id;
        }

        $emails = $this->clientService->getAllEmail($clientIds);
        // collect
        // dd($emails);
        return $emails;
    }
    public function getSchedule($jobId){
        // getting a job
        $job = $this->jobService->findJob($jobId);
        if($job){
            $job->client_email = $this->clientEmail($job);
        }
        // to make compatible with old data
        // default 2 hours if job_scheduled_end_time not exists
        if($job->job_date_scheduled && $job->job_date_scheduled != '0000-00-00 00:00:00'){
            $dateParts = explode(' ', $job->job_date_scheduled);
            $job->from_date = $this->commonService->dateFormatRev($dateParts['0']);

            $job->from_time = DateHelper::removeSec($dateParts['1']);
            if($job->job_scheduled_end_time){
                $job->to_time = DateHelper::removeSec($job->job_scheduled_end_time);
                $job->calculated_time = DateHelper::getTimeDiff($job->from_time, $job->to_time);
            } else {
                $job->to_time = DateHelper::removeSec(DateHelper::addHours($job->from_time, 2));
                $job->calculated_time = 0;
            }
        } else {
            $job->from_date = $this->commonService->dateFormatRev(date('Y-m-d'));
            $job->from_time = '';
            $job->to_time = '';
            $job->calculated_time = 0;
        }
        // escrow set to null // fix ngbCalendar issue
        if($job->job_escrow_closing_date == '0000-00-00 00:00:00'){
            $job->job_escrow_closing_date = null;
        } else {
            $job->job_escrow_closing_date = $this->commonService->dateFormatRev($job->job_escrow_closing_date);
        }

        $job->job_cc_number = '';
        $job->job_cc_exp_month = '';
        $job->job_cc_exp_year = '';
        $job->job_cc_vcode = '';

        // job is requested yes in table
        if($job->job_is_requested == 'yes'){
            $job->job_is_requested = 1;
        } else {
            $job->job_is_requested = 0;
        }
        $job->add_to_calendar = $this->calendarService->haveGoogleCalendar($job->agent_id) ? 1 : 0;
        return $job;
    }
    public function updateAgentSchedule($request){
        if($request->job_id){
            $job = array(
                'agent_id' => $request->agent_id,
                'job_date_scheduled' => DateHelper::ngbDateTo($request->from_date).':'.DateHelper::ngbTimeTo($request->from_time),
                'job_scheduled_end_time' => DateHelper::ngbTimeTo($request->to_time),
            );
            if($this->jobService->update($job, $request->job_id) == 0){
                return ['data' => 'success', 'message' => 'Saved','jobId' => $request->job_id];
            }

        }
    }
    public function saveCard($request, $id){

        $client =  $this->clientService->findClient($id);
        if(!$client){
            return response()->error('invalid Client Id');
        }
        $request->card_number = $request->job_cc_number;
        $request->card_date = "$request->job_cc_exp_year-$request->job_cc_exp_month";
        $request->card_vcc = $request->job_cc_vcode;

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
            $request->billing_first_name = $request->billing_first_name;
            $request->billing_last_name = $request->billing_last_name;
            $request->billing_company_name = $request->billing_company_name;
            $request->billing_address1 = $request->billing_address1;
            $request->billing_city = $request->billing_city;
            $request->billing_state = $request->billing_state;
            $request->billing_zip = $request->billing_zip;
            $request->billing_phone = $request->billing_phone;
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
            if($response['status']!= 200){
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

}
