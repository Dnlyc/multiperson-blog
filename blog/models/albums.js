var mongodb = require('../models/db'),
    data = require('../config/data');
    common = require('../lib/common'),
    fs = require('fs'),
    markdown = require('markdown').markdown,
    trimHtml = require('trim-html'),
    Promise = require('bluebird');


function getAlbums (req, res) {
    var data = {name : req.params.name};
    var blogger = req.params.name;

    mongodb.find('albums', {name : req.params.name}).then(function (result) {
        res.render('blog/albums', {
            blogger: blogger,
            href : 'albums',
            albums : result,
            user : req.session.user,
            success : req.flash('success').toString()
        })
    }).catch(function () {
        req.flash('error', err.message);
        res.redirect('back');
    })
}

function createAlbum (req, res) {
    var id;
    mongodb.find('albums', {name : req.params.name, title : req.body.title}).then(function (result) {
        if (result.length !== 0) {
            return Promise.reject({message : '相册名字重复！'});
        }
        return mongodb.count('albums', {name : req.params.name})
    }).then(function (total) {
        id = total;
        var doc = {
            id : total,
            title : req.body.title,
            name : req.params.name,
            day : common.getTime()
        }
        return mongodb.store('albums', [doc]);
    }).then(function () {
        fs.mkdirSync('./public/images/' + req.params.name + '/' + req.body.title);
        res.redirect('/space/' + req.params.name + '/albums/' + id);
    }).catch(function (err) {
        req.flash('error', err.message);
        res.redirect('back');
    });
}

function getNewAlbums (req, res) {
    var selector = {
        name : req.params.name,
        id : parseInt(req.params.id)
    };
    var blogger = req.params.name;

    mongodb.find('albums', selector).then(function (result) {
        if (result.length === 0) {
            return Promise.reject({message : '相册不存在！'});
        }
        result[0].photos = result[0].photos || [];
        process.albums = result[0].title;
        process.name = req.params.name;
        res.render('blog/albums_new', {
            blogger: blogger,
            href : 'albums',
            albums : result[0],
            user : req.session.user,
            success : req.flash('success').toString()
        })
    }).catch(function (err) {
        console.log(err.message);
        res.flash('err', err.message);
        res.redirect('back');
    })
}

function changeAlbums (req, res) {
    var selector = {
        name : req.params.name,
        id : parseInt(req.params.id)
    }
    if (typeof req.body.path === "undefined") {
        // 新增图片
        if (!(req.files.img instanceof Array)) {
            req.files.img = [req.files.img];
        }
        var result = req.files.img.map(function (file) {
            return mongodb.update('albums', selector, {$push : {photos : file.name}});
        })
        return Promise.all(result).then(function () {
            res.redirect('/space/' + req.params.name + '/albums/' + req.params.id);
        }).catch(function (err) {
            console.log(err.message);
            res.flash('err', err.message);
            res.redirect('back');
        })
    } else {
        // 删除图片
        console.log('remove albums');
        return mongodb.update('albums', selector, {$pull : {photos : req.body.path}}).then(function () {
            fs.unlinkSync('./public/images' + req.body.path);
            res.redirect('/space/' + req.params.name + '/albums/' + req.params.id);
        }).catch(function (err) {
            console.log(err.message);
            res.flash('err', err.message);
            res.redirect('back');
        })
    }
}

module.exports = {
    getAlbums : getAlbums,
    getNewAlbums : getNewAlbums,
    createAlbum : createAlbum,
    changeAlbums : changeAlbums
};