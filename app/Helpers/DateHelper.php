<?php
namespace App\Helpers;

class DateHelper{
	

	public static function addDate($date, $formattedAdd, $format='Y-m-d'){
		$dateObject = new \DateTime( $date );
		return $dateObject->add( new \DateInterval($formattedAdd) )->format('Y-m-d');
	}

	public static function timeFix($date, $append){
		$dateObject = new \DateTime( $date );
		if($dateObject->format('H:i:s') == '00:00:00'){
			return $date.' '.$append;
		} else {
			return $dateObject->format('Y-m-d H:i:s');
		}
	}
	public static function getTime($date){
		$dateObject = new \DateTime( $date );
		return $dateObject->format('H:i:s');
	}
	public static function time24To12($time){
		$date = new \DateTime($time);
    	return $date->format('ha') ;
	}

	public static function getWeekDay($date){
		$dateObject = new \DateTime( $date );
		return $dateObject->format('D');
	}

	public static function getTimeDiff($t1, $t2){
		return abs((new \DateTime($t1))->getTimestamp() - (new \DateTime($t2))->getTimestamp()) / 60;
	}

	public static function addHours($time, $hours){
		$now = new \DateTime( $time ); //current date/time
		$now->add(new \DateInterval("PT{$hours}H"));
		return $now->format('H:i:s');
	}

	public static function addMinutes($time, $mins){
		$now = new \DateTime( $time ); //current date/time
		$now->add(new \DateInterval("PT{$mins}M"));
		return $now->format('H:i:s');
	}
	public static function removeSec($time){
		$time = explode(':', $time);
		return $time['0'].":".$time['1'];
	}
	public static function ngbDateTo($oldFormat)
    {
        $newdate = \DateTime::createFromFormat('d/m/Y', vsprintf('%s/%s/%s', [
            $oldFormat['day'],
            $oldFormat['month'],
            $oldFormat['year'],
        ]));
        $newDate = $newdate->format('Y:m:d');
        return $newDate;
    }

    public static function ngbTimeTo($time){
    	return $time['hour'].':'.$time['minute'].':'.$time['second'];
    }
    public static function ngbDateFrom($date)
    {
        $datetime = new \DateTime($date);
        $data = array();
        $data['year'] = (int)$datetime->format('Y');
        $data['month'] = (int)$datetime->format('m');
        $data['day'] = (int)$datetime->format('d');
        return $data;
    }
    public static function dayAdd($date, $days){
		$now = new \DateTime( $date ); //current date/time
		$now->add(new \DateInterval("P{$days}D"));
		return $now->format('Y-m-d');
	}
	public static function format($datim, $which)
	{
		
		if ($which == 1) {
			
			$datim = date('m-d-Y',strtotime($datim));
			//
		}
		if ($which == 2) {
			
			$datim = date('Y-m-d',strtotime($datim)) . ' 00:00:00';
			// 2016-4-16 00:00:00
		}
		if ($which == 3) {
			
			$datim = date('m-d-Y g:ia',strtotime($datim));
			//4-16-2017 10:34am
		}
		if ($which == 4) {
			
			$datim = date('m/d/Y',strtotime($datim));
			//  4/16/2015
		}
		if ($which == 5) {
			
			$datim = date('D F j, Y g:ia',strtotime($datim));
			//  
		}		
		if ($which == 6) {
			
			$datim = date('g:i A',strtotime($datim));
			// 
		}		
		if ($which == 7) {
			
			$datim = date('D F j, Y',strtotime($datim));
			//$datim = 'gooddodod';
		}			
		return $datim;
	}
}