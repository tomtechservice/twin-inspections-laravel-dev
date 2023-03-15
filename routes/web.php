<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/app');
});


Route::get('/login','Login\LoginController@getLogin')->name('login');
Route::post('/login','Login\LoginController@postLogin');
Route::get('/callback','Login\LoginController@callback')->name('callback');
Route::post('/login/auth-token','Login\LoginController@authToken');

Route::get('db_cloud_backup','Web\BackUpController@index');

Route::get('url/{slug}','Login\LoginController@redirectManage');
Route::get('url/{slug}/{id}','Login\LoginController@redirectManage');

Route::get('image/proxy','Web\ImageController@imageProxy');

Route::get('pdf/download','Web\ImageController@pdfDownload');

Route::get('print-pdf/field-sheet/{id}','Web\PrintController@getPrintFieldSheet');
Route::get('view-pdf/field-sheet/{id}.pdf','Web\PrintController@viewPrint');

Route::get('/admin/datasources/index','Admin\DataSourceController@index');
Route::get('/admin/datasources/add','Admin\DataSourceController@getAdd');
Route::post('/admin/datasources/add','Admin\DataSourceController@postAdd');


Route::get('/testing','Api\PdfController@getTesting');

Route::get('/goog/login','Login\GoogleController@getLogin');
Route::get('/goog/callback','Login\GoogleController@callBack');
Route::get('/goog/sheet','Login\GoogleController@getGoogleSheet');

Route::get('/testing-query','Web\ImageController@getTestingQuery');

// call weekly report command
Route::get('/weekly_report','Web\WeeklyReportController@generateWeeklyReport');
