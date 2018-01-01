/**
 * Created by Administrator on 2017/12/29.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('mypost', { title: 'mypost' });
});

module.exports = router;
