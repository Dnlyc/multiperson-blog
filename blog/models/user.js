/*
 * User models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    register;

function User (user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}


/**
 * 存储用户信息
 * @param callback {Function} 回调函数
 */
User.prototype.save = function () {

    var data = {
        id : process.next_user_id++,
        name : this.name,
        password : this.password,
        email : this.email
    }

    return mongodb.store('user', [data]).then(function (res) {
        return res;
    }).catch(function (err) {
        return err;
    });
}

/**
 * 查找用户信息
 * @param name (Number) -- 用户昵称
 */
User.prototype.get = function (name) {
    return mongodb.find('user', {name : name}).then(function (res) {
        return res[0];
    }).catch(function (err) {
        return err;
    });
}

register = function (req, res) {

    // req.body： 就是 POST 请求信息解析过后的对象
    // res.redirect： 重定向功能，实现了页面的跳转

    var name = req.body.name,
        password = req.body.password,
        password_re = req.body.password_repeat;

    // 检验两次输入密码是否一致
    if (password !== password_re) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/reg');
    }

    // 生成密码的md5值
    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');

    var new_user = new User({
        name: name,
        password: password,
        email: req.body.email
    })


    // 检测用户名是否已经存在
    new_user.get(new_user.name).then(function (result) {
        if (typeof result !== 'undefined') {
            return Promise.reject({message : '用户已存在!', direct : '/register'});
        }
        return new_user.save();

    }).then(function (result) {
        console.log(result);
        //用户信息存入 session, 注册成功后返回主页
        req.session.user = result[0];
        req.flash('success', '注册成功!');
        res.redirect('/');

    }).catch(function (err) {
        console.log(err);
        var direct = err.direct ? err.direct : '/';
        req.flash('error', err.message);
        return res.redirect(direct);

    })
}

module.exports = {
    User : User,
    register : register
};