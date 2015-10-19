/**
 * 启动文件，或者说是文件入口
 */

// 加载模块，以及routes文件夹下的index.js和users.js路由文件
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// 路由配置文件
var routes = require('./routes/index'),
    login = require('./routes/login'),
    logout = require('./routes/logout'),
    post = require('./routes/post'),
    register = require('./routes/register'),
    users = require('./routes/users');

// import settings module.
var settings = require('./settings'),
    mongodb = require('./models/db');

// 将会话信息存储在数据库中，该两个模块实现了将会话信息存储到mongodb中。
var session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    flash = require('connect-flash');

// 生成一个express实例app
var app = express();

mongodb.init().then(function () {

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));            // 设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方
    app.set('view engine', 'ejs');                              // 设置视图模板引擎为 ejs。
    app.use(flash());                                              // 设置flash功能

    // uncomment after placing your favicon in /public
    // 设置/public/favicon.ico为favicon图标。
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    app.use(logger('dev'));                                         // 加载日志中间件。
    app.use(bodyParser.json());                                     // 加载解析json的中间件。
    app.use(bodyParser.urlencoded({ extended: false }));          // 加载解析urlencoded请求体的中间件。
    app.use(cookieParser());                                        // 加载解析cookie的中间件。
    app.use(express.static(path.join(__dirname, 'public')));      // 设置public文件夹为存放静态文件的目录。

    // 路由控制器。
    app.use('/', routes);
    app.use('/login', login);
    app.use('/logout', logout);
    app.use('/post', post);
    app.use('/register', register);
    app.use('/users', users);

    app.use(session({
        secret : settings.cookieSecret,
        // cookie name
        key : settings.db,
        // 设定cookie的生存周期为30天
        cookie : {maxAge : 1000 * 60 * 60 * 24 * 30},
        // MongoStore 实例，把会话信息存储到数据库中
        store : new MongoStore({
            db : settings.db,
            host : settings.host,
            port : settings.port
        })
    }));

    // catch 404 and forward to error handler
    // 捕获404错误，并转发到错误处理器。
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    // development error handler
    // will print stacktrace
    // 开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    // 生产环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}).catch(function (err) {
    console.log(err.message);
    process.exit(1);
})

module.exports = app;
