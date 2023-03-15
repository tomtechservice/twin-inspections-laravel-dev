<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DataSourceTableData extends Migration
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
                'api_url' => 'sources/revenue',
                'slug' => 'revenue',
                'name' => 'Revenue',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/inspection_scheduled',
                'slug' => 'inspection_scheduled',
                'name' => 'Inspections Scheduled',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/inspection_performed',
                'slug' => 'inspection_performed',
                'name' => 'Inspections Performed',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/charges',
                'slug' => 'charges',
                'name' => 'Charges',
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
        DB::table('data_sources')->delete();
    }
}
