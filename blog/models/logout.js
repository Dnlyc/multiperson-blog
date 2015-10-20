/*
 * Logout models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    getLogout;

/**
 * 登出请求
 * @param req
 * @param res
 */
getLogout = function (req, res) {
    req.session.user = null;
    req.session.name = null;
    req.flash('success', '登出成功!');
    res.redirect('/');
}

module.exports = {
    getLogout : getLogout
};