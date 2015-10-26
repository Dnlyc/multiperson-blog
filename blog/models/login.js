/*
 * Login models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    getLogin,
    postLogin;

/**
 * 返回注册页面
 * @param req
 * @param res
 */
getLogin = function (req, res) {
    res.render('login', {
        title: '登陆',
        href: 'login',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};

/**
 * 登陆请求
 * @param req
 * @param res
 */
postLogin = function (req, res) {

    console.log(req.body);

    // 生成密码的md5值ֵ
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    mongodb.find('user', {name : req.body.name}).then(function (result) {
        var user = result[0];

        if (typeof user === 'undefined')
            return Promise.reject({message : '用户不存在!', direct : '/login'});
        else if (user.password !== password)
            return Promise.reject({message : '密码不正确!', direct : '/login'});
        else {
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
        }

    }).catch(function (err) {
        var direct = err.direct ? err.direct : '/';
        req.flash('error', err.message);
        return res.redirect(direct);
    })


}

module.exports = {
    getLogin : getLogin,
    postLogin : postLogin
};