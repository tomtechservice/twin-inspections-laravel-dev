<?php
error_reporting(-1);


$servername = "127.0.0.1";
$username = "twininsp_develop";
$password = "kaIJ?$,tH_F&";

try {
    $conn = new PDO("mysql:host=$servername;dbname=twininsp_development_twinhouse", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully"; 
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

$stmt = $conn->query("SELECT * from `setting` limit 1");
$settings = $stmt->fetch();
echo "<pre>";
print_r($settings);
