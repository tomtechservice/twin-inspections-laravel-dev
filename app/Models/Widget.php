<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Widget extends Model {
    public function dataSource() {
        return $this->belongsTo('App\Models\DataSource','data_source_id');
    }

    public function widget_sources() {
        return $this->hasMany('App\Models\WidgetSource','widget_id');
    }
}
