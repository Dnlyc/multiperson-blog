/*
 * settings models
 */
var mongodb = require('./db'),
    Promise = require('bluebird'),
    common = require('../lib/common');

function getSettings (req, res) {
    res.render('blog/settings', {
        href : 'settings',
        blogger : req.params.name,
        user : req.session.user,
        success : req.flash('success').toString()
    })
}

function postSettings (req, res) {
    console.log(req.body);
    console.log(req.files);
}

module.exports = {
    getSettings : getSettings,
    postSettings : postSettings
}