<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsNoteAlertToJobNoteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_note', function (Blueprint $table) {
            $table->tinyInteger('is_note_alert')->default(0)->nullable()->after('job_note_note');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_note', function (Blueprint $table) {
            //
        });
    }
}
