/*
 * Logout models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    getPost;

/**
 * 请求登出页面
 * @param req
 * @param res
 */
getPost = function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');//登出成功后跳转到主页
}

module.exports = {
    getPost : getPost
};