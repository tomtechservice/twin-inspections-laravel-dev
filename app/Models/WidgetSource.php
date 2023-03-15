<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetSource extends Model
{
    public $timestamps = false;

    public function data_source() {
        return $this->belongsTo('App\Models\DataSource','data_source_id');
    }
}