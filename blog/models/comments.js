/*
 * comment models
 */
var mongodb = require('./db'),
    Promise = require('bluebird'),
    common = require('../lib/common'),
    postComment;

/**
 * 发表留言
 * @param req
 * @param res
 */
postComment = function (req, res) {
    var time = common.getTime();
    var selector = {
        name : req.params.name,
        'time.day' : req.params.day,
        title : req.params.title
    }

    var comment = {
        name: req.body.name,
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
    }

    mongodb.update('posts', selector, {$push : {"comments": comment}}).then(function (result) {

        req.flash('success', '留言成功!');
        res.redirect('back');

    }).catch(function (err) {
        req.flash('error', err);
        return res.redirect('back');
    })
}

module.exports = {
    postComment : postComment
}