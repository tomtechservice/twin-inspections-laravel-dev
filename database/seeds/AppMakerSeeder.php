<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AppMakerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::table('app_urls')->truncate();
        DB::table('app_urls')->insert([
        	['url' => 'accounting-report-job-costing','active' => '1','protected' => '1'],
        	['url' => 'accounting-report-inspections-scheduled','active' => '1','protected' => '1'],
        	['url' => 'accounting-report-payroll-details','active' => '1','protected' => '1'],
        	['url' => 'accounting-report-estimated-vs-actual','active' => '1','protected' => '1']
        ]);
    }
}
