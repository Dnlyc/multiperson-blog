/*
 * settings models
 */
var mongodb = require('./db'),
    Promise = require('bluebird'),
    common = require('../lib/common');

function getTags (req, res) {
    res.render('blog/tags', {
        href : 'tags',
        blogger : req.params.name,
        user : req.session.user,
        success : req.flash('success').toString()
    })
}

function postTags (req, res) {

}

module.exports = {
    getSettings : getTags,
    postSettings : postTags
}