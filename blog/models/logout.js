/*
 * Logout models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    getPost;

/**
 * ����ǳ�ҳ��
 * @param req
 * @param res
 */
getPost = function (req, res) {
    req.session.user = null;
    req.flash('success', '�ǳ��ɹ�!');
    res.redirect('/');//�ǳ��ɹ�����ת����ҳ
}

module.exports = {
    getPost : getPost
};