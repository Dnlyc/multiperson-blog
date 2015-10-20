/*
 * post models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    getPost,
    postPost;

/**
 * 登陆发表页面
 * @param req
 * @param res
 */
getPost = function (req, res) {
    req.render('post',{
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

}

module.exports = {
    getPost : getPost,
    postPost : postPost
};