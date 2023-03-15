<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobLogs extends Model
{
    protected $table = 'job_logs';
    protected $fillable = ['status_id','user_id','job_id','type','message','created_at'];
    public $timestamps = false;
    public function status()
    {
        return $this->belongsTo('App\Models\JobLogsStatuses','status_id');
    }
    public function user()
    {
        return $this->belongsTo('App\Models\User','user_id');
    }
    
}
