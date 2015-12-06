/*
 * Logout models
 */

var mongodb = require('./db'),
    common = require('../lib/common'),
    crypto = require('crypto'),
    trimHtml = require('trim-html'),
    Promise = require('bluebird');

function searchPostsByTitle (req, res) {
    var num;
    var page = parseInt(req.params.page || 1);
    return mongodb.count('posts', req.body.content).then(function (count) {
        num = count;
        return mongodb.find('posts', req.body.content, {time:-1}, 10, {skip: (page - 1) * 10});
    }).then(function (results) {
        results.forEach(function (doc) {
            doc.post = trimHtml(markdown.toHTML(doc.post), {limit: 300, preserveTags: false});
        });
        var total = parseInt(num % 10) === 0 ? parseInt(num / 10) : parseInt(num / 10) + 1;
        var total = num % 9 == 0 ? num / 9 :parseInt(num / 9) + 1;
        var t_res = [];
        for (var i = 0; i < total; i++) {
            t_res.push(i + 1);
        }
        if (req.body.method) {
            res.json({posts : results, total : t_res, page : page});
        } else {
            req.body.content = common.isEmptyObj(req.body.content) ? req.body.content.title.toString().replace(/\//g, '') : '';
            res.render('proscenium/posts', {
                href : 'posts',
                posts: results,
                user : req.session.user,
                total : t_res,
                page : page,
                success : req.flash('success').toString(),
                con : req.body
            });
        }
    }).catch(function (err) {
        console.log(err.message);
    })
}

function searchPostsByTags (req, res) {
    var page = parseInt(req.params.page || 1);
    return mongodb.find('tags', req.body.content).then(function (results) {
        if (results.length == 0) {
            return Promise.resolve(results);
        } else {
            return Promise.all(results.map(function (tag) {
                return mongodb.find('posts', {tags:{$all:[tag.id]}})
            }))
        }
    }).then(function (results) {
        var result = [];
        results.forEach(function (rs) {
            rs.forEach(function (r) {
                result.push(r);
            })
        });
        result.sort(function (lp, rp) {
            return rp.time.data - lp.time.data;
        })
        var total = parseInt(result.length % 10) === 0 ? parseInt(result.length / 10) : parseInt(result.length / 10) + 1;
        result = result.slice((page - 1) * 10, total > page * 10 ? page * 10 : total);
        result.forEach(function (doc) {
            doc.post = trimHtml(markdown.toHTML(doc.post), {limit: 300, preserveTags: false});
        });
        var t_res = [];
        for (var i = 0; i < total; i++) {
            t_res.push(i + 1);
        }
        if (req.body.method) {
            res.json({posts : result, total : t_res, page : page});
        } else {
            req.body.content = common.isEmptyObj(req.body.content) ? req.body.content.content.toString().replace(/\//g, '') : '';
            res.render('proscenium/posts', {
                href : 'posts',
                posts: result,
                user : req.session.user,
                total : t_res,
                page : page,
                success : req.flash('success').toString(),
                con : {}
            });
        }
    })
}

function searchAlbumsByTitle (req, res) {
    console.log('albums');
    var num;
    var page = parseInt(req.params.page || 1);
    return mongodb.count('albums', req.body.content, {day:-1}).then(function (count) {
        num = count;
        return mongodb.find('albums', req.body.content, {day:-1}, 9, {skip: (page - 1) * 9});
    }).then(function (results) {
        var total = num % 9 == 0 ? num / 9 :parseInt(num / 9) + 1;
        var t_res = [];
        for (var i = 0; i < total; i++) {
            t_res.push(i + 1);
        }
        if (req.body.method) {
            res.json({albums : results, total : t_res, page : page});
        } else {
            req.body.content = common.isEmptyObj(req.body.content) ? req.body.content.title.toString().replace(/\//g, '') : '';
            res.render('proscenium/albums', {
                href : 'albums',
                albums : results,
                user : req.session.user,
                total : t_res,
                page : page,
                con : req.body
            })
        }
    })
}

module.exports =  function (req, res) {
    switch (req.body.type) {
        case '0' :
            req.body.content = req.body.content === '' || typeof req.body.content === 'undefined' ? {} : {title : new RegExp(req.body.content)};
            console.log(req.body.content);
            searchPostsByTitle(req, res);
            break;
        case '1' :
            req.body.content = req.body.content === '' || typeof req.body.content === 'undefined' ? {} : {content : new RegExp(req.body.content)};
            searchPostsByTags(req, res);
            break;
        case '2' :
            req.body.content = req.body.content === '' || typeof req.body.content === 'undefined' ? {} : {title : new RegExp(req.body.content)};
            searchAlbumsByTitle(req, res);
            break;
        default :
            req.body.content = req.body.content === '' || typeof req.body.content === 'undefined' ? {} : {title : new RegExp(req.body.content)};
            searchPostsByTitle(req, res);
            break;
    }
};