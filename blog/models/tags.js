/*
 * settings models
 */
var mongodb = require('./db'),
    Promise = require('bluebird'),
    common = require('../lib/common');

function getTags (req, res) {
    return mongodb.find('tags', {name : req.params.name}).then(function (results) {
        res.render('blog/tags', {
            href : 'tags',
            blogger : req.params.name,
            user : req.session.user,
            tags : results,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        })
    }).catch(function (err) {
        req.flash('error', err.message);
        res.redirect('back')
    })

}

function postTags (req, res) {
    var selector = {
        name : req.params.name,
        content : req.body.content,
        style : req.body.style
    }
    return mongodb.find('tags', selector).then(function (results) {
        if (results.length !== 0)
            return Promise.reject({message:'已存在该标签', redirect:'back'});
        return mongodb.count('tags', {name : req.body.name})
    }).then(function (num) {
        selector.id = num;
        return mongodb.store('tags', [selector])
    }).then(function () {
        res.redirect('/space/' + req.params.name + '/tags');
    }).catch(function (err) {
        console.log(err.message);
        var direct = err.redirect || 'back';
        req.flash('error', err.message);
        res.redirect(direct)
    })
}

function updateTags (req, res) {
    var selector = {
        id : parseInt(req.body.id),
        name : req.params.name
    }
    return  mongodb.find('tags', selector).then(function (results) {
        if (results.length === 0) {
            return Promise.reject({message : '不存在该标签', redirect: 'back'});
        }
        return mongodb.update('tags',selector,
            {$set : {content : req.body.content, style : req.body.style}});
    }).then(function (results) {
        console.log(results.result);
        res.json({success : 1});
    }).catch(function (err) {
        console.log(err.message);
        res.json({success : 0});
    })
}

function removeTags (req, res) {
    var selector = {
        id : parseInt(req.body.id),
        name : req.params.name
    }
    console.log(selector);
    return  mongodb.remove('tags', selector).then(function () {
        return mongodb.update('posts', {name : req.params.name}, {$pull : {tags : parseInt(req.body.id)}});
    }).then(function (results) {
        console.log(results.result);
        res.json({success : 1});
    }).catch(function (err) {
        console.log(err.message);
        res.json({success : 0});
    })
}

module.exports = {
    getTags : getTags,
    postTags : postTags,
    updateTags : updateTags,
    removeTags : removeTags
}