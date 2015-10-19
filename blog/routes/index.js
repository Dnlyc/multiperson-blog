//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
///*
// * 生成一个路由实例用来捕获访问主页的GET请求，
// * 导出这个路由并在app.js中通过app.use('/', routes);加载。
// * 当访问主页时，就会调用res.render('index', { title: 'Express' });
// * 渲染views/index.ejs模版并显示到浏览器中。
// */
//router.get('/', function(req, res, next) {
//  // 传入变量title，，模板引擎会将所有<% = title % >替换为变量值
//  // 然后将渲染后生成的html显示到浏览器中
//  res.render('index', { title: '主页' });
//});


var user = require('../models/user');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: '主页' });
    });

    app.get('/register', function (req, res) {
        res.render('register', { title: '注册' });
    });
    app.post('/register', user.register);

    app.get('/login', function (req, res) {
        res.render('login', { title: '登录' });
    });
    app.post('/login', function (req, res) {
    });
    app.get('/post', function (req, res) {
        res.render('post', { title: '发表' });
    });
    app.post('/post', function (req, res) {
    });
    app.get('/logout', function (req, res) {
    });
};
