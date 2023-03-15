<?php
namespace App\Helpers;

class ZillHelper{
    
	public static function zill($address1,$citystate,$which)
	{
		//echo $address1 . '---' . $citystate . '---' . $which;
		//$address1 = '88811 Deermoss Way N';
		//$citystate = 'Jacksonville FL';

		$addy = str_replace(" ","+",$address1);
		$city = str_replace(" ","+",$citystate);

		$temp = '';
		
		$zillow_id = urlencode('X1-ZWz1dxir1f12bv_6bk45');
		
		$search = $addy; //$_GET['address'];
		$citystate = $city; //$_GET['citystate'];
		$address = urlencode($search);
		$citystatezip = urlencode($citystate);

		$url = 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=' . $zillow_id . '&address=' . $address . '&citystatezip=' . $citystatezip . '&rentzestimate=true'; 
		
		

		$xml = file_get_contents($url);
		//echo $xml;
		$is_error = 0;
		
		if (strpos($xml, 'no exact match found')) {
			$is_error = 1;
		}
		if (strpos($xml, 'Error')) {
			$is_error = 1;
		}
	
	
    foreach ($http_response_header as $header)
    {   
        if (preg_match('#^Content-Type: text/xml; charset=(.*)#i', $header, $m))
        {   
            switch (strtolower($m[1]))
            {   
                case 'utf-8':
                    // do nothing
                    break;

                case 'iso-8859-1':
                    $xml = utf8_encode($xml);
                    break;

                default:
                    $xml = iconv($m[1], 'utf-8', $xml);
            }
            break;
        }
    }
	
	
		if (!$is_error) {
			$data = simplexml_load_string($xml);
			if($data) {
				$j = json_encode($data);
				$addy = json_decode($j);			
				if ($which == 'year') {
					$temp = $addy->response->results->result->yearBuilt; 
				} else {
					$temp = $addy->response->results->result->finishedSqFt;
				}			
			} else {
				$temp = 'not found';
			}
			return $temp;
		} else {
			return 'not found';
		} // if zillow gives not found error
	}
}