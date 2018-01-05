var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//导入路由部分
var index = require('./routes/index');
var users = require('./routes/users');
var greet = require('./routes/greet');
var mypost = require('./routes/mypost'); // Nodejs模拟本地发起post页面
var mypostutil = require('./routes/mypostutil');
var mainconfig = require('./routes/mainconfig'); // 商户端配置页面
var cardcenter = require('./routes/cardcenter');//商户卡券投放接口
var receivecard = require('./routes/receivecard'); //领取卡券接口
var will_useing_used_card = require('./routes/will_useing_used_card');
var lunboimg = require('./routes/lunboimg'); // 轮播图
var  orderMainfood = require('./routes/orderMainfood');
var food = require('./routes/food');
var mycount = require('./routes/mycount');
var orderhistory = require('./routes/orderhistory');// 订单历史页


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 解决跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});
//路由处理在这部分


app.use('/', index);
app.use('/greet',greet);
app.use('/mypost',mypost); // Node.js模拟发起post请求页面
app.use('/mypostutil',mypostutil); // post处理的真正接口
app.use('/users', users);
app.use('/cardcenter',cardcenter); // 商户卡券投放接口
app.use('/mainconfig',mainconfig); // 商户端的配置界面
app.use('/receivecard',receivecard);// 领取卡券
app.use('/will_useing_used_card',will_useing_used_card);
app.use('/lunboimg',lunboimg);
app.use('/orderMainfood',orderMainfood);// 点餐主页面食物信息
app.use('/food',food);
app.use('/mycount',mycount);
app.use('/orderhistory',orderhistory);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
