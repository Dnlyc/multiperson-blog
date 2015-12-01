/*
 * post models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    common = require('../lib/common'),
    trimHtml = require('trim-html'),
    getPost,
    postPost,
    getEditPost,
    updatePost,
    removePost;

/**
 * 登陆发表页面
 * @param req
 * @param res
 */
getPost = function (req, res) {
    mongodb.find('tags', {name : req.params.name}).then(function (result) {
        res.render('blog/post',{
            blogger: req.params.name,
            title: '发表',
            href: 'posts',
            user : req.session.user,
            post : {},
            tags : result,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });
    })
}


function postPreview(req, res) {
    var html = trimHtml(markdown.toHTML(req.body.content));
    console.log(html);
    res.json({success : 1, html : html});
}

function getEditArticle (req, res) {
    var post;
    var selector = {
        name : req.params.name,
        title : req.params.title,
        'time.day' : req.params.time
    }

    return mongodb.find('user', {name: req.params.name}).then(function (results) {
        if (results.length <= 0)
            return Promise.reject({message: '不存在该用户', direct: 'back'});

        return mongodb.find('posts', selector)
    }).then(function (results) {
        console.log(results);
        if (results.length <= 0)
            return Promise.reject({message: '不存在该文章', direct: 'back'});
        post = results[0];

        if (typeof post.tags !== 'undefined') {
            var t_result = post.tags.map(function (tag) {
                return mongodb.find('tags', {id : tag}).then(function (results) {
                    return results[0];
                })
            });
            return Promise.all(t_result);
        } else {
            return Promise.resolve([]);
        }
    }).then(function (result) {
        post.tags = result;
        return mongodb.find('tags', {name : req.params.name});
    }).then(function (result) {
        res.render('blog/post', {
            blogger: req.params.name,
            href: 'blogs',
            post: post,
            tags: result,
            user: req.session.user,
            success: req.flash('success').toString()
        });
    }).catch(function (err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    })
}

function postEditArticle (req, res) {
    var selector = {
        name : req.params.name,
        title : req.params.title,
        'time.day' : req.params.day
    }

    console.log(typeof req.body.tag);

    var tags;
    if (typeof req.body.tag === 'undefined') {
        tags = [];
    } else if (req.body.tag.length === 1) {
        tags = [parseInt(req.body.tag)]
    } else {
        tags = req.body.tag.map(function (tag) {
            return parseInt(tag);
        });
    }

    var doc = {
        tags : tags,
        post : req.body.post,
        time : common.getTime()
    }

    return mongodb.update('posts', selector, {$set : doc}).then(function (result) {
        res.redirect('/space/' + req.params.name + '/blogs');
    }).catch(function (err) {
        console.log(err);
        res.redirect('back')
    })
}

/**
 * 发表请求
 * @param req
 * @param res
 */
postPost = function (req, res) {

    var now = common.getTime(),
        user = req.session.user;

    req.body.tags =  req.body.tags || [];
    var tags = req.body.tags.map(function (tag) {return parseInt(tag)});

    var post = {
        name : user.name,
        title : req.body.title,
        post : req.body.post,
        tags : tags,
        time : now
    };

    mongodb.store('posts', [post]).then(function (result) {
        req.flash('success', '发布成功!');
        res.redirect('/space/' + user.name + '/blogs'); //发表成功跳转到主页
    }).catch(function (err) {
        req.flash('error', err);
        return res.redirect('back');
    })

}

/**
 * 获取编辑文章页面
 * @param req
 * @param res
 */
getEditPost = function (req, res) {
    var selector = {
        name : req.body.name,
        day : req.body.day,
        title : req.body.title
    }

    mongodb.find('posts', selector).then(function (results) {
        if(results.length === 0)
            return Promise.reject({message : '不存在该文章'})

        res.render('edit', {
            title: '编辑',
            post: results[0],
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    }).catch(function (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    })
}

/**
 * 更新文章
 * @param req
 * @param res
 */
updatePost = function (req, res) {

    var selector = {
        name: req.params.name,
        'time.day': req.params.day,
        title:  req.params.title
    }

    var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);

    mongodb.update('posts', selector, {$set : {post : req.body.post}}).then(function (results) {
        req.flash('success', '修改成功!');
        res.redirect(url);//成功！返回文章页
    }).catch(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect(url);//出错！返回文章页
        }
    })
}

/**
 * 删除文章
 * @param req
 * @param res
 */
removePost = function (req, res) {
    var comments;
    mongodb.find('comments', {title : req.params.title}).then(function (results) {
        console.log('find comments : ', results);
        if (results.length === 0) {
            return Promise.resolve();
        } else {
            var r = results.map(function (result) {
                return mongodb.remove('replys', {c_id : result.id});
            })

            return Promise.all(r);
        }
    }).then(function (result) {
        console.log('remove replies : ', result);
        return mongodb.remove('comments', {title : req.params.title});
    }).then(function (result) {
        console.log('remove comments : ', result.result);
        var selector = {
            name : req.session.user.name,
            'time.day': req.params.day,
            title: req.params.title
        }
        return mongodb.remove('posts', selector);
    }).then(function (result) {
        console.log('remove posts : ', result.result);
        req.flash('success', '删除成功!');
        console.log('/space/'+ req.session.user.name +'/blogs');
        res.redirect('/space/'+ req.session.user.name +'/blogs');
    }).catch(function (err) {
            req.flash('error', err);
            return res.redirect('back');
    })
}

module.exports = {
    getPost : getPost,
    postPost : postPost,
    getEditPost : getEditPost,
    updatePost : updatePost,
    removePost : removePost,
    postPreview : postPreview,
    getEditArticle : getEditArticle,
    postEditArticle : postEditArticle
};