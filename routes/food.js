/**
 * Created by Administrator on 2018/1/4.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara,my_con_mysql_withcallback} = require('../public/javascripts/connectmysql');


router.get('/', function(req, res, next) {
    var sql = 'select id,name,price,img,des from food';
    let data = {};
    my_con_mysql_withcallback(sql,function (err,rows) {
        if(err){
            data.error = -1;
            data.errmsg = err.message;
        }else {
            data.error = 0;
            data.data = rows;
            console.log(rows);
        }
        res.send(data);
    })
});

router.post('/',function (req,res,next) {
    // flag = 1 删除食物  flag= 2 增加食物
    // {id,name,price,img,des,type}
    let {flag,id,name,price,img,des} = req.body;
    var data = {};
    if(flag == 1) {
     var sql = 'delete from food where id = ?';
     var sqltype = 'delete from foodkind where foodid = ?';

     my_con_mysql_withpara(sqltype,id,function (err1,rows) {
         if(err1) {
             data.error = -1;
             data.errmsg = err.message;
             res.send(data);
         }else {
             my_con_mysql_withpara(sql,id,function (err,row) {
                 if(err) {
                     data.error = -1;
                     data.errmsg = err.message;
                 }else {
                     data.error = 0;
                 }
                 res.send(data);
             })
         }
     })
    }
    if(flag == 2){
        var sql = 'insert into food values(null,?,?,?,?)';
        my_con_mysql_withpara(sql,[name,price,img,des],function (err,rows) {
            if(err) {
                data.error = -1;
                data.errmsg = err.message;
                res.send(data);
            }else{
                var slqmax = 'select max(id) as id from food';
                my_con_mysql_withcallback(slqmax,function (err1,rows1) {
                    if(err1) {
                        data.error = -1;
                        data.errmsg = err1.message;
                    }else {
                        data.error = 0;
                        data.data = rows1;
                        console.log(rows1);
                    }
                    res.send(data);
                })
            }
        })

    }
})

module.exports = router;
