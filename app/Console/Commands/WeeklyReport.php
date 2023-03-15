<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CommonService;
use App\Models\WeeklyReport as WeeklyReportModel;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Support\Facades\Log;

class WeeklyReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'weekly_report:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will generate weekly reports for opted in inspectors';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->commonService = new CommonService();
        $this->emailService = new EmailService();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            $report_url = env("OLD_SITE", " ");
            $report_url .= "/pdf/generate/make_inspector_weekly_report.php";
            $settings = $this->commonService->getSettings();
            $datetime = new \DateTime();
            if(isset($settings->report_mail_send_day) && !empty($settings->report_mail_send_day) && isset($settings->report_mail_send_time) && !empty($settings->report_mail_send_time)) {
                // get hours integer
                if(strtolower($datetime->format('l')) == $settings->report_mail_send_day && intval($datetime->format('H')) == intval($settings->report_mail_send_time)) {
                    $amount = $settings->report_mail_criteria_usd_amount;
                    $duration = json_decode($settings->report_mail_send_duration);
                    $start_date = '';
                    $end_date = '';
                    switch($duration[0]) {
                        case 'last week':
                            $end_date = $datetime->format('Y-m-d');
                            $datetime->modify('-7 DAY');
                            $start_date = $datetime->format('Y-m-d');
                        break;
                        case 'last two week':
                            $end_date = $datetime->format('Y-m-d');
                            $datetime->modify('-14 DAY');
                            $start_date = $datetime->format('Y-m-d');
                        break;
                        case 'last month':
                            $end_date = $datetime->format('Y-m-d');
                            $datetime->modify('-30 DAY');
                            $start_date = $datetime->format('Y-m-d');
                        break;
                    }

                    // get opted-in inspectors 
                    $inspectors = User::where([['user_level_id', '=', '2'],['user_id', '!=', '1'],['user_is_deleted', '=', '0'],['user_active', '=', '1'],['is_allow_weekly_report', '=', '1']])
                                        ->orderBy('user_last_name', 'asc')
                                        ->get();
                    
                    if($inspectors) {
                        foreach($inspectors as $inspector) {
                            $data = [
                                'start_date' => $start_date,
                                'end_date' => $end_date,
                                'amount' => $amount,
                                'inspector_id' => $inspector->user_id
                            ];
                            $result = $this->commonService->generatePdf($data, $report_url);
                            
                            // send email to inspector
                            if($result == "success") {
                                $weekly_report = WeeklyReportModel::where(['inspector_email' => $inspector->user_email, 'is_sent_mail' => 0])->orderBy('created_at', 'desc')->first();
                                if($weekly_report) {
                                    $pdf_file = env('DO_SPACE').'media/reports/weekly-report/generated/'.$weekly_report->weekly_report_file;
                                    $this->emailService->sendInspectorWeeklyReport($inspector->user_first_name, $weekly_report->inspector_email, "Twin Termite Weekly Job Report", $start_date, $end_date, $pdf_file, $settings);
                                    
                                    $arrayToLog = [
                                        __METHOD__,
                                        'LINE' => __LINE__,
                                        'Weekly Report PDF Sent to  "' .$weekly_report->inspector_email . '" successfully!',
                                    ];
                                    Log::info(print_r($arrayToLog, true));
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            // leave log failed sending weekly report.
            $arrayToLog = [
                __METHOD__,
                'LINE' => __LINE__,
                'Weekly Report Failed',
                'error' => $e->getMessage(),
            ];
            Log::info(print_r($arrayToLog, true));
        }
        
    }
}
