<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FindingAdditionalWork extends Model
{
    protected $table = 'finding_additional_work';
    public $timestamps = false;
    protected $primaryKey = 'finding_additional_work_id'; // or null

    protected $fillable = [
        'job_id',
        'report_id',
        'agent_id',
        'crew_id',
        'finding_bid_additional_work',
        'finding_description_additional_work',
        'finding_notes_additional_work',
        'finding_crew_additional_work',
        'finding_uses_chemicals_additional_work',
        'finding_chemical_additional_work',
        'finding_hours_additional_work',
        'finding_materials_additional_work',
        'finding_completed_date_additional_work',
        'finding_completed_date_additional_work_date_created',
        'finding_additional_work_is_deleted'
    ];

    public function crew()
    {
        return $this->belongsTo('App\Models\User','crew_id');
    }

}
