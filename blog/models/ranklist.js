/*
 * Login models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird');

function getRankList(req, res) {

    var posts,spaces,comments;

    mongodb.find('posts', {}, {pv:-1}, 10).then(function (results) {
        posts = results;
        return mongodb.find('user', {}, {pv:-1}, 10);
    }).then(function (results) {
        spaces = results;
        return mongodb.find('posts', {}, {c_num:-1}, 10);
    }).then(function (results) {
        comments = results;
        return mongodb.find('albums', {}, {pv:-1}, 10);
    }).then(function (results) {
        console.log(posts.length, spaces.length, comments.length, results.length);
        res.render('proscenium/ranklist', {
            href : 'ranklist',
            user : req.session.user,
            posts : posts,
            spaces : spaces,
            comments : comments,
            albums : results
        })
    })
}


module.exports = {
    getRankList: getRankList
};