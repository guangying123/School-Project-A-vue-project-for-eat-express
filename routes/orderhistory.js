/**
 * Created by Administrator on 2018/1/6.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara} = require('../public/javascripts/connectmysql');


router.get('/', function(req, res, next) {
   let {userId} =  req.query;
   let sql = 'select orderlist.seri_num,orderdate,eattype,orderlist.count,flag,fdcount,price,name   from orderlist,ordercont,food where orderlist.seri_num=ordercont.seri_num and ordercont.foodid = food.id and userId = ? order by orderlist.seri_num ';
   let data = {};
   my_con_mysql_withpara(sql,userId,function (err,rows) {
        if(err){
            data.error =-1;
            data.errmsg = err.message
        }else {
            data.data = rows; // 为接口的所有数据

        }
        res.send(data);
    })
});

module.exports = router;
