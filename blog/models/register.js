/*
 * User models
 */
var mongodb = require('./db'),
    fs = require('fs'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    datajson = require('../config/data'),
    markdown = require('markdown').markdown,
    getRegister,
    postRegister,
    getArticle;

/**
 * 请求注册页面
 * @param req
 * @param res
 */
getRegister = function (req, res) {
    res.render('proscenium/register', {
        href: '',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

/**
 * 提交注册
 * @param req (Object)  请求对象
 * @param res (Object)  响应对象
 */
postRegister = function (req, res) {

    // req.body： 就是 POST 请求信息解析过后的对象
    // res.redirect： 重定向功能，实现了页面的跳转
    var user;
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body.password_repeat,
        email = req.body.email;

    console.log(req.body);

    // 检验两次输入密码是否一致
    if (password !== password_re) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/register');
    }

    // 生成密码的md5值
    var md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');

    // 检测用户名是否已经存在
    mongodb.find('user', {name : name}).then(function (result) {
        if (typeof result[0] !== 'undefined') {
            return Promise.reject({message : '用户已存在!', direct : '/register'});
        }

        user = {
            id : process.next_user_id++,
            name : name,
            password : password,
            email : email,
            avatar : datajson.default_avatar,
            signature : datajson.default_signature,
            birthday: '1900-1-1',
            pv: 0,
            createDate : new Date(),
            updateDate : new Date()
        }

        return mongodb.store('user', [user]);
    }).then(function () {
        //用户信息存入 session, 注册成功后返回主页
        req.session.user = user;
        req.flash('success', '注册成功!');
        fs.mkdirSync('./public/images/' + name);
        res.redirect('/space/' + user.name);
    }).catch(function (err) {
        console.log(err);
        var direct = err.direct ? err.direct : '/';
        req.flash('error', err.message);
        return res.redirect(direct);
    });
}

module.exports = {
    postRegister : postRegister,
    getRegister : getRegister
};