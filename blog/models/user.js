/*
 * User models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    markdown = require('markdown').markdown;

function getUsers (req, res) {
    var page = req.params.page || 1;
    var num;
    mongodb.count('user', {}).then(function (count) {
        num = count;
        return mongodb.find('user', {}, {time : -1}, 10, {skip : (page - 1) * 10})
    }).then(function (results) {
        results.forEach(function (doc) {
            doc.signature = doc.signature.slice(0, 20) + '.....';
        })
        var total = parseInt(num % 10) === 0 ? parseInt(num / 10) : parseInt(num / 10) + 1;
        var t_res = [];
        for (var i = 0; i < total; i++) {
            t_res.push(i + 1);
        }
        res.render('admin/bloggers', {
            href: 'bloggers',
            users: results,
            page: page,
            total: t_res,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        }).catch(function (error) {
            req.flash('error', error.message);
            res.redirect('back');
        })
    })
}


module.exports = {
    getUsers : getUsers
};