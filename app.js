var createError = require('http-errors');
var express = require('express');//自带body-parser
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var multer = require('multer');
var cookieSession = require('cookie-session');

var app = express();


//中间键配置
// 配置ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//配置body-parser
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//配置cookie-parser
app.use(cookieParser());
//multer配置
var storage = multer.diskStorage({
  destination: function(req,res,cb){
    if(req.url.indexOf('user') !== -1 || req.url.indexOf('reg') !== -1){
      cb(null,path.join(__dirname,'public','upload','user'));
    }else if(req.url.indexOf('banner') !== -1){
      cb(null,path.join(__dirname,'public','upload','banner'));
    }else{
      cb(null,path.join(__dirname,'public/upload/product'));
    }
  }
})

let multerObj = multer({storage:storage});//对象字面量一直的情况下可以省略只写一个比如：{storage:storage}可以省略为{storage}
app.use(multerObj.any());
let arr = [];
for(var i = 0; i < 1000; i++){
  arr.push('alex_'+Math.random());
}
app.use(cookieSession({
  name:'alex_id',
  keys:['aa','bb','cc'],
  maxAge:1000*60*60*24*15
}))

//静态资源托管配置
//__dirname魔术变量，指向当前文件的根目录
app.use(express.static(path.join(__dirname, 'public','template')));//前端静态资源托管
app.use('./admin',express.static(path.join(__dirname, 'public')));//添加别名做区分，后端静态资源托管
app.use(express.static(path.join(__dirname, 'public')));


//接口相应

//用户端，以路由的形式给接口绑定任务
app.all('/api/*',require('./routes/api/globalParams'));
app.use('/api/home',require('./routes/api/home'));
app.use('/api/user',require('./routes/api/user'));
app.use('/api/reg',require('./routes/api/reg'));
app.use('/api/logout',require('./routes/api/logout'));
app.use('/api/login',require('./routes/api/login'));
app.use('/api/follow',require('./routes/api/follow'));
app.use('/api/column',require('./routes/api/column'));
app.use('/api/banner',require('./routes/api/banner'));
//管理端



// catch 404 and forward to error handler
app.use('/',function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(req.url.indexOf('/admin') !== -1){
    res.render('error');
  }else{
    res.send({error:1,msg:"错误的接口或请求方式"});
  }
  // res.render('error');
  
});

module.exports = app;
