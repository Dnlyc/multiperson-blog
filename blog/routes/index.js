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
    search = require('../models/search'),
    ranklist = require('../models/ranklist'),
    comment = require('../models/comments'),
    space = require('../models/space'),
    blogs = require('../models/blogs'),
    tags = require('../models/tags'),
    mongodb = require('../models/db'),
    albums = require('../models/albums'),
    settings = require('../models/settings'),
    common = require('../lib/common'),
    trimHtml = require('trim-html'),
    markdown = require('markdown').markdown;

/**
 * 主页信息
 * @param req
 * @param res
 */
function getHomepage (req, res) {
    var count;
    var page = req.params.page || 1;
    var error = {login : req.flash('error')[0]};
    var comments;
    var bloggers;

    mongodb.count('user', {}).then(function (num) {
        var random = parseInt(Math.random() * num);
        var begin = random < 6 ? 0 : random - 6;
        return mongodb.find('user', {}, {}, 6, {skip : begin});
    }).then(function (reults) {
        bloggers = reults;
        return common.getRecentComments();
    }).then(function (results) {
        comments = results;
        return mongodb.count('posts', {});
    }).then(function (num) {
        count = num;
        return mongodb.find('posts', {}, {time : -1}, 5, {
            skip: (page - 1) * 5
        })
    }).then(function (docs) {
        // 解析markdown格式
        docs.forEach(function (doc) {
            doc.post = trimHtml(markdown.toHTML(doc.post), {limit: 100, preserveTags: false});
        });
        res.render('proscenium/index', {
            href : '',
            posts: docs,
            page : page,
            total : parseInt(count % 5) === 0 ? parseInt(count / 5) : parseInt(count / 5) + 1,
            user : req.session.user,
            comments : comments,
            bloggers : bloggers,
            con : {},
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
    app.get('/page/:page', getHomepage);
    app.post('/', checkNotLogin);
    app.post('/', login.postLogin);

    // 注册页面
    app.get('/register', register.getRegister);
    app.post('/register', register.postRegister);

    // 登出页面
    app.get('/logout', checkLogin);
    app.get('/logout', logout);

    // 登陆页面
    app.get('/login', login.getLogin);
    app.post('/login', login.postLogin);

    // 排行榜页面
    app.get('/ranklist', ranklist.getRankList)

    // 搜索
    app.get('/posts', search);
    app.post('/search', search);
    app.post('/search/:page', search);

    // 精彩相册页面
    app.get('/albums', albums.getPAlbums);
    app.get('/albums/:page', albums.getPAlbums);

    // 博客文章页面
    app.get('/space/:name/blogs', blogs.getArticles);
    app.get('/space/:name/blogs/:id/', blogs.getArticlesByTag);
    app.get('/space/:name/blogs/:id/:page', blogs.getArticlesByTag);
    app.get('/space/:name/blogs/:page', blogs.getArticles);
    app.get('/space/blog/:name/:day/:title', blogs.getArticle);
    app.post('/space/blog/:name/:day/:title', blogs.postComment);
    app.post('/space/:name/:day/:title/reply', blogs.postReply);

    // 相册页面
    app.get('/space/:name/albums', albums.getAlbumsByName);
    app.post('/space/:name/albums', albums.createAlbum);
    app.get('/space/:name/albums/:id', albums.getNewAlbums);
    app.post('/space/:name/albums/:id', albums.changeAlbums);

    // 发表文章
    app.get('/space/:name/posts', post.getPost);
    app.post('/space/:name/posts', post.postPost);
    app.get('/space/posts/:name/:day/:title/edit', post.getEditArticle);
    app.post('/space/posts/:name/:day/:title/edit', post.postEditArticle);
    app.get('/space/posts/:name/:day/:title/remove', post.removePost);
    app.post('/preview', post.postPreview);
    app.post('/space/transfer/:name/:day/:title', post.postTransferPost);

    // 标签管理
    app.get('/space/:name/tags', tags.getTags);
    app.post('/space/:name/tags', tags.postTags);
    app.post('/space/:name/tags/update', tags.updateTags);
    app.post('/space/:name/tags/remove', tags.removeTags);

    // 个人设置
    app.get('/space/:name/settings', settings.getSettings);
    app.post('/space/:name/settings', settings.postSettings);

    // 个人博客首页
    app.get('/space/:name', space.getSpace);
};
