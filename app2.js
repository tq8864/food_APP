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
let mgdb = require('./utils/mongodb');
//用户端
app.get('/api/user',(req,res,next)=>{
  // console.log('!address',req.body);
  // console.log('address',req.query);
  // console.log('files',req.files);
  // console.log('session',req.session);


  //库的操作
  mgdb({
    dbName: '1909',
    collectionName:'user',
    success:({collection,client})=>{
      collection.find({name:'alex'},{projection:{_id:0}}).toArray((err,result)=>{
          console.log('err',err);
          console.log('result',result);
          client.close();
      })
    },
    error:(error)=>{
      console.log('error',error);
    },
  })
  res.end();
})
//管理端
app.get('/admin/home',(req,res,next)=>{
  //大后端渲染方法
  //express生成器配有body-parser和ejs
  //ejs使用方法  res.render(ejs文件，{数据})  ~~    以前写法    ejs.renderFile(地址/ejs文件，{数据},(data)=>{res.send(data)})
  res.render('index',{title:'标题'});
})


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
