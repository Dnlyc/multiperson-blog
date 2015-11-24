/*
 * Login models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird');

function getRankList(req, res) {
    res.render('proscenium/ranklist', {
        href : 'ranklist',
        user : req.session.user,
        success : req.flash('success').toString()
    })
}


module.exports = {
    getRankList: getRankList
};