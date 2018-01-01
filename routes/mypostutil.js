/**
 * Created by Administrator on 2017/12/29.
 */
var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
    let myurl = req.query.myurl;
    var myreq = http.request({
        port: 3000,
        path: myurl,
        method: 'POST'
    },function (myres) {
        myres.on('data', (chunk) => {
            res.send(chunk);
        });
    });
    myreq.end();
});
module.exports = router;
