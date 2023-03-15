<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCompanyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('company', function (Blueprint $table) {
            $table->string('company_reference_id',255)->nullable()->change();
            $table->string('company_type',25)->nullable()->change();
            $table->string('company_name',225)->nullable()->change();      
            $table->string('company_address1',225)->nullable()->change();
            $table->string('company_address2',225)->nullable()->change();         
            $table->string('company_city',225)->nullable()->change();
            $table->string('company_state',25)->nullable()->change();
            $table->string('company_zip',25)->nullable()->change();
            $table->string('company_phone',25)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('company', function (Blueprint $table) {
            $table->string('company_reference_id',255)->change();
            $table->string('company_type',25)->change();
            $table->string('company_name',225)->change();      
            $table->string('company_address1',225)->change();
            $table->string('company_address2',225)->change();         
            $table->string('company_city',225)->change();
            $table->string('company_state',25)->change();
            $table->string('company_zip',25)->change();
            $table->string('company_phone',25)->change();
        });
    }
}
