<?php

include_once __DIR__ . '\server.php';

class Appointment extends server {

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
        if ($this->_request->type === "APPOINT_GETFRIEND") {
            $this->getfriend();
        } else {
            
        }
        pg_close($this->_conn);
    }

}
