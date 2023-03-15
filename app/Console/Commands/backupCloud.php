<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use ZipArchive;

class backupCloud extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:mysql';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // $limit = ini_get('memory_limit');
        // dd($limit);
        ini_set('memory_limit','9000M');
        
        try {
            $this->takeSnapShot();
            $this->info('The backup has been proceed successfully.');
        } catch (ProcessFailedException $exception) {
            $this->error('The backup process has been failed.');
        }
    }
    /**
     * Function takes regular backup
     * for mysql database..
     *
     */
    private function takeSnapShot()
    {
        set_time_limit(0);

        // define target file
        $tempLocation     = 'public/temp/'.env('DB_DATABASE') . '_' . date("Y-m-d_Hi") . '.sql';
        $targetFilePath   = 'backups/'. date("Y/m/d_Hi") . '.zip';
        $backup ='public/temp/backup.zip';

        
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
            $this->info($e->getMessage());
        }
    }
}
