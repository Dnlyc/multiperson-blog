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
    register = require('../models/register'),
    post = require('../models/post'),
    logout = require('../models/logout'),
    upload = require('../models/upload'),
    ranklist = require('../models/ranklist'),
    comment = require('../models/comments'),
    space = require('../models/space'),
    blogs = require('../models/blogs'),
    mongodb = require('../models/db'),
    albums = require('../models/albums'),
    settings = require('../models/settings'),
    markdown = require('markdown').markdown;

/**
 * 主页信息
 * @param req
 * @param res
 */
function getHomepage (req, res) {
    var error = {login : req.flash('error')[0]};
    mongodb.find('posts', {}, {time : -1}).then(function (docs) {
        // 解析markdown格式
        docs.forEach(function (doc) {
            doc.post = markdown.toHTML(doc.post);
        });
        res.render('proscenium/index', {
            title : '主页',
            href : '',
            posts: docs,
            user : req.session.user,
            success : req.flash('success').toString(),
            error : error
        })
    }).catch(function (err) {
        error.post = req.flash('error').toString();
        res.render('proscenium/index', {
            title: '主页',
            href : '',
            user: req.session.user,
            posts: [],
            success: req.flash('success').toString(),
            error : error
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
        res.redirect('/');
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
        res.redirect('back');//返回之前的页面
    }
    next();
}


module.exports = function (app) {

    // 首页信息
    app.get('/', getHomepage);
    app.post('/', checkNotLogin);
    app.post('/', login.postLogin);

    // 注册页面
    app.get('/register', register.getRegister);
    app.post('/register', register.postRegister);

    // 登出页面
    app.get('/logout', checkLogin);
    app.get('/logout', logout);

    // 排行榜页面
    app.get('/ranklist', ranklist.getRankList)


    // 精彩相册页面
    app.get('/albums', albums.getPAlbums)

    // 登陆页面
    //app.get('/login', checkNotLogin);
    //app.get('/login', login.getLogin);

    //
    //// 编辑页面
    //app.get('/edit/:name/:day/:title', checkLogin);
    //app.get('/edit/:name/:day/:title', post.getEditPost);
    //
    //// 更新文章
    //app.post('/edit/:name/:day/:title', checkLogin);
    //app.post('/edit/:name/:day/:title', post.updatePost);
    //
    //// 删除文章
    //app.get('/remove/:name/:day/:title', checkLogin);
    //app.get('/remove/:name/:day/:title', post.removePost);
    //
    //// 上传页面
    //app.get('/upload', checkLogin);
    //app.get('/upload', upload.getUpload);
    //app.post('/upload', checkLogin);
    //app.post('/upload', upload.postUpload);

    // 博客文章页面
    app.get('/space/:name/blogs', blogs.getArticles);
    app.get('/space/:name/blogs/:page', blogs.getArticles);
    app.get('/space/blog/:name/:day/:title', blogs.getArticle);
    app.post('/space/blog/:name/:day/:title', blogs.postComment);
    app.post('/space/reply', blogs.postReply);

    // 相册页面
    app.get('/space/:name/albums', albums.getAlbums);
    app.post('/space/:name/albums', albums.createAlbum);
    app.get('/space/:name/albums/:id', albums.getNewAlbums);
    app.post('/space/:name/albums/:id', albums.changeAlbums);

    // 发表文章
    app.get('/space/:name/posts', post.getPost);
    app.post('/space/:name/posts', post.postPost);
    app.post('/preview', post.postPreview);

    // 个人设置
    app.get('/space/:name/settings', settings.getSettings);
    app.post('/space/:name/settings', settings.postSettings);
    // 文章
    //app.get('/u/:name', user.getArticle);
    //app.get('/u/:name/:day/:title', user.getArticle);
    // 留言
    //app.post('/u/:name/:day/:title', comment.postComment);

    // 个人博客首页
    app.get('/space/:name', space.getSpace);
};
