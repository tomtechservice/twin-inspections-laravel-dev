<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityMeta extends Model
{
    public $timestamps = false;
    protected $table = 'activity_meta';
    protected $primaryKey = 'activity_meta'; // or null
    protected $guarded = [];
}
