/*
 * User models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    markdown = require('markdown').markdown,
    getRegister,
    postRegister,
    getArticle;

function User (user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

/**
 * 存储用户信息
 */
User.prototype.saveMessage = function () {

    var data = {
        id : process.next_user_id++,
        name : this.name,
        password : this.password,
        email : this.email,
        createDate : new Date(),
        updateDate : new Date()
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
User.prototype.getMessage = function (name) {
    return mongodb.find('user', {name : name}).then(function (res) {
        return res[0];
    }).catch(function (err) {
        return err;
    });
}

/**
 * 请求注册页面
 * @param req
 * @param res
 */
getRegister = function (req, res) {
    res.render('register', {
        title: '注册',
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
    new_user.getMessage(new_user.name).then(function (result) {
        if (typeof result !== 'undefined') {
            return Promise.reject({message : '用户已存在!', direct : '/register'});
        }
        return new_user.saveMessage();

    }).then(function (result) {

        //用户信息存入 session, 注册成功后返回主页
        req.session.user = result[0];
        req.flash('success', '注册成功!');
        res.redirect('/');

    }).catch(function (err) {

        var direct = err.direct ? err.direct : '/';
        req.flash('error', err.message);
        return res.redirect(direct);

    })
}

/**
 * 获取用户文章
 * @param req
 * @param res
 */
getArticle = function (req, res) {

    var param = {name : req.params.name},
        limit = NaN,
        sort = {time : -1};

    // 先查找是否有该作者
    return mongodb.find('user', param).then(function (results) {
        if (results.length <= 0)
            return Promise.reject({message : '不存在该用户', direct : 'back'});

        var day = req.params.day,
            title = req.params.title;

        if (typeof param.day !== 'undefined' && typeof param.title !== 'undefined') {
            param.day = day;
            param.title = title;
            limit = 1;
        }

        // 找该作者发表的文章
        return mongodb.find('posts', param, sort, limit);
    }).then(function (results) {

        if (results.length === 0)
            return Promise.reject({message : '不存在该文章！', direct : 'back'});

        results.forEach(function (result) {
            result.post = markdown.toHTML(result.post);
        });

        return res.render(limit === 1 ? 'article' : 'user', {
            title: param.name,
            posts: results ,
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });

    }).catch(function (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    })

}


module.exports = {
    User : User,
    postRegister : postRegister,
    getRegister : getRegister,
    getArticle : getArticle
};