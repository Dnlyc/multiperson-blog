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

        if (typeof day !== 'undefined' && typeof title !== 'undefined') {
            param['time.day'] = day;
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

        // 为文章页面添加留言，转化为markdown语法
        if (limit === 1 && typeof results[0].comments !== 'undefined') {
            results[0].comments.forEach(function (comment) {
                comment.content = markdown.toHTML(comment.content);
            });
        }

        console.log(results);

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