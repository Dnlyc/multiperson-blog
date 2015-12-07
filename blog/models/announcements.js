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

function getEditAnnouncements(req, res) {
    mongodb.find('announcements', {title : req.params.title}).then(function (results) {
        if (results.length === 0) {
            return Promise.reject({message : '不存在该公告'});
        }
        res.render('admin/announcements_edit',{
            announcement : results[0],
            href : 'announcements',
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });
    }).catch(function (error) {
        console.log(error.message);
        req.flash('error', error.message);
        res.redirect('back');
    })
}

function postEditAnnouncements(req, res) {
    console.log(123123123);
    var doc = {
        content : req.body.content
    }
    if (typeof req.files.background !== 'undefined')
        doc.background = req.files.background.name;
    console.log(doc);
    return mongodb.update('announcements', {title : req.params.title}, {$set:doc}).then(function () {
        res.redirect('/main/announcements');
    }).catch(function (error) {
        console.log(error.message);
        req.flash('error', error.message);
        res.redirect('back');
    });
}

function postPreviewAnnouncements(req, res) {
    if (typeof req.body.content !== 'undefined') {
        console.log(req.body.content);
        console.log(markdown.toHTML(req.body.content));
        res.json({success : 1, html : markdown.toHTML(req.body.content)});
        return;
    }
    mongodb.find('announcements', {title : req.params.title}).then(function (results) {
        res.json({success : 1, html : markdown.toHTML(results[0].content)});
    })
}

function removeAnnouncements(req, res) {
    mongodb.remove('announcements', {title : req.params.title}).then(function (results) {
        res.redirect('back')
    })
}

module.exports = {
    getAnnouncements : getAnnouncements,
    getNewAnnouncements : getNewAnnouncements,
    postNewAnnouncements : postNewAnnouncements,
    getEditAnnouncements : getEditAnnouncements,
    postEditAnnouncements : postEditAnnouncements,
    postPreviewAnnouncements : postPreviewAnnouncements,
    removeAnnouncements : removeAnnouncements
};