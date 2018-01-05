/**
 * Created by Administrator on 2018/1/1.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql,my_con_mysql_withpara} = require('../public/javascripts/connectmysql');


router.get('/',function (req,res,next) {
    let {userId} = req.query;
    console.log(userId);
    // let userId = "13468971282";
    let willsql = 'select seri,value,uselimit from cardcenter where count > 0';
    let useingsql = 'select cardId,cardseri,value,uselimit from cardreciver inner join cardcenter on cardreciver.cardseri = cardcenter.seri where ' +
        'cardreciver.userId = ? and cardstatus=?';
    let data = {};

    function mydeal(num){ // 时间转化函数
       num = num.map(tval =>{
            let tem = new Date(tval.cardId);
            let result =[
                [tem.getFullYear(),tem.getMonth()+1,tem.getDate()].join('-'),
                [tem.getHours(),tem.getMinutes(),tem.getSeconds()].join(':')
            ].join(" ");
            tval.cardId = result;
            return tval;
        });
        return num;
    }

    Promise.all([my_con_mysql(willsql), my_con_mysql(useingsql,[userId,1]), my_con_mysql(useingsql,[userId,2])]).then(values => {
        let willcard = values[0];
        let useingcard = mydeal(values[1]);
        let usedcard = mydeal(values[2]);
        console.log(willcard);
        console.log(useingcard);
        console.log(usedcard);


        let willcardlen = willcard.length;
        let useingcardlen = useingcard.length;
        let willresu = [];
        for(let i = 0;i < willcardlen;i++) { // 待领取卡券 = 所有库存大于零的并且不在该用户的待使用卡券中的卡券种类。
            let flag = false;
            for (let j = 0;j < useingcardlen;j++) {
                if(willcard[i].seri == useingcard[j].cardseri){
                    flag = true;
                    break;
                }
            }
            if(!flag) {
                willresu.push(willcard[i]);
            }
        }
        data.willuse = willresu.reverse();
        data.canuse = useingcard.reverse();
        data.used = usedcard.reverse();
        data.error = 0;
        res.send(data);
    }).catch(err=> {
        data.error = -1;
        data.errmsg = err;
        console.log(err);
        res.send(data);
    })
})

module.exports = router;
