/*
 * Login models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    getLogin,
    postLogin;

/**
 * ����ע��ҳ��
 * @param req
 * @param res
 */
getLogin = function (req, res) {
    res.render('login', {
        title: '��¼',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
};

/**
 * �ύע������
 * @param req
 * @param res
 */
postLogin = function (req, res) {

    // ���������md5ֵ
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    mongodb.find('user', {name : req.body.name}).then(function (result) {
        var user = result[0];

        if (typeof user !== 'undefined')
            return Promise.reject({message : '�û�������!', direct : '/login'});
        else if (user.password !== password)
            return Promise.reject({message : '�������!', direct : '/login'});
        else {
            req.session.user = user;
            req.flash('success', '��½�ɹ�!');
            res.redirect('/');//��½�ɹ�����ת����ҳ
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