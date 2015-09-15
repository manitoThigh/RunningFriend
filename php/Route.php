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
}
