/**
 * Created by Administrator on 2018/1/1.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var{ my_con_mysql,my_con_mysql_withpara, my_con_mysql_withcallback} = require('../public/javascripts/connectmysql');


router.post('/',function (req,res,next) { // 领取卡券接口
    let {seri,userId} = req.body;
    let sql = 'select count from cardcenter where  seri= ?';
    //领取卡券时显示开启数据库事务
    let descount = 'update cardcenter set count = count -1  where seri = ?'; //库存减一
    let sqlreceive = 'insert into cardreciver values(?,null,?,"1");' // 领取记录表插入记录
    let sqlreceivepar = [seri,userId];
    var data = {};

    Promise.all([my_con_mysql(sql,seri)]).then(values => {
        if(values[0][0].count > 0) {
            var connection = mysql.createConnection({ // 创建连接
                host: 'localhost',
                user: 'root',
                database: 'eater',
                password: '123456',
                port: 3306
            });
            connection.beginTransaction(function (err) {  //显示的开启事务
              if(err) {
                  data.error = -1;
                  data.errmsg = '卡券领取失败';
                  connection.rollback(function() {
                      res.send(data);
                      throw err;
                  });
              }else {
                  connection.query(descount, seri, function (err1, rows1) {
                      if (err1) {
                          data.error = -1;
                          data.errmsg = '卡券领取失败';
                          connection.rollback(function() {
                              res.send(data);
                              throw err1;
                          });
                      }else {
                          connection.query(sqlreceive,sqlreceivepar,function (err2,rows2) {
                              if (err2) {
                                  data.error = -1;
                                  data.errmsg = '卡券领取失败';
                                  connection.rollback(function() {
                                      res.send(data);
                                      throw err2;
                                  });
                              }else {
                                  connection.commit(function (err3) { // 所有数据库操作均成功后，commit将修改持久化的数据库，保证事务的原子性
                                      if(err3) {
                                          data.error = -1;
                                          data.errmsg = '卡券领取失败';
                                          connection.rollback(function() {
                                              res.send(data);
                                              throw err3;
                                          });
                                      }else{
                                          data.error = 0;
                                          res.send(data);
                                      }
                                  })
                              }
                          })
                      }
                  })
              }
            })
        }else {
            data.error = -1;
            data.errmsg = '卡券已被领完';
            res.send(data);
        }
    }).catch(err=> {
        data.error = -1;
        data.errmsg = err;
        res.send(data);
    })
})


module.exports = router;
