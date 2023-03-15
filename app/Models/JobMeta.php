<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobMeta extends Model
{
    protected $table = 'job_meta';
    public $timestamps = false;
    protected $guarded = [];
    protected $primaryKey = 'job_meta_id'; // or null

    public function chemical()
    {
        return $this->belongsTo('App\Models\Chemical','chemical_id','chemical_id');
    }
    public function crew()
    {
        return $this->belongsTo('App\Models\User','crew_id');
    }

    public function contractor()
    {
        return $this->belongsTo('App\Models\User','job_meta_contractor_id');
    }
}
