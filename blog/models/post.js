/*
 * post models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    common = require('../lib/common'),
    getPost,
    postPost;

/**
 * 登陆发表页面
 * @param req
 * @param res
 */
getPost = function (req, res) {
    res.render('post',{
        title: '发表',
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    });
}

/**
 * 发表请求
 * @param req
 * @param res
 */
postPost = function (req, res) {

    var now = common.getTime(),
        user = req.session.user;

    var post = {
        name : user.name,
        title : req.body.title,
        post : req.body.post,
        time : now
    };

    mongodb.store('posts', [post]).then(function (result) {
        req.flash('success', '发布成功!');
        res.redirect('/');//发表成功跳转到主页
    }).catch(function (err) {
        req.flash('error', err);
        return res.redirect('/');
    })

}

module.exports = {
    getPost : getPost,
    postPost : postPost
};