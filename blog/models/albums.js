var mongodb = require('../models/db'),
    data = require('../config/data');
    common = require('../lib/common'),
    fs = require('fs'),
    markdown = require('markdown').markdown,
    trimHtml = require('trim-html'),
    Promise = require('bluebird');


function getAlbumsByName (req, res) {
    var data = {name : req.params.name};
    var blogger = req.params.name;

    mongodb.find('albums', {name : req.params.name}, {day:-1}).then(function (result) {
        res.render('blog/albums', {
            blogger: blogger,
            href : 'albums',
            albums : result,
            user : req.session.user,
            success : req.flash('success').toString()
        })
    }).catch(function (err) {
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
            pv : 0,
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
    var album;

    mongodb.find('albums', selector).then(function (result) {
        if (result.length === 0) {
            return Promise.reject({message : '相册不存在！'});
        }
        result[0].photos = result[0].photos || [];
        album = result[0];
        process.albums = result[0].title;
        process.name = req.params.name;
        if (typeof req.session.user === 'undefined' || req.params.name == req.session.user.name) {
            return Promise.resolve();
        }
        return mongodb.update('albums', selector, {$inc: {pv: 1}})
    }).then(function () {
        console.log(req.session.user);
        res.render('blog/albums_new', {
            blogger: blogger,
            href : 'albums',
            albums : album,
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

function getPAlbums (req, res) {
    var page = req.params.page || 1;
    var count;

    mongodb.count('albums', {}).then(function (num) {
        count = num;
        return mongodb.find('albums', {}, {day: -1}, 9, {skip : (page - 1) * 9});
    }).then(function (results) {
        var total = count % 9 == 0 ? count / 9 :parseInt(count / 9) + 1;
        var t_res = [];
        for (var i = 0; i < total; i++) {
            t_res.push(i + 1);
        }
        res.render('proscenium/albums', {
            href : 'albums',
            albums : results,
            user : req.session.user,
            total : t_res,
            page : page,
            con : {}
        })
    })
}

module.exports = {
    getAlbumsByName : getAlbumsByName,
    getNewAlbums : getNewAlbums,
    createAlbum : createAlbum,
    changeAlbums : changeAlbums,
    getPAlbums : getPAlbums
};