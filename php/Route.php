<?php

include_once __DIR__ . '\server.php';

class Route extends server {

    public function __construct() {
        parent::__construct();
    }

    public function __destruct() {
        parent::__destruct();
    }

    public function run() {
        parent::run();
        $this->_conn = getConnection();
        $_SESSION["userid"] = 1;
        $_SESSION["username"] = "a1";
        if (!$this->_conn) {
            $this->makeresponse(false, "can not connect the db sever!");
            return;
        }
        if ($this->_request->type === "ROUTE_SAVE") {
            $this->saveRoute();
        }if ($this->_request->type === "ROUTE_GETROUTE") {
            $this->getRoute();
        }if ($this->_request->type === "ROUTE_GETROUTEBYID") {
            $this->getRouteById();
        } else {
            
        }
        pg_close($this->_conn);
    }
    private function saveRoute() {
        pg_query($this->_conn, "begin");
        $sql = "insert into routeinformation (createrid,frompoint,endpoint,geom,title,note) ".
                "values($1,".
                "ST_GeomFromText($2,4326),".
                "ST_GeomFromText($3,4326),".
                "ST_GeomFromText($4,4326),".
                "$5,$6);";
        $result = pg_query_params($this->_conn, $sql, array(
            $_SESSION[userid],$this->_request->fromPoint,$this->_request->endPoint,$this->_request->geom,$this->_request->title,$this->_request->note));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        pg_free_result($result);
        $result1=pg_query_params($this->_conn,"select currval('routeinformation_rid_seq')", array());
        if (!$result1) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        if (pg_num_rows($result1) > 0){
            $row = pg_fetch_row($result1);
            $this->_response["routeId"] = $row[0];
        }
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function getRoute(){
        pg_query($this->_conn, "begin");
        $sql = "select rid,ST_AsText(frompoint),ST_AsText(endpoint),ST_AsText(geom),createtime,title,note from routeinformation where createrid=$1";
        $result = pg_query_params($this->_conn, $sql, array(
            $_SESSION[userid]
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        $route=array();
        if (pg_num_rows($result) > 0) {
            $i=0;
           while ($row = pg_fetch_row($result)) {
                $route[$i]["rid"]=$row[0];
                $route[$i]["frompoint"]=$row[1];
                $route[$i]["endpoint"]=$row[2];
                $route[$i]["geom"]=$row[3];
                $route[$i]["createtime"]=$row[4];
                $route[$i]["title"]=$row[5];
                $route[$i]["note"]=$row[6];
                $i++;
            }  
        }
        $this->_response["route"] = $route;
        pg_free_result($result);
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function getRouteById(){
        pg_query($this->_conn, "begin");
        $sql = "select rid,ST_AsText(frompoint),ST_AsText(endpoint),ST_AsText(geom),createtime,title,note from routeinformation where createrid=$1 and rid=$2";
        $result = pg_query_params($this->_conn, $sql, array(
            $_SESSION[userid],$this->_request->rid
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        $route;
        if (pg_num_rows($result) > 0) {
            $row = pg_fetch_row($result);
            $route["rid"]=$row[0];
            $route["frompoint"]=$row[1];
            $route["endpoint"]=$row[2];
            $route["geom"]=$row[3];
            $route["createtime"]=$row[4];
            $route["title"]=$row[5];
            $route["note"]=$row[6];
            $i++; 
        }
        $this->_response["route"] = $route;
        pg_free_result($result);
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
}
