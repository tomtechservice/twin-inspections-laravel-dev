<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateJobMeta extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_meta', function (Blueprint $table) {
            $table->decimal('job_meta_crew_hours', 10, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_meta', function (Blueprint $table) {
           $table->decimal('job_meta_crew_hours', 10, 2)->nullable(false)->change();
        });
    }
}
