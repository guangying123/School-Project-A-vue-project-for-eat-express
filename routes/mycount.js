/**
 * Created by Administrator on 2018/1/5.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var{ my_con_mysql,my_con_mysql_withpara,my_con_mysql_withcallback} = require('../public/javascripts/connectmysql');



router.get('/', function(req, res, next) {
    let {userId} = req.query;
    // let userId = "13468971282";
    let sql = 'select mycount from usercount where userId = ?';
    let data = {};
    my_con_mysql_withpara(sql,userId,function (err,rows) {
        if(err){
            data.error = -1;
            data.errmsg = err.message;
        }else {
            data.error = 0;
            if(rows.length == 0){ // 新用户初始化账户100元
                data.data = {mycount:100};
            }else {
                data.data = rows[0];
            }
        }
        res.send(data);
    })

});

router.post('/',function (req,res,next) {
    let reqdata  = req.body;
    let {count,userID,eattype,cardId,food,value=0} = reqdata;
    //支付接口的核心函数，提交交易信息后，先去查用户的账户，当余额满足时，开启事务执行余额减花费，订单记录插入一条数据，
    // 并在订单内容表中将所有消费的食物插入其中，如果使用优惠券，
    //还需将优惠券的状态修改为已使用。
    count-=value; // 减去优惠券后的金额
    let sqlcount = 'select mycount from usercount where userId = ?';
    let data = {};
    my_con_mysql_withpara(sqlcount,userID,function (err,rows) {
        if(err){
            data.error = -1;
            data.errmsg = err.message;
            res.send(data);
        }else{
            let mycount = 0;
            let countflag = 0;
            if(rows.length == 0){
                mycount = 100;
                countflag = 1; // 1代表新注册用户
            }else{
                mycount = rows[0].mycount;
            }

            console.log('账户信息')
            console.log(rows);
            console.log('当前账户余额'+mycount);

            if(mycount<count){ // 余额不足
                data.error = -1;
                data.errmsg = '余额不足';
                res.send(data);
            }else{
                var connection = mysql.createConnection({ // 创建连接
                    host: 'localhost',
                    user: 'root',
                    database: 'eater',
                    password: '123456',
                    port: 3306
                });
                connection.beginTransaction(err1=>{ // 显示的开启数据库事务,执行账户余额的修改，以及交易记录的添加
                    if(err1){
                        data.error = -1;
                        data.errmsg = err1.message
                    }else {
                        let sql1 = countflag==1?'insert into usercount values(?,?)':'update usercount set mycount=? where userId =?;';
                        let sql1par = countflag == 1?[userID,mycount-count]:[mycount-count,userID];
                        connection.query(sql1,sql1par,function (err2,rows2) {
                          if(err2){
                              data.error = -1;
                              data.errmsg = err2.message
                              connection.rollback(()=>{
                                  throw err2;
                              })
                              res.send(data);
                          }else{

                              console.log('更新账户余额信息')
                              console.log(rows2);
                              console.log('更新时执行Sql语句'+sql1)
                              console.log('更新时的sql参数')
                              console.log(sql1par)


                              let sql2 = 'insert into orderlist values(null,?,?,now(),1,?,?)';
                              let sql2par = cardId?[userID,eattype,count,cardId]:[userID,eattype,count,'2000-01-01 00:00:00']; // 后面这个2000年为不使用卡券时的填充数据
                              console.log('carId情况');
                              console.log(sql2);
                              console.log(sql2par);
                              console.log('!!!!!');
                              connection.query(sql2,sql2par,function (err3,rows3) {
                                  if(err3){
                                      data.error = -1;
                                      data.errmsg = err3.message;
                                      connection.rollback(function () {
                                          throw err3;
                                      })
                                      res.send(data);
                                  }else{
                                      console.log('订单编号表中插入数据')
                                      console.log('订单编号表参数(用户id，外卖or食堂,花费,卡券id[utc处理后的时间])')
                                      console.log(sql2par)

                                      let sql3 = 'select max(seri_num) as serinum from orderlist;' ;//查询插入的订单编号
                                      connection.query(sql3,function (err4,rows4) {
                                        if(err4){
                                            data.error = -1;
                                            data.errmsg = err4.message;
                                            connection.rollback(()=>{
                                                throw err4;
                                            })
                                            res.send(data);
                                        }else {
                                            function  myinsertfoodcont(a,b,c) { // 订单食物内容插入表
                                                return new Promise(function (resolve,reject) {
                                                    let sql5 = 'insert into ordercont values(?,?,?)';
                                                    my_con_mysql_withpara(sql5,[a,b,c],function (err7,rows7) {
                                                        if(err7){
                                                            reject(err7)
                                                        }else{
                                                            resolve(rows7);
                                                        }
                                                    })
                                                })
                                            }
                                            console.log('订单编号最大是：')
                                            console.log(rows4);
                                            console.log(rows4[0].serinum);

                                            let myseri_num =  rows4[0].serinum;
                                            Promise.all(food.map(mval =>{
                                                return myinsertfoodcont( myseri_num,mval.foodid,mval.count);
                                            })).then(pres=>{
                                                if(cardId){
                                                    let sql8 = 'update cardreciver set cardstatus = 2 where cardId = ?'; // 将卡券的状态改为已使用
                                                    my_con_mysql_withpara(sql8,cardId,function (err8,rows8) {
                                                        if(err8){
                                                            data.error = -1;
                                                            data.errmsg = err8.message;
                                                            connection.rollback();
                                                            res.send(data);
                                                        }else {
                                                            connection.commit(merr =>{
                                                                if(merr){
                                                                    data.error = -1;
                                                                    data.errmsg = merr.message;
                                                                    connection.rollback();
                                                                }else{
                                                                    data.error = 0;
                                                                }
                                                                res.send(data);
                                                            })
                                                        }
                                                    })
                                                }else{
                                                    connection.commit(merr =>{
                                                        if(merr){
                                                            data.error = -1;
                                                            data.errmsg = merr.message;
                                                            connection.rollback();
                                                        }else{
                                                            data.error = 0;
                                                        }
                                                        res.send(data);
                                                    })
                                                }
                                            }).catch(perr=>{
                                                connection.rollback();
                                                data.error = -1;
                                                data.errmsg = perr.message;
                                                res.send(data);
                                            })
                                        }
                                      })
                                  }
                              })
                          }
                        })
                    }
                })
            }
        }
    })
})

module.exports = router;
