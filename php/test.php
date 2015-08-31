<?php
include_once __DIR__ . '/DBconnection.php';

$connection = getConnection();
$sql = 'select umail from userinformation where uname =\'2\'';
$result = pg_query($sql);
$arr = pg_fetch_all($result);
var_dump($arr[0]["umail"]);


