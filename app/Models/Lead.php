<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $table = 'lead';
    public $timestamps = false;
    protected $primaryKey = 'lead_id'; // or null
}
