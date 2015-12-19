/*
 * Login models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    postLogin;


/**
 * 登陆请求
 * @param req
 * @param res
 */
postLogin = function (req, res) {

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
        console.log(err.message);
        var direct = err.direct ? err.direct : '/';
        req.flash('error', err.message);
        return res.redirect(direct);
    })

}

function getLogin (req, res) {
    res.render('proscenium/login', {
        href : 'login',
        user : req.session.user,
        error : req.flash('error').toString(),
        con : {}
    })
}

function getAdminLogin(req, res) {
    res.render('admin/login', {
        error : req.flash('error').toString()
    })
}

function postAdminLogin(req, res) {
    return mongodb.find('systemadmin', {name : req.body.name, password: req.body.password}).then(function (results) {
        if (results.length == 0) {
            console.log({name : req.body.name, password: req.body.password});
            return Promise.reject({message : '用户名或密码错误.'});
        }
        req.session.admin = results[0];
        res.redirect('/main/index');
    }).catch(function (error) {
        req.flash('error', error.message);
        res.redirect('back');
    })
}

module.exports = {
    postLogin : postLogin,
    getLogin : getLogin,
    getAdminLogin : getAdminLogin,
    postAdminLogin : postAdminLogin
};