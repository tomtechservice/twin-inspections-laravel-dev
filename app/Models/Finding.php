<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Finding extends Model
{
    protected $table = 'finding';
    public $timestamps = false;
    protected $primaryKey = 'finding_id'; // or null
    protected $fillable = ['report_id',
                            'job_id',
                            'agent_id',
                            'finding_code',
                            'finding_description',
                            'finding_recommendation',
                            'finding_notes',
                            'finding_extras',
                            'finding_section',
                            'finding_type',
                            'finding_finding',
                            'finding_uses_chemicals',
                            'finding_notes_only',
                            'finding_notes_position',
                            'finding_bid_crew_notes',
                            'finding_bid_linear_feet',
                            'finding_bid_hours',
                            'finding_bid_hours_rate',
                            'finding_bid_hours_perc',
					        'finding_bid_hours_sub_total',
					        'finding_bid_materials',
					        'finding_bid_materials_markup',
					        'finding_bid_materials_subtotal',
					        'finding_bid_subcontractor',
					        'finding_bid_subcontractor_markup',
					        'finding_bid_subcontractor_subtotal',
					        'finding_bid_office_markup',
					        'finding_bid_primary',
					        'finding_bid_primary_type',
					        'finding_bid_primary_alt',
					        'finding_bid_primary_alt_other',
                            'finding_bid_primary_or_secondary',
                            'finding_which_bid',
                            'finding_bid_secondary_recommendation',
                            'finding_bid_secondary_crew_notes',
					        'finding_bid_secondary_linear_feet',
					        'finding_bid_secondary_hours',
					        'finding_bid_secondary_hours_rate',
					        'finding_bid_secondary_hours_perc',
					        'finding_bid_secondary_hours_sub_total',
					        'finding_bid_secondary_materials',
					        'finding_bid_secondary_materials_markup',
					        'finding_bid_secondary_materials_subtotal',
					        'finding_bid_secondary_subcontractor',
					        'finding_bid_secondary_subcontractor_markup',
					        'finding_bid_secondary_subcontractor_subtotal',
					        'finding_bid_secondary_office_markup',
                            'finding_bid_secondary',
                            'finding_is_deleted',
                            'finding_bid_linear_feet',
                            'finding_bid_secondary_linear_feet',
                            'finding_bid_secondary_type',
                            'finding_bid_secondary_alt',
                            'finding_bid_secondary_alt_other',

                            'finding_perform_crew_id',
                            'finding_bid_hours_completed',
                            'finding_bid_material_completed',
                            'finding_date_completed',
                            'finding_completed',
                            'finding_partially_completed',
                            'partially_completed_discount'

                          ];

    public function finding_perform_crew() {
        return $this->belongsTo('App\Models\User','finding_perform_crew_id');
    }

    public function finding_images() {
        return $this->hasMany('App\Models\FindingImage','finding_id');
    }

    public function finding_code_data() {
        return $this->belongsTo('App\Models\Code','finding_code','code_name');
    }

    public function chemicals()
    {
        return $this->hasMany('App\Models\Chemical','finding_id');
    }
    
    
    

}
