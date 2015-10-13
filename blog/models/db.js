/*
 * mongodb model.
 * created by Xie Wei at 2015/10/14.
 */

var settings        = require('../settings'),
    DB               = require('mongodb').Db,
    Connection      = require('mongodb').Connection,
    Server            = require('mongodb').Server;

module.exports = new DB(settings.db, new Server(settings.port, settings.port), {safe : true});