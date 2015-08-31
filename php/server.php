<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of server
 *
 * @author lenovo
 */
include_once __DIR__.'/DBConnection.php';
session_start();
class server {
    //put your code here
    protected $_conn=false;
    protected $_request=false;
    protected $_response=false;
    public function __construct() {
        $this->_response=array();
        $this->_response["success"]=false;
        $this->_response["errmsg"]="errorr in server construct";
    }
    public function __destruct() {
    }
    public function getResponse(){
        return $this->_response;
    }
    public function setRequest($params){
        $this->_request=$params;      
    }
    public function run(){
        
    }
    protected function makeresponse($succ,$msg){
        $this->_response["success"]=$succ;
        $this->_response["errmsg"]=$msg;
    }
}
