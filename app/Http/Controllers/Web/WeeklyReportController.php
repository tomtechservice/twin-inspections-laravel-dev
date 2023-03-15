<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisan;

class WeeklyReportController extends Controller
{
    public function generateWeeklyReport(Request $request) {
        Artisan::call('weekly_report:generate');
    }
}
