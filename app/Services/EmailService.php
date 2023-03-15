<?php
namespace App\Services;

use Illuminate\Support\Facades\Mail;
use DB;
use Auth;
use App\Models\WeeklyReport;
use App\Helpers\DataHelper;

class EmailService
{
	public function sendConfirmEmail($toEmails, $subject, $html_text, $job_id, $client_name, $setting){
		$toEmails = explode(',', $toEmails);
		$transport = (new \Swift_SmtpTransport($setting->setting_smtp_host, $setting->setting_smtp_port, $setting->setting_smtp_secure))
		->setUsername($setting->setting_smtp_account)
		->setPassword($setting->setting_smtp_password);
		$swiftMailer = new \Swift_Mailer($transport);
		
		//do your configuration with swift mailer
		// Mail::setSwiftMailer($swiftMailer);
		// Mail::to($setting->setting_smtp_from_mail)->send();
		if($toEmails){
			foreach ($toEmails as $to) {
				$to  = trim($to);
				Mail::setSwiftMailer($swiftMailer);
				Mail::send([], [], function ($message) use ($to, $subject, $html_text, $setting) {
					$message->to($to)
					->from($setting->setting_smtp_from_mail, $setting->setting_smtp_from_name)
					->subject($subject)
					->replyTo($setting->setting_smtp_reply_mail, $setting->setting_smtp_reply_name)
					->setBody($html_text, 'text/html');
				});
				if (Mail::failures()) {
			        // may be we can add a future function here
			    } else {
			    	$this->emailLog($job_id, Auth::id(), 'confimation', $to, $client_name, '');
			    }
			}
			
		}
		
		return true;
    }
    
    public function sendInspectorWeeklyReport($inspector_name, $inspector_email, $subject, $start_date, $end_date, $document_email_attachment, $setting) {
        try {
            $transport = (new \Swift_SmtpTransport($setting->setting_smtp_host, $setting->setting_smtp_port, $setting->setting_smtp_secure))
            ->setUsername($setting->setting_smtp_account)
            ->setPassword($setting->setting_smtp_password);
            $swiftMailer = new \Swift_Mailer($transport);
            
            if($inspector_email){
                $html_text = '<p><b>Hi '.$inspector_name.',</b></p>';
                $html_text .= '<p>This is the weekly job report from '.$start_date.' to '.$end_date.'.</p>';
                $html_text .= '<p>Thanks</p>';
                $html_text .= '<p><b>'.$setting->setting_company_name.'</b></p>';
                
                $inspector_email = trim($inspector_email);
                Mail::setSwiftMailer($swiftMailer);

                // get PDF content
                $pdf_content = DataHelper::getPdfData($document_email_attachment);
                
                $response = Mail::send([], [], function ($message) use ($inspector_email, $subject, $document_email_attachment, $setting, $html_text , $pdf_content) {
                    $message->to($inspector_email)
                            ->from($setting->setting_smtp_from_mail, $setting->setting_smtp_from_name)
                            ->subject($subject)
                            ->replyTo($setting->setting_smtp_reply_mail, $setting->setting_smtp_reply_name)
                            // ->attach($document_email_attachment, ['mime' => 'application/pdf'])
                            ->attachData($pdf_content, 'weekly-report.pdf', ['mime' => 'application/pdf'])
                            ->setBody($html_text, 'text/html');
                });

                if (Mail::failures()) {
                    // may be we can add a future function here
                    echo "Failed to send email to $inspector_email , weekly-report => $document_email_attachment";
                } else {
                    WeeklyReport::where(['inspector_email' => $inspector_email, 'weekly_report_file' => $document_email_attachment])->update(['is_sent_mail' => 1]);
                }
            }
        }
		catch(\Exception $ex) {
            echo "Failed to send email to $inspector_email , weekly-report => $document_email_attachment";
            echo "Error => ". $ex->getMessage();
        }
		return true;
    }

	public function emailLog($job_id,$sent_id,$document_email_type,$document_email_to_email,$document_email_to_name,$document_email_attachment){
		$data = array(
			'job_id' => $job_id,
			'sent_id' => $sent_id,
			'document_email_type' => $document_email_type,
			'document_email_to_email' => $document_email_to_email,	
			'document_email_to_name' => $document_email_to_name,
			'document_email_attachment' => $document_email_attachment
		);
		DB::table('document_email')->insert(
		    $data
		);
		return TRUE;

	}
}