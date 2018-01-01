/**
 * Created by Administrator on 2018/1/1.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara, my_con_mysql_withcallback} = require('../public/javascripts/connectmysql');


router.post('/',function (req,res,next) { // 领取卡券接口
    // let {seri,userId} = req.body|| {
    //     seri:1,
    //     userId: '13468971282'
    // };
    let seri = 1;
    let userId = '13468971282';
    let sql = 'select count from cardcenter where  seri= ?';
    //领取卡券时显示开启数据库事务
    let mybegin = 'begin;';
            let sql1 = 'update cardcenter set count = count -1  where seri = 1;';
    let sql2 =' insert into cardreciver values(1,null,"13468971282","1");';
    let sqlend = 'commit';
    let sql1par = [seri,seri,userId];
    var data = {};
    my_con_mysql_withcallback(mybegin,function (err,rows) {
        console.log(err);
        console.log("----");
        console.log(rows);
        my_con_mysql(sql1,function (err1,rows2) {
            my_con_mysql(sql2,function (err2,rows3) {
                console.log("ss");
                console.log(err2);
                console.log(rows3);
                console.log("ss");
                res.send("qweqwe");
            })
        })
    })


    // Promise.all([my_con_mysql(sql,seri)]).then(values => {
    //     console.log(values);
    //     if(values[0][0].count > 0) {
    //         my_con_mysql(sql1,function (err1,rows) {
    //             if(err1) {
    //                 data.error = -1;
    //                 data.errmsg = '卡券领取失败';
    //                 sqlend = 'rollback;';
    //                 console.log('rollback');
    //                 console.log(err1);
    //             }
    //                 my_con_mysql_withcallback(sqlend,function (err2,rows) {
    //                     if(err2) {
    //                         data.error = -1;
    //                         data.errmsg = '卡券领取失败';
    //                         console.log('cardfail')
    //                     }else{
    //                         data.error = 0;
    //                         console.log('commit')
    //                     }
    //                 })
    //         })
    //     }else {
    //         console.log(2)
    //         data.error = -1;
    //         data.errmsg = '卡券已被领完';
    //     }
    // }).catch(err=> {
    //     console.log(err);
    //     data.error = -1;
    //     data.errmsg = err;
    // })
    // res.send(data);
})


module.exports = router;
