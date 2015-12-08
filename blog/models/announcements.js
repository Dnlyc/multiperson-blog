/*
 * post models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    common = require('../lib/common'),
    markdown = require('markdown').markdown,
    trimHtml = require('trim-html');

function getNewAnnouncements (req, res) {
    process.name = '';
    res.render('admin/announcements_new',{
        href : 'announcements',
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

function getAnnouncements(req, res) {
    var selector = {};
    var page = req.params.page || 1;
    var total, admin;
    if (typeof req.body.name !== 'undefined' && req.body.name !== '') selector.name = req.body.name;
    if (typeof req.body.title !== 'undefined' && req.body.title !== '') selector.title = new RegExp(req.body.title);

    console.log(selector);

    mongodb.find('systemadmin', {}).then(function (results) {
        admin = results;
        return mongodb.count('announcements', selector)
    }).then(function (count) {
        total = count;
        return mongodb.find('announcements', selector, {time : -1}, 10, {skip:(page - 1) * 10});
    }).then(function (results) {
        results.forEach(function (doc) {
            doc.content = trimHtml(markdown.toHTML(doc.content), {limit: 20, preserveTags: false});
        });
        res.render('admin/announcements',{
            announcements : results,
            page : page,
            total : parseInt(total % 10) === 0 ? parseInt(total / 10) : parseInt(total / 10) + 1,
            href : 'announcements',
            search : req.body,
            admins : admin,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });
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