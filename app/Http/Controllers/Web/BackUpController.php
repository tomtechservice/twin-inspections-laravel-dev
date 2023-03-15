<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use ZipArchive;


class BackUpController extends Controller
{
	public function index(){
		ini_set('memory_limit','9000M');
        
        try {
            $this->takeSnapShot();
            
        } catch (ProcessFailedException $exception) {
           
        }
	}
	public function takeSnapShot(){
		set_time_limit(0);

        // define target file
        $tempLocation     = 'temp/'.env('DB_DATABASE') . '_' . date("Y-m-d_Hi") . '.sql';
        $targetFilePath   = 'backups/'. date("Y/m/d_Hi") . '.zip';
        $backup ='temp/backup.zip';

        
        // run the cli job
        $process = new Process('mysqldump -u ' .env('DB_USERNAME'). ' --password="' .env('DB_PASSWORD'). '" ' .env('DB_DATABASE'). ' > ' .$tempLocation);
        $process->run(); 
       
        try {

            if ($process->isSuccessful())
            {
                $zip = new ZipArchive; 
                if ($zip->open($backup, ZipArchive::CREATE) === TRUE) {    
                    $zip->addFile($tempLocation, env('DB_DATABASE') . '_' . date("Y-m-d_Hi") . '.sql');        
                    $zip->close();

                    $s3 = \Storage::disk('spaces');
                    $s3->put($targetFilePath, file_get_contents($backup), 'public');
                }
                echo $targetFilePath;
            }
            else {
                throw new ProcessFailedException($process);
            }

            @unlink($tempLocation);
            @unlink($backup);
        }
        catch (\Exception $e)
        {
           echo $e->getMessage();
        }
	}
}