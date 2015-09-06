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
insert into userinformation(umail,uname,upassword)
values('c','c1','123456'),('d','d2','123456');
select * from userinformation
create table userfriend(
	id serial primary key,
	uid int,
	fid int,
	foreign key (uid) references userinformation (uid),
	foreign key (fid) references userinformation (uid)
);
insert into userfriend(uid,fid)
values(1,2),(2,1);
select * from userfriend
select a.uname from userinformation a,userfriend b where b.uid=1 and b.fid=a.uid
-- 路线信息表
create table routeinformation(
	rid serial primary key,
	createrid int,
	frompoint geometry(Point),
	endpoint geometry(Point),
	geom geometry(MultiLineString),
	createtime timestamp default now() ,
	foreign key (createrid) references userinformation (uid)
);
select ST_AsText(frompoint),ST_AsText(endpoint),ST_AsText(geom) from routeinformation where rid=1
insert into routeinformation (createrid,frompoint,endpoint,geom)
values(1,ST_GeomFromText('POINT(52 24)',4326),ST_GeomFromText('POINT(53 23)',4326),ST_GeomFromText('MultiLineString((52 24,52.34 23.12,52.65 23.45,53 23))',4326))
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
select aid from appointmentinfo order by aid desc limit 1
-- 被约跑的用户表
create table appointfriendState(
	afid serial primary key,
	friendid int not null,
	appid int not null,
	state int default 0, /*0未读，1同意，2拒绝*/
	foreign key (friendid) references userinformation (uid),
	foreign key(appid) references appointmentinfo(aid)
);


