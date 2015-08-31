-- 包含用户信息的创建
create table userinformation(
    umail varchar(30) primary key,
    uname varchar(30),
    upassword varchar(40),
    verifycode varchar(10),
    hasverify boolean,
    canalterpassword boolean
    )