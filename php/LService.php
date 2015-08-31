<?php
include_once __DIR__ . '/DBconnection.php';
include_once __DIR__ . '/register.php';
include_once __DIR__ . '/Login.php';

if (!isset($_REQUEST["params"])) {
    $response = array();
    $response["success"] = false;
    $response["errmsg"] = "请设置请求参数！";
    echo json_encode($response);
    exit(1);
}

$params = json_decode($_REQUEST["params"]);
$connection = getConnection();
if ($params->type == "register"){
    $runObj = new Register($connection, $params->user);
    $runObj->Run();
}

if ($params->type == "login"){
    $runObj = new Login($connection, $params->user);
    $runObj->Run();
}
php?>