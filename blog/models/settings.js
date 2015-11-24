/*
 * settings models
 */
var mongodb = require('./db'),
    Promise = require('bluebird'),
    common = require('../lib/common');

function getSettings (req, res) {
    var year = parseInt(common.getTime().year);
    res.render('blog/settings', {
        href : 'settings',
        blogger : req.params.name,
        year : year,
        user : req.session.user,
        success : req.flash('success').toString()
    })
}

function postSettings (req, res) {

    if (req.files.avater || req.body.height || req.body.weight || req.body.hobby1 || req.body.hobby2 || req.body.hobby3 || req.body.email || req.body.signature) {
        var selector = {name : req.body.name};
        var doc = {birthday : req.body.year + '-' + req.body.month + '-' + req.body.day};
        if (req.files.avater) doc.avater = req.files.avater.name;
        if (req.files.height) doc.height = req.body.height;
        if (req.files.weight) doc.weight = req.body.weight;
        if (req.files.hobby1) doc.hobby1 = req.body.hobby1;
        if (req.files.hobby2) doc.hobby2 = req.body.hobby2;
        if (req.files.hobby3) doc.hobby3 = req.body.hobby3;
        if (req.files.email) doc.email = req.body.email;
        if (req.files.signature) doc.signature = req.body.signature;

        mongodb.update('users', selector).then(function () {
            res.redirect('/space/' + req.params.name + '/settings');
        }).catch(function () {
            res.redirect('back');
        });
    } else {
        res.redirect('back');
    }
}

module.exports = {
    getSettings : getSettings,
    postSettings : postSettings
}