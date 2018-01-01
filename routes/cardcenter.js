/**
 * Created by Administrator on 2018/1/1.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara, my_con_mysql_withcallback} = require('../public/javascripts/connectmysql');


router.get('/', function(req, res, next) {
    //已投放卡券信息
    let sql = 'select value,uselimit,count from cardcenter where count > 0';
    my_con_mysql_withcallback(sql,function (err,rows) {
        let data = {};
       if(err){
           data.error = -1;
           data.errmsg = err;
       }else{
           data.error = 0;
           data.data = rows;
       }
       res.send(data);
    });
});

router.post('/',function (req,res,next) {
    let {value,uselimit,count} = req.body;
    console.log(value,uselimit,count)
    let sql = 'insert into cardcenter values(null,?,?,?)';
    my_con_mysql_withpara(sql,[value,uselimit,count],function (err,rows) {
       let data = {};
       if(err){
           data.error = -1;
           data.errmsg = err;
       }else {
           data.error = 0;
       }
       res.send(data);
    });
})


module.exports = router;
