<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGoogleSheetDataSourcesTable extends Migration
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
                'api_url' => 'sources/google_sheet/SacramentoHome/C2',
                'slug' => 'google_sheet_SacramentoHome_C2',
                'name' => 'Sacramento Home Inspections',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/SacramentoHome/D2',
                'slug' => 'google_sheet_SacramentoHome_D2',
                'name' => 'Sacramento Home Revenue',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/SacramentoPest/C2',
                'slug' => 'google_sheet_SacramentoPest_C2',
                'name' => 'Sacramento Pest New Service',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/SacramentoPest/D2',
                'slug' => 'google_sheet_SacramentoPest_D2',
                'name' => 'Sacramento Pest Revenue',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/AuburnHome/C2',
                'slug' => 'google_sheet_AuburnHome_C2',
                'name' => 'Auburn Home Inspections',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/AuburnHome/D2',
                'slug' => 'google_sheet_AuburnHome_D2',
                'name' => 'Auburn Home Revenue',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/VacavilleHome/C2',
                'slug' => 'google_sheet_VacavilleHome_C2',
                'name' => 'Vacaville Home Inspections',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/VacavilleHome/D2',
                'slug' => 'google_sheet_VacavilleHome_D2',
                'name' => 'Vacaville Home Revenue',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/VacavillePest/C2',
                'slug' => 'google_sheet_VacavillePest_C2',
                'name' => 'Vacaville Pest New Service',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/VacavillePest/D2',
                'slug' => 'google_sheet_VacavillePest_D2',
                'name' => 'Vacaville Pest Revenue',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/SanDiegoHome/C2',
                'slug' => 'google_sheet_SanDiegoHome_C2',
                'name' => 'San Diego Home Inspections',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/SanDiegoHome/D2',
                'slug' => 'google_sheet_SanDiegoHome_D2',
                'name' => 'San Diego Home Revenue',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/SanDiegoPest/C2',
                'slug' => 'google_sheet_SanDiegoPest_C2',
                'name' => 'San Diego Pest New Service',
                'status' => 'active',
            ),
            array(
                'api_url' => 'sources/google_sheet/SanDiegoPest/D2',
                'slug' => 'google_sheet_SanDiegoPest_D2',
                'name' => 'San Diego Pest Revenue',
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
