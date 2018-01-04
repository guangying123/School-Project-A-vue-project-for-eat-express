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
            let mymap = {'rc':'热销', 'cc':'炒菜','lc':'凉菜','tl':'汤类','gjf':'盖浇饭','xc':'小吃','zs':'主食','yp':'饮品'};
            let len = tempdata.length,i=0;
            console.log(tempdata);
            console.log(len);




            while(i < len) {
                console.log('#####')
                let tem = tempdata[i];
                let temarr = [];
                return ;
                temarr.push(tem);
                for(let j =i+1;j<len;j++){
                    i = j;
                    if(tempdata[j] == tem) {
                        temarr.push(tempdata[j]);
                    }else{
                        break;
                    }
                }
                result.push({
                    type: mymap[tem.kind],
                    detail: temarr
                })
            }
            console.log(result);
            console.log(rows);
            console.log(rows);
        }
        res.send(data);
    })
});

router.post('/',function (req,res,next) {
    // 提交过来参数： type | flag
    // type表示对哪一种类型的食品做修改
    //删除某一种type的所有食品 || 删除某一种type的某一种食品 || 添加某一种type的某一种食品


})






module.exports = router;
