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

module.exports = {
    getSettings : getSettings
}