<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Code extends Model
{
    protected $table = 'code';
    public $timestamps = false;

    protected $primaryKey = 'code_id'; 
    protected $guarded = [];
}

