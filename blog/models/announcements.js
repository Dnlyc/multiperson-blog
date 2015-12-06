/*
 * post models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    common = require('../lib/common'),
    markdown = require('markdown').markdown,
    trimHtml = require('trim-html');

/**
 * 登陆发表页面
 * @param req
 * @param res
 */
function getAnnouncements (req, res) {
    var page = req.params.page || 1;
    var num;
    mongodb.count('announcements', {}).then(function (count) {
        num = count;
        return mongodb.find('announcements', {}, {time : -1}, 10, {skip:(page - 1) * 10});
    }).then(function (results) {
        results.forEach(function (doc) {
            doc.content = trimHtml(markdown.toHTML(doc.content), {limit: 20, preserveTags: false});
        })
        var t_res = [];
        var total = parseInt(num % 10) === 0 ? parseInt(num / 10) : parseInt(num / 10) + 1;
        for (var i = 0; i < total; i++) {
            t_res.push(i + 1);
        }
        res.render('admin/announcements',{
            announcements : results,
            page : page,
            total : t_res,
            href : 'announcements',
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });
    })
}

function getNewAnnouncements (req, res) {
    process.name = '';
    res.render('admin/announcements_new',{
        tag : 'announcements',
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    });
}


function postNewAnnouncements (req, res) {
    console.log(req.files);
    mongodb.count('announcements', {title : req.body.title}).then(function (count) {
        if (count) {
            return Promise.reject({message : '已存在该标题的公告.'});
        }
        return mongodb.store('announcements', [{
            title : req.body.title,
            content : req.body.content,
            name : req.session.admin.alias,
            time : common.getTime(),
            background : req.files.background.name
        }]);
    }).then(function () {
        res.redirect('/main/announcements');
    }).catch(function (error) {
        req.flash('error', error.message);
        res.redirect('back');
    })
}

module.exports = {
    getAnnouncements : getAnnouncements,
    getNewAnnouncements : getNewAnnouncements,
    postNewAnnouncements : postNewAnnouncements
};