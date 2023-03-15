<?php
namespace App\Helpers;
use Illuminate\Support\Facades\Log;

class DataHelper{
	public static function sumUsingKeys($object, $key){
		$sum = 0;
		foreach ($object as $value) {
			$sum = $sum + $value->$key;
		}
		return $sum;
	}

    /**
     * get the PDF data from url
     */
    public static function getPdfData($url){
        try {
            
            if (!function_exists('curl_init')){ 
                die('CURL is not installed!');
                return null;
            }
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $output = curl_exec($ch);
            
            $retry = 0;
            while(curl_errno($ch) == 28 && $retry < 3){
                $output = curl_exec($ch);
                $retry++;
            }
            curl_close($ch);

            if(curl_errno($ch) == 28){
                return null;
            }
            return $output;
        } catch (\Exception $ex) {
            $arrayToLog = [
                __METHOD__,
                'LINE' => __LINE__,
                'url' => $url,
                'File get Content Error' => $ex->getMessage(),
            ];
            Log::info(print_r($arrayToLog, true));
            return null;
        }
        
	}
}