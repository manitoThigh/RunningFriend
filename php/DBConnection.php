<?php

$HOST = "localhost";
$DBNAME = "postgres";
$USER = "postgres";
$PASSWORD = "123456";
$PORT = 5432;

function getConnection() {
    global $HOST, $PORT, $DBNAME, $USER, $PASSWORD;
    $connstr = "host={$HOST} port={$PORT} dbname={$DBNAME} user={$USER} password={$PASSWORD}";
    $conn = pg_connect($connstr);
    return $conn;
}