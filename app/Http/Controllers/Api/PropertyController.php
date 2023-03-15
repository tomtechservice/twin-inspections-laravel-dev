<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\PropertyService;
use App\Services\InspectionService;
use App\Helpers\ZillHelper;
use Validator;

class PropertyController extends Controller
{
    public function __construct(PropertyService $property,InspectionService $inspection)
    {
        $this->property = $property;
        $this->inspection = $inspection;
    }

    /**
     * Add a new Property
     */
    public function addProperty(Request $request){
        $this->validate($request,[
            'property_address1'=>'required',
            // 'property_address2'=>'required',
            'property_city'=>'required',
            // 'property_state'=>'required',
            'property_zip'=>'required',
            'property_year'=>'required',
            'property_square_feet'=>'required'
            ]);

        // if($request->property_id){
        //     $request->toal_inspection_min = $this->inspection->findTotalInspectionMinutes(
        //         $request->property_id
        //     );
        // }
            
        $result = $this->property->insertProperty($request);
        if($result){
            return $result;
        }else{
            return response()->json(['error' =>'error'], 400 );
        }
    }
    
    public function searchProperty(Request $request){
        $result = $this->property->searchNew($request->property_address1);
        return $result;
    }
    public function propertyInfo(Request $request){
        
        $result = $this->property->propertyInfo($request);
        return $result;
    }
    public function getProperty($job_id){
        
        $result = $this->property->getProperty($job_id);
        return $result;
    }
    public function getPropertywithJob($job_id){
        
        $result = $this->property->getPropertywithJob($job_id);
        return $result;
    }
    public function getzill(Request $request){
        $address = $request->post('address');
        $city = $request->post('city');
        $zill=array();
        $zill['feet']  = ZillHelper::zill($address,$city,'feet');
        $zill['year'] = ZillHelper::zill($address,$city,'year');
        return $zill;
    }
    public function getZip($zip){
        $result = $this->property->getZip($zip);
        return $result;
    }
    public function getPropertyData($property_id)
    {
        return $this->property->find($property_id);
    }

    // set lockbox code on property if exist
    public function setLockboxCode(Request $request)
    {
        $data = $request->all();
        $response = ['success' => false, 'message' => ''];
        try {
            if(isset($data['property_id']) && isset($data['lockbox_code'])) {
                $property = $this->property->find($data['property_id']);
                if ($property) {
                    // update property data
                    $this->property->update(['property_lock_box_code' => $data['lockbox_code']], $data['property_id']);
                    $response['success'] = true;
                    $response['message'] = 'Lockbox code setup successfully';
                }
                else {
                    $response['message'] = "Unable to find requested property";        
                }
            }
            else {
                $response['message'] = "Please enter lockbox code and then try to save";    
            }
        }
        catch(\Exception $ex) {
            $response['message'] = "Unable to find requested property";
        }
        return response()->json($response);
    }
    //
}
