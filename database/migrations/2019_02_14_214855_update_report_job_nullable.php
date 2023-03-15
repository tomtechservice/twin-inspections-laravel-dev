<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateReportJobNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('ALTER TABLE `job` CHANGE `job_notes` `job_notes` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL');
        DB::statement("ALTER TABLE `report` CHANGE `report_option_subterranean_termites` `report_option_subterranean_termites` TINYINT(1) NULL DEFAULT '0'");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_drywood_termites` `report_option_drywood_termites` TINYINT(1) NULL DEFAULT '0'");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_fungus_dryrot` `report_option_fungus_dryrot` TINYINT(1) NULL DEFAULT '0' ");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_other_findings` `report_option_other_findings` TINYINT(1) NULL DEFAULT '0' ");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_further_inspection` `report_option_further_inspection` TINYINT(1) NULL DEFAULT '0' ");

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('ALTER TABLE `job` CHANGE `job_notes` `job_notes` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL');
        DB::statement("ALTER TABLE `report` CHANGE `report_option_subterranean_termites` `report_option_subterranean_termites` TINYINT(1) NOT NULL DEFAULT '0'");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_drywood_termites` `report_option_drywood_termites` TINYINT(1) NOT NULL DEFAULT '0'");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_fungus_dryrot` `report_option_fungus_dryrot` TINYINT(1) NOT NULL DEFAULT '0' ");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_other_findings` `report_option_other_findings` TINYINT(1) NOT NULL DEFAULT '0' ");
        DB::statement("ALTER TABLE `report` CHANGE `report_option_further_inspection` `report_option_further_inspection` TINYINT(1) NOT NULL DEFAULT '0' ");

    }
}
