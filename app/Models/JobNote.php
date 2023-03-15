<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobNote extends Model
{
    protected $table = 'job_note';
    public $timestamps = false;
    protected $guarded = [];
    public function user()
    {
        return $this->belongsTo('App\Models\User','user_id');
    }
}
