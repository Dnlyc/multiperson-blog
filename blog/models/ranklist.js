/*
 * Login models
 */
var crypto = require('crypto'),
    Promise = require('bluebird');

function getRankList(req, res) {
    res.render('proscenium/ranklist', {
        href : 'ranklist',
        user : {name:"123"}
    })
}


module.exports = {
    getRankList: getRankList
};