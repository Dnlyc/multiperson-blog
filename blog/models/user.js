/*
 * User models
 */
var mongodb = require('./db'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    markdown = require('markdown').markdown;

function getUsers (req, res) {
    var page = req.params.page || 1;
    var total, selector = {};
    if (typeof req.body.name !== 'undefined' && req.body.name !== '') selector.name = new RegExp(req.body.name);

    mongodb.count('user', selector).then(function (count) {
        total = count;
        return mongodb.find('user', selector, {pv : -1}, 10, {skip : (page - 1) * 10})
    }).then(function (results) {
        results.forEach(function (doc) {
            if (doc.signature.length > 20) {
                doc.signature = doc.signature.slice(0, 20) + '.....';
            }
        })
        console.log(results);
        res.render('admin/bloggers', {
            href: 'bloggers',
            users: results,
            page: page,
            total: parseInt(total % 10) === 0 ? parseInt(total / 10) : parseInt(total / 10) + 1,
            search : req.body,
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