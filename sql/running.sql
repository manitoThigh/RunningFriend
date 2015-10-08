drop table routeinformation;
drop table userfriend;
drop table userinformation;
drop table appointfriendState;
drop table appointmentinfo;
-- 包含用户信息的创建
create table userinformation(
    uid serial primary key,
    umail varchar(30) not null,
    uname varchar(30) not null,
    upassword varchar(40),
    verifycode varchar(10),
    hasverify boolean,
    canalterpassword boolean
);


-- 用户好友表
create table userfriend(
	id serial primary key,
	uid int,
	fid int,
	foreign key (uid) references userinformation (uid),
	foreign key (fid) references userinformation (uid)
);

-- 路线信息表
create table routeinformation(
	rid serial primary key,
	createrid int,
	frompoint geometry(Point),
	endpoint geometry(Point),
	geom geometry(MultiLineString),
	createtime timestamp default now() ,
	title varchar(50),
	note text,
	foreign key (createrid) references userinformation (uid)
);

-- 约跑信息表
create table appointmentinfo(
	aid serial primary key,
	createrid int,
	routeid int,
	appointtime timestamp,
	appointfriend text, /*[数组]*/
	foreign key (createrid) references userinformation (uid),
	foreign key(routeid) references routeinformation(rid)
);

-- 被约跑的用户表
create table appointfriendState(
	afid serial primary key,
	friendid int not null,
	appid int not null,
	state int default 0, /*0未读，1同意，2拒绝*/
	foreign key (friendid) references userinformation (uid),
	foreign key(appid) references appointmentinfo(aid)
);