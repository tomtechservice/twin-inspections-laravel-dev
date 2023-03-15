<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdatePropertyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('property', function (Blueprint $table) {
            $table->string('property_type',25)->after('property_use_google_maps')->nullable()->change();
            $table->string('property_year',25)->after('property_type')->nullable()->change();
            $table->string('property_square_feet',25)->after('property_year')->nullable()->change();
            $table->string('property_foundation',25)->after('property_square_feet')->nullable()->change();      
            $table->text('property_notes')->after('property_foundation')->nullable()->change();
            $table->string('property_image_file',225)->after('property_notes')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('property', function($table) {
            $table->string('property_type',25)->after('property_use_google_maps')->change();
            $table->string('property_year',25)->after('property_type')->change();
            $table->string('property_square_feet',25)->after('property_year')->change();
            $table->string('property_foundation',25)->after('property_square_feet')->change();      
            $table->text('property_notes')->after('property_foundation')->change();
            $table->string('property_image_file',225)->after('property_notes')->change();
        });
    }
}
