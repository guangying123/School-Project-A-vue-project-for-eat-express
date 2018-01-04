/**
 * Created by Administrator on 2018/1/1.
 */
var express = require('express');
var router = express.Router();
var{ my_con_mysql} = require('../public/javascripts/connectmysql');



router.get('/',function (req,res,next) {
    let {userId} = req.query;
    // let userId = "13468971282";
    let willsql = 'select seri,value,uselimit from cardcenter where count > 0';
    let useingsql = 'select cardId,cardseri,value,uselimit from cardreciver inner join cardcenter on cardreciver.cardseri = cardcenter.seri where ' +
        'cardreciver.userId = ? and cardstatus=?';
    let data = {};
    Promise.all([my_con_mysql(willsql), my_con_mysql(useingsql,[userId,1]), my_con_mysql(useingsql,[userId,2])]).then(values => {
        let willcard = values[0];
        let useingcard = values[1];
        let usedcard = values[2];
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
