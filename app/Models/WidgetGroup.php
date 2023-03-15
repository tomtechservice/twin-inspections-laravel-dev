<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetGroup extends Model {
    public function widget_list() {
        return $this->hasMany('App\Models\WidgetGroupList','widget_group_id');
    }
    public function group_users() {
        return $this->hasMany('App\Models\WidgetGroupUser','widget_group_id');
    }
}