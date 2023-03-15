<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'company';
    public $timestamps = false;
    protected $primaryKey = 'company_id'; 
    protected $fillable = ['company_address1','company_address2','company_city','company_date_created','company_id','company_is_deleted','company_name','company_phone','company_reference_id','company_state','company_type','company_zip'];
}
