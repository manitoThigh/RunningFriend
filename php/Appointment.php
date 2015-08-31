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
        $_SESSION["userid"]=1;
        $_SESSION["username"]="a1";
        if (!$this->_conn) {
            $this->makeresponse(false, "can not connect the db sever!");
            return;
        }
        if($this->_request->type === "APPOINT_GETFRIEND"){
            $this->getfriend();
        }
        if($this->_request->type === "APPOINT_GETROUTE"){
            $this->getroute();
        }
        if($this->_request->type === "APPOINT_GETROUTEGEOM"){
            $this->getroutegeom();
        }
        if($this->_request->type === "APPOINT_SUMMITAPPOINT"){
            $this->summitappoint();
        }
        if($this->_request->type === "APPOINT_INVITEINFO"){
            $this->inviteinfo();
        }
        if($this->_request->type === "APPOINT_INVITESTATE"){
            $this->setinvitestate();
        }
        if($this->_request->type === "APPOINT_ATTENDINFO"){
            $this->attendinfo();
        }
        if($this->_request->type === "APPOINT_ORIGINATEINFO"){
            $this->originateinfo();
        }
        else {
            
        }
        pg_close($this->_conn);
    }
    private function getfriend() {
        pg_query($this->_conn, "begin");
        $sql = "select a.uname ,a.uid from userinformation a,userfriend b where b.uid=$1 and b.fid=a.uid";
        $result = pg_query_params($this->_conn, $sql, array(
            $_SESSION[userid]
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        if (pg_num_rows($result) > 0) {
            $friend=array();
            $i=0;
           while ($row = pg_fetch_row($result)) {
                $friend[$i]["name"]=$row[0];
                $friend[$i]["id"]=$row[1];
                $i++;
            }
            $this->_response["friend"] = $friend;
            $this->_response["datalength"] = "1";
        } else {
            $this->_response["datalength"] = "0";
        }
        pg_free_result($result);
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
     private function getroute() {
        pg_query($this->_conn, "begin");
        $sql = "select rid,createtime from routeinformation where createrid=$1";
        $result = pg_query_params($this->_conn, $sql, array(
            $_SESSION[userid]
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        if (pg_num_rows($result) > 0) {
            $route=array();
            $i=0;
           while ($row = pg_fetch_row($result)) {
                $route[$i]["time"]=$row[1];
                $route[$i]["id"]=$row[0];
                $i++;
            }
            $this->_response["route"] = $route;
            $this->_response["datalength"] = "1";
        } else {
            $this->_response["datalength"] = "0";
        }
        pg_free_result($result);
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function getroutegeom() {
        pg_query($this->_conn, "begin");
        $sql = "select ST_AsText(frompoint),ST_AsText(endpoint),ST_AsText(geom), ST_AsText(ST_Centroid(geom)) from routeinformation where rid=$1";
        $result = pg_query_params($this->_conn, $sql, array(
        $this->_request->rid
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        if (pg_num_rows($result) > 0) {
            $row = pg_fetch_row($result);
            $this->_response["frompoint"] = $row[0];
            $this->_response["endpoint"]=$row[1];
            $this->_response["geom"]=$row[2];
            $this->_response["centerpoint"]=$row[3];
            $this->_response["datalength"] = "1";
        } else {
            $this->_response["datalength"] = "0";
        }
        pg_free_result($result);
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function  summitappoint(){
        pg_query($this->_conn, "begin");
        $friendstring="";
        $rid;
        $aid;
        for($i=0;$i<count($this->_request->friend);$i++){
            $friendstring=$friendstring.$this->_request->friend[$i]." ";
        }
        if($this->_request->rtype=="draw"){
            
        }
        else{
            $rid=  $this->_request->rid;
        }
        $sql ="insert into appointmentinfo(createrid,routeid,appointtime,appointfriend)".
              "values($1,$2,$3,$4)";
              
        $result = pg_query_params($this->_conn, $sql, array(
            $_SESSION[userid],  $rid,  $this->_request->time,  $friendstring
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        pg_free_result($result);
        $sqlid="select aid from appointmentinfo order by aid desc limit 1";
        $resultid = pg_query_params($this->_conn, $sqlid, array(
        ));
        if (!$resultid) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        if (pg_num_rows($resultid) > 0) {
            $row = pg_fetch_row($resultid);
            $aid=$row[0];
        }        
        pg_free_result($resultid);
        for($i=0;$i<count($this->_request->friend);$i++){
            $sql1 ="insert into appointfriendState(friendid,appid)".
              "values($1,$2)";
            $result1 = pg_query_params($this->_conn, $sql1, array(
                $this->_request->friend[$i],$aid
            ));
            if (!$result1) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
            }
            pg_free_result($result1);
        }
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function inviteinfo(){
        pg_query($this->_conn, "begin");
        $sql = "select a.aid,d.uname,a.routeid,a.appointtime  ".
                "from appointmentinfo a,appointfriendState c ,userinformation d ".
                "where c.friendid=$1 and c.state=0 and c.appid=a.aid and a.createrid=d.uid";
        $result = pg_query_params($this->_conn, $sql, array(
        $_SESSION[userid]
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        $data=  array();
        $i=0;
        if (pg_num_rows($result) > 0) {
            while($row = pg_fetch_row($result)){
                $data[$i]['id']=$row[0];
                $data[$i]['creater']=$row[1];
                $data[$i]['routeid']=$row[2];
                $data[$i]['time']=$row[3];
                $data[$i]['friend']=array();
                $sql1 = "select b.uname ,a.state from appointfriendState a,userinformation b ".
                        "where a.friendid=b.uid and b.uid in (select friendid from appointfriendState where appid=$1 and state=0 or state=1 )";
                $result1 = pg_query_params($this->_conn, $sql1, array(
                $row[0]
                ));
                if (!$result1) {
                $this->makeresponse(false, pg_last_notice($this->_conn));
                return;
                }
                if (pg_num_rows($result1) > 0){
                    $j=0;
                    while($row1 = pg_fetch_row($result1)){
                        $data[$i]['friend'][$j]['name']=$row1[0];
                        $data[$i]['friend'][$j]['state']=$row1[1];
                        $j++;
                    }
                }
                pg_free_result($result1);
                $i++;
            }
            
            $this->_response["datalength"] = "1";
        } else {
            $this->_response["datalength"] = "0";
        }
        pg_free_result($result);
        $this->_response['data']=$data;
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function setinvitestate(){
         pg_query($this->_conn, "begin");
        $sql =" update appointfriendState ".
                "set state=$3 ".
                "where appid=$1 and friendid=$2";
        $result = pg_query_params($this->_conn, $sql, array(
        $this->_request->id ,$_SESSION[userid],  $this->_request->state
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        pg_free_result($result);
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function attendinfo(){
        pg_query($this->_conn, "begin");
        $sql = "select a.aid,d.uname,a.routeid,a.appointtime   ".
                "from appointmentinfo a,appointfriendState c ,userinformation d ".
                "where c.friendid=$1 and c.state=1 and c.appid=a.aid  and a.createrid=d.uid and appointtime>now()";
        $result = pg_query_params($this->_conn, $sql, array(
        $_SESSION[userid]
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        $data=  array();
        $i=0;
        if (pg_num_rows($result) > 0) {
            while($row = pg_fetch_row($result)){
                $data[$i]['id']=$row[0];
                $data[$i]['creater']=$row[1];
                $data[$i]['routeid']=$row[2];
                $data[$i]['time']=$row[3];
                $data[$i]['friend']=array();
                $sql1 = "select b.uname ,a.state from appointfriendState a,userinformation b ".
                        "where a.friendid=b.uid and b.uid in (select friendid from appointfriendState where appid=$1 and state=0 or state=1 )";
                $result1 = pg_query_params($this->_conn, $sql1, array(
                $row[0]
                ));
                if (!$result1) {
                $this->makeresponse(false, pg_last_notice($this->_conn));
                return;
                }
                if (pg_num_rows($result1) > 0){
                    $j=0;
                    while($row1 = pg_fetch_row($result1)){
                        $data[$i]['friend'][$j]['name']=$row1[0];
                        $data[$i]['friend'][$j]['state']=$row1[1];
                        $j++;
                    }
                }
                pg_free_result($result1);
                $i++;
            }
            
            $this->_response["datalength"] = "1";
        } else {
            $this->_response["datalength"] = "0";
        }
        pg_free_result($result);
        $this->_response['data']=$data;
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
    private function originateinfo(){
        pg_query($this->_conn, "begin");
        $sql = "select * from appointmentinfo where createrid=$1";
        $result = pg_query_params($this->_conn, $sql, array(
        $_SESSION[userid]
        ));
        if (!$result) {
            $this->makeresponse(false, pg_last_notice($this->_conn));
            return;
        }
        $data=  array();
        $i=0;
        if (pg_num_rows($result) > 0) {
            while($row = pg_fetch_row($result)){
                $data[$i]['id']=$row[0];
                $data[$i]['routeid']=$row[2];
                $data[$i]['time']=$row[3];
                $data[$i]['friend']=array();
                $sql1 = "select b.uname ,a.state from appointfriendState a,userinformation b ".
                        "where a.friendid=b.uid and b.uid in (select friendid from appointfriendState where appid=$1)";
                $result1 = pg_query_params($this->_conn, $sql1, array(
                    $row[0]
                ));
                if (!$result1) {
                $this->makeresponse(false, pg_last_notice($this->_conn));
                return;
                }
                if (pg_num_rows($result1) > 0){
                    $j=0;
                    while($row1 = pg_fetch_row($result1)){
                        $data[$i]['friend'][$j]['name']=$row1[0];
                        $data[$i]['friend'][$j]['state']=$row1[1];
                        $j++;
                    }
                }
                pg_free_result($result1);
                $i++;
            }
            
            $this->_response["datalength"] = "1";
        } else {
            $this->_response["datalength"] = "0";
        }
        pg_free_result($result);
        $this->_response['data']=$data;
        $this->makeresponse(true, "ok");
        pg_query($this->_conn, "end");
    }
}

