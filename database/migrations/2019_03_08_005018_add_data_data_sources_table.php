<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDataDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('data_sources')->insert([
            array(
                'api_url' => 'sources/custom',
                'slug' => 'custom',
                'name' => 'Custom',
                'status' => 'active',
            )
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('data_sources', function (Blueprint $table) {
            //
        });
    }
}
