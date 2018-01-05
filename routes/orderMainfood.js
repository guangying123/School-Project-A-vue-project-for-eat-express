/**
 * Created by Administrator on 2018/1/4.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara,my_con_mysql_withcallback} = require('../public/javascripts/connectmysql');



router.get('/', function(req, res, next) {
    let ordersql = 'select kind ,foodid,name,price,img,des  from foodkind,food where foodkind.foodid=food.id order by kind';
    let data = {};
    my_con_mysql_withcallback(ordersql,function (err,rows) {
        if(err) {
            data.error = -1;
            data.errmsg = err.message;
        }else {
            data.error = 0;
            let tempdata = rows;
            let result = [];
            let mymap = {'rx':'热销', 'cc':'炒菜','lc':'凉菜','tl':'汤类','gjf':'盖浇饭','xc':'小吃','zs':'主食','yp':'饮品'};
            let len = tempdata.length,i=0;
            for(let i =0;i < len; ){
                let j = i+1;
                let tem = tempdata[i];
                let temarr = [];
                temarr.push(tem);
                while(j < len) {
                    if(tempdata[j].kind == tem.kind){
                        temarr.push(tempdata[j]);
                        j++;
                    }else {
                        break;
                    }
                }
                i = j;
                result.push({
                    type: mymap[tem.kind],
                    detail: temarr
                })
            }
            console.log(result);
            data.data = result;
        }
        res.send(data);
    })
});

router.post('/',function (req,res,next) {
    // post 提交flag (1删除||2增加) kind || foodid
    let {flag,kind,foodid} = req.body;
    let data= {};
    if(flag == 1) {
        let sql = 'delete from foodkind where kind=? and foodid=?'
        my_con_mysql_withpara(sql,[kind,foodid],function (err,rows) {
            if(err){
                data.error = -1;
                data.errmsg = err.message;
            }else{
                data.error = 0;
            }
            res.send(data);
        })
    }else{
        let sql ='insert into foodkind values(?,?)';
        my_con_mysql_withpara(sql,[kind,foodid],function (err,ros) {
            if(err){
                data.error = -1;
                data.errmsg = err.message;
            }else{
                data.error = 0;
            }
            res.send(data);
        })
    }
})






module.exports = router;
