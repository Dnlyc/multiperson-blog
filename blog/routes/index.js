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


var user = require('../models/user'),
    login = require('../models/login'),
    post = require('../models/post'),
    logout = require('../models/logout'),
    upload = require('../models/upload'),
    mongodb = require('../models/db'),
    markdown = require('markdown').markdown;;

/**
 * 主页信息
 * @param req
 * @param res
 */
function getHomepage (req, res) {
    console.log(req.session.name);
    mongodb.find('posts', {name : req.session.name}, {time : -1}).then(function (docs) {
        // 解析markdown格式
        docs.forEach(function (doc) {
            doc.post = markdown.toHTML(doc.post);
        });
        res.render('index', {
            title : '主页',
            posts: docs,
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        })
    }).catch(function (err) {
        res.render('index', {
            title: '主页',
            user: req.session.user,
            posts: [],
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
}

/**
 * 校验是否登陆
 * @param req
 * @param res
 * @param next
 */
function checkLogin (req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录');
        req.redirect('/login');
    }
    next();
}

/**
 * 校验是否已登陆
 * @param req
 * @param res
 * @param next
 */
function checkNotLogin (req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        req.redirect('back');//返回之前的页面
    }
    next();
}


module.exports = function (app) {

    // 首页信息
    app.get('/', getHomepage);

    // 注册页面
    app.get('/register', checkNotLogin);
    app.get('/register', user.getRegister);
    app.post('/register', checkNotLogin);
    app.post('/register', user.postRegister);

    // 登陆页面
    app.get('/login', checkNotLogin);
    app.get('/login', login.getLogin);
    app.post('/login', checkNotLogin);
    app.post('/login', login.postLogin);

    // 上传页面
    app.get('/upload', checkLogin);
    app.get('/upload', upload.getUpload);
    app.post('/upload', checkLogin);
    app.post('/upload', upload.postUpload);

    // 发表页面
    app.post('/post', checkLogin);
    app.get('/post', post.getPost);
    app.post('/post', checkLogin);
    app.post('/post', post.postPost);

    // 登出页面
    app.get('/logout', checkLogin);
    app.get('/logout', logout.getLogout);
};
