<?php

include_once __DIR__ . '/DBconnection.php';
include_once __DIR__ . '/register.php';
include_once __DIR__ . '/Login.php';
include_once __DIR__ . '/server.php';
include_once __DIR__ . '/Appointment.php';
include_once __DIR__ . '/Route.php';

if (!isset($_REQUEST["params"])) {
    $response = array();
    $response["success"] = false;
    $response["errmsg"] = "请设置请求参数！";
    echo json_encode($response);
    exit(1);
}

$params = json_decode($_REQUEST["params"]);
$typearr = split("_", $params->type);
$connection = getConnection();
$sv = new server();
if ($params->type == "register") {
    $runObj = new Register($connection, $params->user);
    $runObj->Run();
}

if ($params->type == "login") {
    $runObj = new Login($connection, $params->user);
    $runObj->Run();
}

if ($typearr[0] === "APPOINT") {
    $sv = new Appointment();
    $sv->setRequest($params);
    $sv->run();
    echo json_encode($sv->getResponse());
}
if ($typearr[0] === "ROUTE") {
    $sv = new Route();
    $sv->setRequest($params);
    $sv->run();
    echo json_encode($sv->getResponse());
} else {
    $response = array();
    $response["success"] = false;
    $response["errmsg"] = "error in sv";
    echo json_encode($response);
    exit(1);
}
