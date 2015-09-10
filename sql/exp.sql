//添加用户信息
insert into userinformation(umail,uname,upassword,hasverify)
values('632932020@qq.com','aaa','123456',true),('632932021@qq.com','bbb','123456',true);

//好友表
insert into userfriend(uid,fid)
values(1,2),(2,1),(1,3),(3,1),(2,3),(3,2);
