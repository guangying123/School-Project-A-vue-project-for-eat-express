/**
 * Created by Administrator on 2017/12/27.
 */

var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara} = require('../public/javascripts/connectmysql');


router.get('/', function(req, res, next) {  // 问候语的加载页面
    let sql = 'select greet from greet';
    let sql1 = 'select count(seri) as carcount from cardcenter where count > 0';
     var data = {};
    Promise.all([my_con_mysql(sql),my_con_mysql(sql1)]).then(values => {
        let tdata = {};
        tdata.greet  =  values[0][0].greet;
        tdata.carcount = values[1][0].carcount;
        data.error= 0;
        data.data = tdata;
        res.send(data);
    }).catch(err => {
        console.log(err);
        data.error = -1;
        data.errmsg = err;
        res.send(data);
    });
});

router.post('/',function (req,res,next) {  // 商户端的问候语配置
    let newgreet = req.body.newgreet||'人生若只如初见，如何进来转一转';
    let sql = 'update greet set greet = ? where gid=1;'
    console.log(newgreet);
    my_con_mysql_withpara(sql,newgreet,function (err,rows) {
        var data ={};
        if(err){
            throw err;
            data.error = -1;
            data.errmsg = err;
        }else {
            data.error=0;
        }
        res.send(data);
    })
})

module.exports = router;
