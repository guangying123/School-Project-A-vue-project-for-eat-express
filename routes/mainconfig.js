/**
 * Created by Administrator on 2017/12/29.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('mainconfig', { title: '商品信息配置' });

});
module.exports = router;
