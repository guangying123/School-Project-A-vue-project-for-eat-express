/**
 * Created by Administrator on 2018/1/1.
 */
var express = require('express');
var router = express.Router();


router.get('/',function (req,res,next) {
    let {userId} = req.query;
    let willsql = 'select seri,value,uselimit from cardcenter where count > 0';
    let useingsql = 'select cardId,cardseri,value,uselimit from cardreciver inner join cardcenter on cardreciver.cardseri = cardcenter.seri where ' +
        'cardreciver.userId = ? and status=?';

    Promise.all([my_con_mysql(willsql), my_con_mysql(useingsql,[userId,1]),useingsql(useingsql,[userId,2])]).then(values => {
        console.log(values)
    }).catch(err=> {
        console.log(err)
    })
    res.send(123);
})

module.exports = router;
