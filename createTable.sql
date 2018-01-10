create database eater;
use eater; 

-- 创建问候表 greet 
--  字段great 不超过200字

create table greet (
  gid int primary key,
  greet varchar(255)
);
insert into greet values(1,'人生若之如初见，何不进来转一转'); -- 初始化插入问候语



-- 创建卡券投放类型表 
-- 字段 seri value uselimit count  对应说明为(seri 自增，卡券的种类， value为卡券的面值, uselimit为卡券使用的限制，即满limit元可使用 count为卡券的库存)
create table cardcenter(
	seri int auto_increment primary key,
    value int ,
    uselimit int,
    count int
);



select cardId,cardseri,value,uselimit from cardreciver inner join cardcenter on cardreciver.cardseri = cardcenter.seri where cardreciver.userId = '13468971283' and cardstatus='1';

-- 插入几个初始的卡券
insert into cardcenter values(
	null,2,5,0
);

insert into cardcenter values(
	null,5,10,10
);

insert into cardcenter values(
	null,10,50,20
);
select * from cardcenter;
select * from cardreciver
select value,uselimit from cardcenter,cardreciver where cardcenter.seri = cardreciver.cardseri and  cardreciver.cardId = '2018-1-6 13:25:42';
-- 创建卡券领取表 cardreciver
-- 字段  cardseri,cardId,userId,cardstatus(1代表未使用，2代表使用)
create table cardreciver(
cardseri int references cardcenter(seri),
cardId  timestamp not null unique, -- 此处每当记录修改后时间戳会自动更新
userId char(11) not null ,
cardstatus enum('1','2') not null
)
;
update cardreciver set cardstatus = 2 where cardId = ?;

alter table cardreciver modify cardId timestamp  default CURRENT_TIMESTAMP; -- 解决cardId自动更新问题

insert into cardreciver values(1,null,13468971282,"1");

select * from cardreciver;

-- 创建点餐页轮播图表
create table lbimg(
	lbid int auto_increment primary key,
    lbimg varchar(255) not null
);
select * from lbimg;
-- 插入初始的几条轮播图
insert into lbimg values(null,'http://static.ledouya.com/FsA82SGG-lCtTQKIwrveCBa2iZHk?imageMogr2/auto-orien');
insert into lbimg values(null,'http://static.ledouya.com/FoP2m8vO2A3ipCahNQv1wpdbj1qP?imageMogr2/auto-orient');
insert into lbimg values(null,'http://static.ledouya.com/FsA82SGG-lCtTQKIwrveCBa2iZHk?imageMogr2/auto-orien');

-- 创建食物表 
create table food(
	id int auto_increment primary key,
    name varchar(255) not null,
    price int not null,
    img varchar(255) not null,
    des varchar(255) not null 
);

select * from food;
insert into food values(null,'水煮肉片',23,'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515048445272&di=0ebb4c716b9603554571ff05b1a8b94e&imgtype=0&src=http%3A%2F%2Fimg5.cache.netease.com%2Fedu%2F2011%2F9%2F7%2F201109071535399065a.jpg','让你找到家的味道~~');
insert into food values(null,'椒盐蘑菇1',13,'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515048557076&di=46028bfd86ffe65ad2ae9125a6139ee8&imgtype=0&src=http%3A%2F%2Fpic39.nipic.com%2F20140327%2F208420_121222191000_2.jpg','最美的相见在这里');


-- 创建食物所属类型表
-- 默认初始化了八种类型(热销: rx,炒菜：cc,凉菜: lc,汤类: tl,盖浇饭：gjf,小吃：xc,主食：zs,饮品：yp)
-- 上述八种类型均为默认初始化的插入的，商户可在配置页面自行配制和修改  
drop table foodkind;
create table foodkind(
	kind varchar(255) ,
    foodid int references food(id)
);

select * from foodkind;
insert into foodkind values('rx',9);
insert into foodkind values('rx',10);
insert into foodkind values('cc',11);


select kind ,foodid,name,price,img,des  from foodkind,food where foodkind.foodid=food.id order by kind;

-- 创建订单交易表
create table orderlist(
	seri_num int auto_increment primary key,
    userId char(11) not null,
    eattype enum('1','2') not null, -- 1代表食堂就餐 2代表外卖
    orderdate date not null,
    flag enum('1','2') not null, -- 1代表制作中，2代表已完成
    count int not null, -- 花费
    cardId timestamp references cardreciver(cardId)
);


select orderlist.seri_num,orderdate,flag,fdcount,price,name   from orderlist,ordercont,food where orderlist.seri_num=ordercont.seri_num and ordercont.foodid = food.id and userId = '13468971283' limit 3;




alter table orderlist modify cardId timestamp  default CURRENT_TIMESTAMP;


insert into orderlist values(null,"13468971282",'1',now(),'1',40,'2018-1-1 22:44:56');
select *from orderlist;
select * from cardreciver;

-- 创建订单内容表
create table ordercont(
	seri_num int references orderlist(seri_num),
    foodid int references food(id),
    fdcount int not null
);
select * from ordercont;
drop table ordercont;

select *from usercount;
select * from ordercont;
select * from orderlist;


select*from cardreciver;
select* from cardcenter;

--  usercount  ordercont  orderlist
truncate table ordercont ; -- 清空某张表
truncate table usercount ; 
truncate table orderlist ; 

-- 创建用户以及账户表 
create table usercount(
	userId char(11) not null,
    mycount int not null
);
set SQL_SAFE_UPDATES = 0;
update usercount set mycount = 1000 where userId='18629405832';
select * from usercount;
insert into usercount values("13468971282",0);
select mycount from usercount where userId = "13468971282";






