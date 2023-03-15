<?php

/*
|--------------------------------------------------------------------------
| Code in bootstrap/environment.php
|--------------------------------------------------------------------------
| Detect The Application Environment
|--------------------------------------------------------------------------
|
| Dotenv package is not accessible in the file so we will use the other way around.
| Create an instance of Dotenv class which takes two parameters:
| $dotenv = new Dotenv\Dotenv(path_to_env_file, name_of_file);
|
*/


$env = $app->detectEnvironment(function() {
    $environmentPath = __DIR__.'/../.env';
    $setEnv = trim(file_get_contents($environmentPath));
    if (file_exists($environmentPath))
    {
        putenv("$setEnv");
        // echo URL::current(); exit;
        
        if(php_sapi_name() === 'cli' OR defined('STDIN')){
             
        } else {
            $domainName = $_SERVER['SERVER_NAME'];
            if($domainName == 'app.finley.inspectmite.com') {
                $dotenv = new Dotenv\Dotenv(__DIR__.'/../.', 'finley.env');
                $dotenv->load();
            } else if($domainName == 'app.napm.inspectmite.com') {
                $dotenv = new Dotenv\Dotenv(__DIR__.'/../.', 'napm.env');
                $dotenv->load();
            } else if($domainName == 'app.nahs.inspectmite.com') {
                $dotenv = new Dotenv\Dotenv(__DIR__.'/../.', 'nahs.env');
                $dotenv->load();
            } else if($domainName == 'app.ttsd.inspectmite.com') {
                $dotenv = new Dotenv\Dotenv(__DIR__.'/../.', 'ttsd.env');
                $dotenv->load();
            }
        }
       
    }
});

