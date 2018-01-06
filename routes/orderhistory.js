/**
 * Created by Administrator on 2018/1/6.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara} = require('../public/javascripts/connectmysql');


router.get('/', function(req, res, next) {
   let {userId,flag,orderseri} =  req.query;// flag = 1 表示卡券历史页的请求  flag = 2表示订单详情的请求
   let sql = 'select orderlist.seri_num,orderdate,eattype,orderlist.count,flag,fdcount,price,name   from orderlist,ordercont,food where orderlist.seri_num=ordercont.seri_num and ordercont.foodid = food.id and userId = ? order by orderlist.seri_num ';
   let data = {};
   my_con_mysql_withpara(sql,userId,function (err,rows) {
        if(err){
            data.error =-1;
            data.errmsg = err.message;
            res.send(data);
        }else {
            function datehadle(d) { // 处理时间
                d = new Date(d);
                return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('/');
            }
            function  getcard(data,ordernum) { // 封装成promise形式去请求使用的优惠券 data为原来的数据，ordernum为卡券编号
                return new Promise(function (resolve,reject) {
                    function  datedeal(d) { // 时间处理函数
                        d = new Date(d);
                        return [
                            [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-'),
                            [d.getHours(),d.getMinutes(),d.getSeconds()].join(':')
                        ].join(' ');
                    }

                    let sql3 = 'select cardId from orderlist where seri_num = ?;';
                    my_con_mysql_withpara(sql3,ordernum,function (err3,rows3) {
                        if(err3){
                            reject(err3);
                        }else{
                            console.log('////')
                            console.log(rows3);
                            let mycardIdis = datedeal(rows3[0].cardId);
                            console.log(mycardIdis);
                            if(mycardIdis == '2000-1-1 0:0:0'){ // 未使用卡券
                                resolve({...data[0]});
                            }else {// 使用卡券
                                let sql4 ='select value,uselimit from cardcenter,cardreciver where cardcenter.seri = cardreciver.cardseri and  cardreciver.cardId = ?;'; // 先根据卡券id拿到卡券的种类，然后根据种类拿到卡券的面值
                                my_con_mysql_withpara(sql4,mycardIdis,function (err4,rows4) {
                                    if(err4){
                                        reject(err4);
                                    }else {
                                        console.log('卡券的页面信息')
                                        console.log(rows4);
                                        resolve({...data[0],...rows4[0]});
                                    }
                                })
                            }
                        }
                    })


                })
            }

            data.data = rows; // 为接口的所有数据
                let orderlen = rows.length;
                let orderdata = rows;
                let result = [];
                console.log(orderdata);
                for(let i =0;i<orderlen;){
                    let tem = orderdata[i];
                    let temarr = [];
                    temarr.push(tem);
                    let j = i+1;
                    while (j<orderlen){
                        if(orderdata[j].seri_num == tem.seri_num){
                            temarr.push(orderdata[j]);
                            j++;
                        }else {

                         break;
                        }
                    }
                    i = j;
                    result.push({
                        seri_num:tem['seri_num'],
                        date: datehadle(tem['orderdate']), //处理掉时间问题
                        flag: tem.flag,
                        food: temarr,
                        count:tem.count,
                        eattype:tem.eattype
                    })
                }
                console.log(result);
                if(flag == 1) {
                    data.error = 0;
                    data.data = result;
                    res.send(data);
                }else {
                    result =  result.filter(val =>{
                        return val.seri_num == orderseri;
                    });
                    console.log('flag === 2');
                    console.log(result);
                    //请求卡券
                    getcard(result,orderseri).then(values=>{
                        console.log('ppp');
                        console.log(values);
                        data.error = 0;
                        data.data = values;
                        res.send(data);
                    }).catch(err6 =>{
                        data.error = -1;
                        data.errmsg = err6.message;
                        res.send(data);
                    })
                }

        }
    })
});

module.exports = router;
