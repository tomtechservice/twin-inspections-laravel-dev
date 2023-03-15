<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWidgetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('widgets', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->string('title');
            $table->integer('data_source_id');
            $table->text('branch_id')->nullable();
            $table->text('agent_id')->nullable();
            $table->bigInteger('goal')->nullable();
            $table->string('data_type')->nullable();
            $table->boolean('is_today')->default(0);
            $table->dateTime('from_date')->nullable();
            $table->dateTime('to_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('widgets');
    }
}
