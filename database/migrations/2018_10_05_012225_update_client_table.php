<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateClientTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('client', function (Blueprint $table) {
            $table->string('client_reference_id',255)->nullable()->change();
            $table->string('client_type',25)->nullable()->change();
            // $table->tinyInteger('client_is_company')->default(0)->nullable()->change();
            $table->string('client_first_name',225)->nullable()->change();
            $table->string('client_last_name',225)->nullable()->change();      
            $table->string('client_address1',225)->nullable()->change();
            $table->string('client_address2',225)->nullable()->change();         
            $table->string('client_city',225)->nullable()->change();
            $table->string('client_state',25)->nullable()->change();
            $table->string('client_zip',25)->nullable()->change();
            $table->string('client_phone',25)->nullable()->change();
            $table->string('client_cell',25)->nullable()->change();
            $table->string('client_email',225)->nullable()->change();
            $table->text('client_notes')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('client', function($table) {
            $table->string('client_reference_id',225)->change();
            $table->string('client_type',25)->change();
            // $table->tinyInteger('client_is_company')->default(0)->change();
            $table->string('client_first_name',225)->change();
            $table->string('client_last_name',225)->change();      
            $table->string('client_address1',225)->change();
            $table->string('client_address2',225)->change();
            $table->string('client_city',225)->change();
            $table->string('client_state',25)->change();
            $table->string('client_zip',25)->change();
            $table->string('client_phone',25)->change();
            $table->string('client_cell',25)->change();
            $table->string('client_email',225)->change();
            $table->text('client_notes')->change();
        });
    }
}
