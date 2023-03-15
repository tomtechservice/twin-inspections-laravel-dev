<?php
namespace App\Services;


class WorkContractService
{
    public $findings;
    public $type = 'new';
    public $returnData = [];
	function __construct()
	{
        
    }

    
    public function filterFindingsWithType($findings, $type){
        if($findings){
            $this->findings = $findings;
            $this->type = $type;
            $this->filterFindings();
            return $this->returnData;
        } 
    }
    public function filterFindings(){
        $this->returnData['total'] = [];
        $this->returnData['total']['primary_bid'] = 0;
        $this->returnData['total']['secondary_bid'] = 0;
        //$x is section which is 1,2,3 usually
        for ($x = 1; $x <= 3; $x++) {
            // extracting primary and secondary bid data from findings
            // $this->type == new means not performed otherwise it is job
            if($this->type == 'new'){
                $findingData = $this->extractFindings($x, 0, 0, '');
            } else {
                $findingData = $this->extractFindings($x, 0, 0, 1);
            }
            $this->returnData['data'][] = $findingData;
            if($findingData){
                // summing primary and secondary bid
                $this->returnData['total']['primary_bid'] = $this->returnData['total']['primary_bid'] + (int)$findingData['total']['bid_price'];
                $this->returnData['total']['secondary_bid'] = $this->returnData['total']['secondary_bid'] + (int)$findingData['total']['bid_price_secondary'];
            }
            
        }
        return $this->returnData;
    }
    public function extractFindings($section, $deleted, $isNote, $performed=NULL){
        $findings = $this->findings
            ->where('finding_section', $section)
            ->where('finding_notes_only', $isNote)
            ->where('finding_is_deleted', $deleted);
        if($performed){
            $findings->where('finding_perform', $performed);
        }
        if($findings->count() > 0){
            return $this->resultData($findings);
        }

    }
    public function resultData($findings){
        
        $returnData = [];
        $returnData['data'] = [];
        $returnData['total'] = ['bid_price'=>0,'bid_price_secondary'=>0];
        foreach ($findings as $key=>$finding) {
            // generating section title
            $returnData['data'][$key]['section_title'] = $finding->finding_type . $finding->finding_finding;
            // if primary bid is not 0
            if($finding->finding_bid_primary != 0.00) {
                if ($finding->finding_additional_discount == 0.00)  {
                    $returnData['data'][$key]['bid_price'] = $finding->finding_bid_primary;
                    $returnData['total']['bid_price'] = $returnData['total']['bid_price'] + $finding->finding_bid_primary;
                }  else  {
                    $returnData['data'][$key]['bid_price'] = $finding->finding_bid_primary - $finding->finding_additional_discount;
                    $returnData['total']['bid_price'] = $returnData['total']['bid_price'] + ($finding->finding_bid_primary - $finding->finding_additional_discount);
                }
            } else {
                if ($finding->finding_bid_primary_type == 'no bid') {
                    if ($finding->finding_bid_primary_alt == 'INCLUDED IN' || $finding->finding_bid_primary_alt == 'SEE' || $finding->finding_bid_primary_alt == 'OTHER') {
                        $returnData['data'][$key]['bid_price'] = $finding->finding_bid_primary_alt_other;
                    } else {
                        $returnData['data'][$key]['bid_price'] = $finding->finding_bid_primary_alt;
                    }
                }
            }
            // if secondary bid is not zero
            if ($finding->finding_bid_secondary != 0.00) {
                $returnData['data'][$key]['bid_price_secondary'] = $finding->finding_bid_secondary;
                $returnData['total']['bid_price_secondary'] = $returnData['total']['bid_price_secondary'] + $finding->finding_bid_secondary;
                
            } else {
                $returnData['data'][$key]['bid_price_secondary'] = 'NONE';          
                
            }   
        }
        return $returnData;
    }
}