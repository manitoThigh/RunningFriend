<?php

require_once 'D:/ServerTool/ApacheAndPhp/apache/www/RuningFriend/phpSupport/PHPMailer-master/PHPMailerAutoload.php';

class Register {

    protected $_connection = false;
    protected $_registerInfo = false;
    protected $_request = false;
    protected $_response = false;
    protected $_success = false;
    protected $_message = false;
    protected $_flagStr = false;

    public function __construct($conn, $registerInfo) {
        $this->_connection = $conn;
        $this->_registerInfo = $registerInfo;
        $this->_success = true;
        $this->_message= "未知错误";
    }

    public function MakeRand() {
        $int1 = rand(0, 10);
        $int2 = rand(0, 10);
        $int3 = rand(0, 10);
        $int4 = rand(0, 10);
        $this->_flagStr = $int1 . $int2 . $int3 . $int4;
    }

    public function DetectMailRepeat() {
        $sql = "select * from userinformation where umail ='" . $this->_registerInfo->useremail . "'";
        $result = pg_query($sql);
        $count = pg_num_rows($result);
        if ($count != 0) {
            $this->_success = false;
            $this->_messgage = '用户已存在！';
            return false;
        } else {
            return true;
        }
    }

    public function ExecuteRegister() {
        $sql = "insert into userinformation"
                . "(umail, uname, upassword, verifycode,hasverify)"
                . "values('%s','%s','%s','%s',false)";

        $sql = sprintf($sql, $this->_registerInfo->useremail, $this->_registerInfo->username, $this->_registerInfo->password, $this->_flagStr);
        $result = pg_query($this->_connection, $sql);
        if(pg_affected_rows($result) == 0){
            $this->_success = false;
            $this->_message = '数据库插入错误！';
//            $this->_message = $sql;
            return false;
        }
        return true;
    }

    public function Run() {
        $this->MakeRand();
        $can = $this->DetectMailRepeat();
        if ($can) {
            if($this->ExecuteRegister())
            {
                $this->VerifyRegister();
            }
        }
        $this->MakeResponse();
    }

    public function VerifyRegister() {
        try {
            $mail = new PHPMailer(true);
            $mail->IsSMTP();
            $mail->CharSet = 'UTF-8'; //设置邮件的字符编码，这很重要，不然中文乱码 
            $mail->SMTPAuth = true; //开启认证 
            $mail->Port = 25;
            $mail->Host = "smtp.163.com";
            $mail->Username = "pythonstudent@163.com";
            $mail->Password = "1414984603lwk";
//            $mail->AddReplyTo("pythonstudent@163.com", "mckee"); //回复地址 
            $mail->From = "pythonstudent@163.com";
            $mail->FromName = "约跑吧官网";
            $mail->AddAddress($this->_registerInfo->useremail);
            $mail->Subject = "注册验证";
            
            $mailMd5 = md5($this->_registerInfo->useremail);
            $randCode = $this->_flagStr;
            $userName = $this->_registerInfo->username;
            
            $mail->Body = "<h1>约跑吧注册验证</h1>"
                    .$userName. " 你好！"
                    . "<br>您已经成功注册为约跑吧社区会员！<br>"
                    . "请点击以下链接激活此帐号：<br>"
                    . '<a href="http://localhost:8080/RuningFriend/php/VerifyRegister.php?'
                    . 'active ='.$mailMd5.'&code ='.$randCode
                    . '">'
                    . '<font color = red><u>点击此处验证<u></font>'
                    . '</a>';
            $mail->AltBody = "为了支持邮件显示，请选择支持html的查看器"; //当邮件不支持html时备用显示，可以省略 
            $mail->WordWrap = 80;
//$mail->AddAttachment("f:/test.png"); //可以添加附件 
            $mail->IsHTML(true);
            $mail->Send();
            $this->_success =  true;
            $this->_message = '发送邮件成功，请登录邮箱验证！';
        } catch (phpmailerException $e) {
            $this->_success =  true;
            $this->_message = '邮件验证失败！ '. $e->errorMessage();
        }
    }

    public function MakeResponse() {
        $this->_response = [];
        $this->_response['success'] = $this->_success;
        $this->_response['message'] = $this->_message;
        echo json_encode($this->_response);
    }

}
?>

