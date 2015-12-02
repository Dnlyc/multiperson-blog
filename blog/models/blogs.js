var mongodb = require('../models/db'),
    data = require('../config/data'),
    common = require('../lib/common'),
    markdown = require('markdown').markdown,
    trimHtml = require('trim-html'),
    Promise = require('bluebird');


function getArticles(req, res) {
    var data = {name: req.params.name};
    var blogger = req.params.name;
    var total;
    var page = req.params.page || 1;
    var comments;
    var tags;

    common.getRecentComments(req.params.name).then(function (results) {
        comments = results;
        return mongodb.find('tags', {name: req.params.name})
    }).then(function (results) {
        tags = results;
        return mongodb.count('posts', data);
    }).then(function (count) {
        total = count;
        return mongodb.find('posts', data, {time: -1}, NaN, {
            skip: (page - 1) * 10,
            limit: 10
        });
    }).then(function (docs) {
        // 解析markdown格式
        docs.forEach(function (doc) {
            doc.post = trimHtml(markdown.toHTML(doc.post), {limit: 100, preserveTags: false});
        });
        console.log(comments);
        res.render('blog/blog', {
            blogger: blogger,
            href: 'blogs',
            posts: docs,
            tags: tags,
            page: page,
            recomments: comments,
            total: parseInt(total % 10) === 0 ? parseInt(total / 10) : parseInt(total / 10) + 1,
            user: req.session.user,
            success: req.flash('success').toString()
        })
    }).catch(function (err) {
        req.flash('error', err.message);
        return res.redirect('/');
    })
}

function getArticle(req, res) {

    var post, avatar, signature;
    var blogger = req.params.name;
    var comments;
    var recomments;

    // 先查找是否有该作者
    return mongodb.find('user', {name: req.params.name}).then(function (results) {
        if (results.length <= 0)
            return Promise.reject({message: '不存在该用户', direct: 'back'});

        avatar = results[0].avatar;
        signature = results[0].signature;
        console.log(avatar);
        var param = {
                name: req.params.name,
                'time.day': req.params.day,
                title: req.params.title
            },
            limit = 1,
            sort = {time: -1};

        // 找该作者发表的文章
        return mongodb.find('posts', param, sort, limit);
    }).then(function (results) {
        if (results.length === 0)
            return Promise.reject({message: '不存在该文章！', direct: 'back'});

        post = results[0];
        post.post = markdown.toHTML(post.post);
        post.avatar = avatar;
        post.signature = signature;

        var selector = {
            name: req.params.name,
            'time.day': req.params.day,
            title: req.params.title
        }

        return mongodb.find('comments', selector);
    }).then(function (results) {
        if (typeof results !== 'undefined') {
            var maps = results.map(function (result) {
                var sel = {c_id: result.id};
                return mongodb.find('replys', sel).then(function (replys) {
                    if (typeof replys !== 'undefined') {
                        result.replys = replys;
                    }
                    return result;
                });
            });
            return Promise.all(maps);
        } else {
            return Promise.resolve([]);
        }
    }).then(function (results) {
        comments = results;
        if (typeof post.tags !== 'undefined') {
            var maps = post.tags.map(function (result) {
                return mongodb.find('tags', {id: result}).then(function (tag) {
                    return tag[0];
                });
            });
            return Promise.all(maps);
        } else {
            return Promise.resolve([]);
        }
    }).then(function (results) {
        post.tags = results;
        return common.getRecentComments(req.params.name);
    }).then(function (results) {
        recomments = results;
        return mongodb.find('tags', {name: req.params.name});
    }).then(function (results) {
        return res.render('blog/article', {
            blogger: blogger,
            href: 'blogs',
            post: post,
            comments: comments,
            recomments: recomments,
            tags: results,
            user: req.session.user,
            success: req.flash('success').toString()
        });
    }).catch(function (err) {
        console.log(err);
        req.flash('error', err.message);
        return res.redirect('back');
    })
}

/**
 * 发表评论
 * @param req
 * @param res
 */
function postComment(req, res) {

    var id = 0;
    var time = common.getTime();
    var selector = {
        name: req.params.name,
        'time.day': req.params.day,
        title: req.params.title
    }

    var comment = {
        name: req.params.name,
        time: req.params.day,
        title: req.params.title,
        c_name: req.session.user.name,
        time: time,
        content: req.body.content
    }

    mongodb.find('user', {name : req.session.user.name}).then(function (users) {
        comment.c_avatar = users[0].avatar;
        return mongodb.find('comments', selector);
    }).then(function (result) {
        typeof result !== 'undefined' ? comment.id = result.length : comment.id = 0;
        return mongodb.store('comments', [comment]);
    }).then(function (result) {
        req.flash('success', '留言成功!');
        res.redirect('back');
    }).catch(function (err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    });
}

function postReply(req, res) {
    var time = common.getTime();
    var reply = {
        c_id: parseInt(req.body.id),
        content: req.body.content,
        r_name: req.session.user.name,
        time: time
    }
    console.log(reply);
    mongodb.find('user', {name : req.session.user.name}).then(function (users) {
        reply.r_avatar = users[0].avatar;
        return mongodb.store('replys', [reply]);
    }).then(function (result) {
        req.flash('success', '留言成功!');
        res.redirect('back');
    }).catch(function (err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    });
}

module.exports = {
    getArticles: getArticles,
    getArticle: getArticle,
    postComment: postComment,
    postReply: postReply
};