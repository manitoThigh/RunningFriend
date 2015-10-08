<?php
include_once __DIR__ . '\server.php';
class Login extends server{

    protected $_connection = false;
    protected $_loginInfo = false;
    protected $_request = false;
    protected $_success = false;
    protected $_message = false;
    protected $_flagStr = false;
    protected $_userName = false;
    public function __destruct() {
        parent::__destruct();
    }
    public function __construct($conn, $loginInfo) {
        parent::__construct();
        $this->_connection = $conn;
        $this->_loginInfo = $loginInfo;
        $this->_success = false;
        $this->_message =  '未知错误';
    }

    public function DetectCanLogin() {
//        1代表用户未注册
//        2代表用户未激活
        $sql = "select * from userinformation where umail ='" .
                $this->_loginInfo->useremail . "'";
        $result = pg_query($sql);
        $count = pg_num_rows($result);
        if ($count != 1) {
            $this->_success = false;
            $this->_message = '用户未注册！';
            return false;
        } else {
            $sql = "select * from userinformation where umail ='" .
                    $this->_loginInfo->useremail . "'"
                    . " and hasverify = true";
            $result = pg_query($sql);
            $count = pg_num_rows($result);
            if ($count != 1) {
                $this->_success = false;
                $this->_message = '用户账号为激活！';
                return false;
            }
            return true;
        }
    }

    public function VerifyPassWord() {
        $sql = "select * from userinformation where umail ='" .
                $this->_loginInfo->useremail . "' and upassword = '"
                . $this->_loginInfo->password . "'";
        $result = pg_query($sql);
        $count = pg_num_rows($result);
        if ($count != 1) {
            $this->_success = false;
            $this->_message = '密码错误！';
            return false;
        } else {
            $this->_success = true;
            $row = pg_fetch_row($result);
            return true;
        }
    }

    public function GetName() {
        $sql = "select uname,uid from userinformation where umail ='" .
                $this->_loginInfo->useremail."'";
        $result = pg_query($sql);
        $arr = pg_fetch_all($result);
        $_SESSION["username"]=$arr[0]['uname'];
        $_SESSION["userid"]=$arr[0]['uid'];
        $this->_userName = $_SESSION["username"];
        $this->_user= $_SESSION["userid"];
    }

    public function SetMyCookie() {
        setcookie('login', 'yes');
        setcookie('userName', $this->_userName);
    }

    public function Run() {
        $can = $this->DetectCanLogin();
        if ($can) {
            $success = $this->VerifyPassWord();
            if($success){
                $this->_message = '登录成功';
                $this->GetName();
                $this->SetMyCookie();
            }
        }
        $this->MakeResponse();
    }

    public function MakeResponse() {
        $reponse = array('success'=>  $this->_success,
                         'message'=>  $this->_message,
                         'username'=> $this->_userName,
                         'user'=>  $this->_user
                        );
        echo json_encode($reponse);
    }

}
?>

