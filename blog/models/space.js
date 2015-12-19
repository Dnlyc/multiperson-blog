var mongodb = require('../models/db'),
    trimHtml = require('trim-html'),
    Promise = require('bluebird');

function getSpace (req, res) {
    var blogger = req.params.name;
    var posts;

    return Promise.resolve().then(function () {
        console.log(req.session.user);
        if (typeof req.session.user === 'undefined' || !req.session.user || req.params.name !== req.session.user.name) {
            return mongodb.update('user', {name : req.params.name}, {$inc:{pv:1}})
        }
        return null;
    }).then(function () {
        return mongodb.find('posts', {name : req.params.name}, {time: -1}, 9)
    }).then(function (docs) {
        posts = docs.map(function (doc) {
            doc.post = trimHtml(markdown.toHTML(doc.post), {limit: 200, preserveTags: false});
            doc.post.html = doc.post.html.substr(0, 50);
            return doc;
        });
        return mongodb.find('albums', {name : req.params.name}, {day : -1}, 6);
    }).then(function (albums) {

        res.render('blog/index', {
            blogger : blogger,
            href : '',
            albums : albums,
            posts : posts,
            user : req.session.user
        });
    }).catch(function (err) {
        console.log(err.message);
        req.flash('error', err.message);
        return res.redirect('/');
    })
}

module.exports = {
    getSpace : getSpace
};