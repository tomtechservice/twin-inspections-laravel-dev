<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(AppMakerSeeder::class);
        $this->call(SettingTableSeeder::class);
        $this->call(SettingReportHeader::class);
        $this->call(SettingFindingsReportContent::class);
    }
}
