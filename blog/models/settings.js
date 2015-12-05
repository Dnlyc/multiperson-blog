/*
 * settings models
 */
var mongodb = require('./db'),
    Promise = require('bluebird'),
    common = require('../lib/common');

function getSettings (req, res) {
    process.name = req.params.name;
    process.albums = "";
    var year = parseInt(common.getTime().year);

    mongodb.find('user', {name : req.params.name}).then(function (results) {
        var result = results[0];
        if (typeof result === 'undefined')
            return Promise.reject({message : '用户不存在!', direct : '/'});
        var setting = {
            name : result.name,
            avater : result.avatar,
            year : parseInt(result.birthday.slice(0, result.birthday.indexOf('-'))),
            month : parseInt(result.birthday.slice(result.birthday.indexOf('-') + 1, result.birthday.lastIndexOf('-'))),
            day : parseInt(result.birthday.slice(result.birthday.lastIndexOf('-') + 1, result.birthday.length))
        };
        if (typeof result.hobby1 !== 'undefined') setting.hobby1 = result.hobby1;
        if (typeof result.hobby2 !== 'undefined') setting.hobby2 = result.hobby2;
        if (typeof result.hobby3 !== 'undefined') setting.hobby3 = result.hobby3;
        if (typeof result.height !== 'undefined') setting.height = result.height;
        if (typeof result.weight !== 'undefined') setting.weight = result.weight;
        if (typeof result.email !== 'undefined') setting.email = result.email;
        if (typeof result.signature !== 'undefined') setting.signature = result.signature;

        console.log(setting);

        res.render('blog/settings', {
            href : 'settings',
            blogger : req.params.name,
            result: setting,
            year : year,
            user : req.session.user,
            success : req.flash('success').toString()
        })
    }).catch(function (err) {
        console.log(err.message);
    })
}

function postSettings (req, res) {
    if (req.files.avater || req.body.height || req.body.weight || req.body.hobby1 || req.body.hobby2 || req.body.hobby3 || req.body.email || req.body.signature) {
        var selector = {name : req.body.name};
        var doc = {birthday : req.body.year + '-' + req.body.month + '-' + req.body.day};
        if (req.files.avater) doc.avatar = req.files.avater.name;
        if (req.body.height) doc.height = req.body.height;
        if (req.body.weight) doc.weight = req.body.weight;
        if (req.body.hobby1) doc.hobby1 = req.body.hobby1;
        if (req.body.hobby2) doc.hobby2 = req.body.hobby2;
        if (req.body.hobby3) doc.hobby3 = req.body.hobby3;
        if (req.body.email) doc.email = req.body.email;
        if (req.body.signature) doc.signature = req.body.signature;

        mongodb.update('user', selector, {$set : doc}).then(function (result) {

            if (req.files.avater) {
                mongodb.update('comments', {c_name : req.session.user.name}, {$set : {c_avatar : req.files.avater.name}}).then(function (result) {
                    mongodb.update('replys', {r_name : req.session.user.name}, {$set : {r_avatar : req.files.avater.name}})
                }).then(function () {
                    req.session.user.avatar = req.files.avater.name;
                    res.redirect('/space/' + req.params.name + '/settings');
                })
            } else {
                res.redirect('/space/' + req.params.name + '/settings');
            }
        }).catch(function (err) {
            console.log(err.message)
            res.redirect('back');
        });
    } else {
        console.log('no message');
        res.redirect('back');
    }
}

module.exports = {
    getSettings : getSettings,
    postSettings : postSettings
}