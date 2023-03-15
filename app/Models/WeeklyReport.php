<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeeklyReport extends Model
{
    protected $table = 'weekly_reports';
    public $timestamps = true;
    protected $guarded = [];
}
