<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetGroupUser extends Model {
    public function user() {
        return $this->belongsTo('App\Models\User','widget_user_id');
    }

}