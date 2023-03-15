<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', 'Api\LoginController@postLogin');
Route::post('/logout', 'Api\LoginController@postLogout');
Route::get('/search-api', 'Api\CommonController@getSearch');
Route::post('card/save', 'Api\ClientController@cardPublic');
Route::group(['middleware' => ['jwt.auth']], function () {

    Route::get('/test', 'Api\LoginController@getUser');

    Route::get('/branch', 'Api\CommonController@getBranch');
    Route::get('/inspectors', 'Api\CommonController@getInspectors');
    Route::get('/inspectors-preferred/{job_id}', 'Api\CommonController@getInspectorsWithPreferredLabel');
    Route::get('/data_sources', 'Api\CommonController@getDataSources');



    Route::post('/jobcost', 'Api\JobCostController@jobCost');
    Route::post('/payroll_report', 'Api\PayRollController@payRollReport');
    Route::post('/payroll_report_new', 'Api\PayRollController@payRollReportNew');
    Route::post('/estimated_report', 'Api\EstimatedController@estimatedReport');
    Route::post('/inspection_report', 'Api\InspectionController@getAccountScheduledInspection');
    Route::post('report/agent_activity', 'Api\ManagementController@agentActivityReport');
    Route::post('report/inspectors_sales', 'Api\ManagementController@inspectorSalesReport');
    Route::post('report/agent-sales', 'Api\ManagementController@agentSalesReport');

    Route::post('/post_widget', 'Api\WidgetController@addWidget');
    Route::get('/widget', 'Api\WidgetController@getWidget');
    Route::delete('/discard_widget/{id}', 'Api\WidgetController@remove');
    Route::get('/edit_widget/{id}', 'Api\WidgetController@editWidget');
    Route::post('/report/wants_earlier', 'Api\CommonController@wantsEarlier');

    // property
    Route::post('add_property', 'Api\PropertyController@addProperty');
    Route::post('search_property', 'Api\PropertyController@searchProperty');

    Route::get('get_property/{job_id}', 'Api\PropertyController@getProperty');
    Route::get('property/get/{job_id}', 'Api\PropertyController@getPropertywithJob');
    Route::get('property/get_property/{property_id}', 'Api\PropertyController@getPropertyData');
    Route::post('property/zill', 'Api\PropertyController@getzill');
    Route::get('property/check_zip/{zip}', 'Api\PropertyController@getZip');




    Route::post('property_info', 'Api\PropertyController@propertyInfo');
    Route::post('inspections_schedule', 'Api\InspectionController@inspectionSchedule');
    Route::get('inspections_logs/{id}', 'Api\LogController@getLogs');
    Route::post('do_report_info', 'Api\InspectionController@doReportInfo');
    Route::post('edit_job_info', 'Api\InspectionController@editJobInfo');

    Route::post('set_lockbox_code', 'Api\PropertyController@setLockboxCode');

    // client info
    Route::post('search_client', 'Api\ClientController@searchClient');
    Route::get('all_clients', 'Api\ClientController@getAllClients');

    Route::get('get_clients', 'Api\ClientController@getClients');
    Route::get('get_company', 'Api\CompanyController@searchCompany');

    Route::get('client/remove_client/{jobId}/{intakeTab}', 'Api\JobController@removeClient');



    Route::get('all_company', 'Api\CompanyController@getAllCompany');
    Route::get('all_lead', 'Api\CommonController@getAllLead');

    Route::post('new_order', 'Api\JobController@newOrder');
    Route::get('get_order/{job_id}/{acive_client}', 'Api\JobController@getOrder');
    Route::post('set-job-status', 'Api\JobController@setJobStatus');
    Route::post('client/add/{client_id}', 'Api\ClientController@addClient');
    Route::get('client/edit/{client_id}', 'Api\ClientController@editClient');
    Route::post('client/list', 'Api\ClientController@clientList');
    Route::get('client/delete/{client_id}', 'Api\ClientController@clientDelete');
    Route::get('company/search/{search}', 'Api\CompanyController@searchAllCompany');

    Route::get('client/preferred_inspectors/{client_id}', 'Api\ClientController@getPreferredInspectors');

    //branc
    Route::get('branch/get-branch/{id}', 'Api\BranchesController@getBranch');


    //  -------------   Findings List Page APIs  ---------------------------
    Route::get('/jobfindings/{jobId}', 'Api\FindingController@getJobFindings');
    Route::get('/jobinfofindings/{jobId}', 'Api\FindingController@getJobInfoFindings');
    Route::get('reportdocs/{jobId}', 'Api\ReportController@getReportDocsForJob');
    Route::get('get_job_report/{jobId}', 'Api\ReportController@getJobReport');
    Route::post('downloadDoc', 'Api\ReportController@postDownloadDocs');
    Route::get('get_finding_codes', 'Api\FindingController@getFindingCodes');
    Route::get('finding_code_data/{codeId}', 'Api\FindingController@getFindingCodeData');
    Route::post('add_finding', 'Api\FindingController@postFinding');
    Route::get('getfinding/{findingId}', 'Api\FindingController@getFinding');
    Route::post('finding_primary_bid', 'Api\FindingController@postFindingPrimaryBid');
    Route::post('finding_secondary_bid', 'Api\FindingController@postFindingSecondaryBid');
    Route::get('get_setting_data', 'Api\CommonController@getSettingsData');
    Route::post('set-report-content/{setting_id}', 'Api\CommonController@setReportContentSetting');
    Route::post('set-findings-report-content/{setting_id}', 'Api\CommonController@setFindingsReportContent');
    Route::post('set-work-report-header/{setting_id}', 'Api\CommonController@setWorkReportHeaderSetting');
    Route::post('set-findings-report-header/{setting_id}', 'Api\CommonController@setFindingsReportHeader');
    Route::post('set-state-law-section/{setting_id}', 'Api\CommonController@setStateLawsReport');
    Route::get('deletefinding/{findingId}', 'Api\FindingController@deleteFindingData');
    Route::get('get_job/{jobId}', 'Api\JobController@getJobData');
    Route::get('get_findings_parent/{job_ref_parent}', 'Api\FindingController@getFindingsParent');
    Route::post('saveFindingImage', 'Api\FindingController@postFindingImage');
    Route::get('getFindingsImages/{findingId}', 'Api\FindingController@getFindingsImages');
    Route::get('deleteFindingsImages/{findingImageId}', 'Api\FindingController@deleteFindingsImages');
    Route::post('findinggenerateReport', 'Api\FindingController@generateFindingReport');
    Route::get('autoFillFinding/{jobId}', 'Api\FindingController@autoFillFinding');
    //---------------   Findings List Page APIs  ------------------------------------------------
    Route::get('getAssigneeList', 'Api\CommonController@getAssigneeList');
    // ------------------- Job Info page APIs ----------------------------------------------------
    Route::post('setPerformFindings', 'Api\FindingController@setPerformFindings');
    Route::post('postJobinfo', 'Api\JobController@postJobinfo');
    Route::post('makeJobCardPDF', 'Api\JobController@makeJobCardPDF');
    // ------------------- Job Info page APIs ----------------------------------
    Route::get('get-findings-completed-not-posted/{jobId}', 'Api\FindingController@getFindingsCompletedNotPosted');
    //  -------------   Findings List Page APIs  ------------------------------------------------
    // intake api calls
    // Route::get('/jobfindings/{jobId}','Api\FindingController@getJobFindings');
    // get report data of a job
    Route::post('post_report', 'Api\ReportController@postReport');
    Route::post('generate_noc', 'Api\ReportController@generateNoc');

    Route::get('code/{code}', 'Api\CommonController@getCode');

    Route::get('report/{jobId}', 'Api\ReportController@getReportForJob');
    Route::get('findings/job/{jobId}', 'Api\FindingController@getExistingFindingsOfJob');
    Route::get('getJobWithRelation/{jobId}', 'Api\JobController@getJobWithRelation');
    Route::post('inspection-completed', 'Api\InspectionController@inspectionCompleted');

    Route::get('getAllJobs/{jobId}', 'Api\JobController@getAllParentChildJobs');
    Route::get('getjobforjobinfo/{jobId}', 'Api\JobController@getJobRelationForJobInfo');
    Route::post('job-completed', 'Api\JobController@setJobComplete');
    Route::post('download-noc', 'Api\JobController@downloadNoc');
    Route::get('get-job-data', 'Api\JobController@getJobDataBySearch');



    Route::get('getaddress', 'Api\CommonController@calendar');
    Route::get('calendar/', 'Api\CommonController@getToken');
    // schedule methods
    Route::post('/schedule/add', 'Api\ScheduleController@add');
    Route::get('/schedule/get/{jobId}', 'Api\ScheduleController@getSchedule');
    Route::get('/schedule/search', 'Api\ScheduleController@search');
    Route::get('/schedule/search-available', 'Api\ScheduleController@searchAvailable');

    Route::post('/schedule/switch-agent', 'Api\ScheduleController@postAgentSchedule');
    Route::get('/schedule/minutes/{jobId}', 'Api\InspectionController@getTotalInspectionMinutes');
    Route::get('/schedule/calendar-status/{agent_id}', 'Api\ScheduleController@getCalendarStatus');
    Route::get('/schedule/office-calendar-status/{agent_id}', 'Api\ScheduleController@getOfficeCalendarStatus');
    Route::post('/schedule/check-agent-schedule', 'Api\ScheduleController@getAgentScheduleAvailability');

    // completion tasks functions
    Route::get('/completion/get/{jobId}', 'Api\CompletionController@getCompletions');

    Route::post('upload_diagram', 'Api\DiagramController@add');
    Route::get('clear_cache/{job_id}', 'Api\DiagramController@cacheClear');

    // job meta
    Route::post('job-meta/add-contractors', 'Api\JobMetaController@addContractors');
    Route::post('job-meta/add-additional-chemicals', 'Api\JobMetaController@addAdditionalChemicals');
    Route::post('job-meta/do-materials-meta', 'Api\JobMetaController@doMaterialsMeta');
    Route::post('job-meta/do-chem-hours-meta', 'Api\JobMetaController@doChemHoursMeta');
    Route::post('job-meta/do-chemicals-applied', 'Api\JobMetaController@doChemicalsApplied');
    Route::post('job-meta/on-delete-job-meta', 'Api\JobMetaController@onDeleteJobMeta');
    Route::get('job-meta/get/{jid}/{fid}', 'Api\JobMetaController@chemicalsApplied');
    Route::put('finding/update/{jid}', 'Api\FindingController@jobCompletion');

    // job crew
    Route::post('job-crew/do-job-crew', 'Api\JobCrewsController@doJobCrew');

    //finding
    Route::post('get-finding-crew-commission', 'Api\FindingController@getFindingCrewCommission');
    Route::post('finding-additional-work/do-additional-work', 'Api\FindingAdditionalWorkPerformedController@doAdditionalWork');
    Route::get('finding-additional-work/get-additional-work/{id}', 'Api\FindingAdditionalWorkPerformedController@getFindingAdditionalWork');
    Route::post('finding-additional-work/update-additional-work', 'Api\FindingAdditionalWorkPerformedController@updateCompletionDate');
    Route::post('finding-additional-work/delete-additional-work', 'Api\FindingAdditionalWorkPerformedController@onDelete');

    //chemical-controller
    Route::get('chemicals/get-chemical-unit/{chemical_id}', 'Api\ChemicalsController@getChemicalUnit');
    Route::get('chemicals/get-chemicals', 'Api\ChemicalsController@getChemicals');

    // card
    Route::post('client/card_details/{clientId}', 'Api\ClientController@cardDetails');
    Route::get('client/card_list/{clientId}', 'Api\ClientController@cardList');
    Route::post('client/payment/{clientId}', 'Api\ClientController@postPayment');



    Route::get('users_list', 'Api\UserController@getUsersList');
    Route::post('post_widget_groups', 'Api\WidgetController@postWidgetGroups');
    Route::post('post_widget_groups_delete', 'Api\WidgetController@postWidgetGroupsDelete');
    Route::post('widget/reorder', 'Api\WidgetController@reOrderWidget');
    Route::get('get_widget_groups', 'Api\WidgetController@getWidgetGroups');

    Route::get('get_single_group_data/{groupId}', 'Api\WidgetController@getSingleGroupData');

    Route::get('group-widget-display/{groupId}', 'Api\WidgetController@getGroupWidgetDisplay');

    // get lockout settings
    Route::get('lockout/settings', 'Api\CommonController@getLockoutSettings');
    Route::get('lockout/pin/verify/{pin}', 'Api\CommonController@getLockoutPin');
    Route::get('finding-lockout/pin/verify/{pin}', 'Api\CommonController@getFindingLockoutPin');

    // fees
    Route::get('fees/getall', 'Api\FeesController@getAllFeesList');
    Route::get('fees/getjoball/{jobId}', 'Api\FeesController@getJobAllFeesList');
    Route::post('fees/add', 'Api\FeesController@add');
    Route::get('fees/getsingle/{feeId}', 'Api\FeesController@getSingleFee');
    Route::get('fees/delete/{feeId}', 'Api\FeesController@deleteFee');
});


Route::group(['prefix' => 'sources', 'middleware' => 'widget'], function () {
    Route::post('/widget-data', 'Api\SourceController@getWidgetData');

    // Route::post('/inspection_scheduled','Api\SourceController@getInspectionScheduled');
    // Route::post('/inspection_performed','Api\SourceController@getInspectionPeformed');
    // Route::post('/charges','Api\SourceController@getCharges');
    // Route::post('/revenue','Api\SourceController@getRevenue');
    // Route::post('/custom','Api\SourceController@getCustom');
    // Route::post('/google_sheet/{name}/{field}','Api\GoogleSheetsController@getGoogleSheets');

});

Route::group(['prefix' => 'pdf'], function () {
    Route::post('make_job_card', 'Api\PdfController@postMakeJobCard');
});

Route::get('make_findings_contract_report_pdf', 'Api\Report\WorkContractController@index');
// Route::get('schedule/fill','Api\ScheduleController@fillData');
Route::get('schedule/search-date', 'Api\ScheduleController@searchDate');
/// public card api
