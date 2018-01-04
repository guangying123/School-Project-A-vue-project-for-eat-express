/**
 * Created by Administrator on 2018/1/3.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara,my_con_mysql_withcallback} = require('../public/javascripts/connectmysql');


router.get('/', function(req, res, next) {
    let sql = 'select lbid,lbimg from lbimg';
    let data = {};
    my_con_mysql_withcallback(sql,function (err,rows) {
        if(err) {
            data.error = -1;
            data.errmsg = err.message;
            throw err;
        }else {
            console.log(rows);
            data.error = 0;
            data.data = rows;
        }
        res.send(data);
    })

});

router.post('/',function (req,res,next) {
    let {lbid,lbimg,flag} = req.body; // flag = 1 删除  || 2 新增
    console.log(lbid+ " " +lbimg+" " +flag)
    let data = {};
    if(flag == 1) {
        let sqldelete = 'delete from lbimg where lbid=? ';
        my_con_mysql_withpara(sqldelete,lbid,function (err,rows) {
            if(err){
                data.error = -1;
                data.errmsg = err;
            }else {
                data.error = 0;
            }
            res.send(data);
        })
    }
    if(flag == 2) {
        let sqlinsert = 'insert into lbimg values(null,?)';
        let sqlmax= 'select max(lbid) as lbid from lbimg';
        my_con_mysql_withpara(sqlinsert,lbimg,function (err,rows) {
            if(err){
                data.error = -1;
                data.errmsg = err;
                res.send(data);
            }else {
                //返回新增的轮播图的id
                my_con_mysql_withcallback(sqlmax,function (err1,rows1) {
                    if(err1){
                        data.error = -1;
                        data.errmsg = err;
                    }else {
                        data.data = rows1[0];
                    }
                    res.send(data);
                })
            }
        })
    }
})

module.exports = router;
