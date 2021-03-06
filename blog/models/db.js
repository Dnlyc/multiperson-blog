/*
 * mongodb model.
 * created by Xie Wei at 2015/10/14.
 */

var Promise         = require('bluebird'),
    settings        = require('../settings'),
    MongoClient     = require('mongodb').MongoClient,
    database,
    Mongodb;

Mongodb = {
    /**
     * ### connect to mongodb
     * create mongodb connection
     * @returns {Promise}
     */
    init : function () {
        var url = 'mongodb://' + settings.host + ':' + settings.port + '/' + settings.db;
        console.log(url);
        return new Promise(function (reslove, reject) {
            MongoClient.connect(url, function (err, db) {
                if (err)  {
                    return reject(err)
                }
                console.log('mongodb connect successfully.');
                database = db;
                reslove();
            })
        });
    },

    /**
     * * ### Store docs into database
     * store an array of documents into collection.
     * @param cn (string) 鈥� the collection name we wish to into documents.
     * @param docs (Array) 鈥� the content of documents
     * @returns {Promise}
     */
    store : function (cn, docs) {
        var collection = database.collection(cn);
        return new Promise(function (resolve, reject) {
            collection.insertMany(docs, function(err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    },

    /**
     * ### remove documents.
     * @param cn (string) 鈥� the collection name we wish to update documents.
     * @param selector (object) - the selector for the update operation.
     * @returns {Promise}
     */
    remove : function (cn, selector) {
        var collection = database.collection(cn);
        return new Promise(function (resolve, reject) {
            collection.removeMany(selector, function(err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    },

    /**
     * ### Find documents.
     * @param cn (string) - the collection name we wish to update documents.
     * @param selector (object) - the selector for the find operation.
     * @param sort [object] - the sort for the find operation.
     * @param limit [Number] - the limit for the find operation.
     * @returns {Promise}
     */
    find : function (cn, selector, sort, limit, options) {
        var collection = database.collection(cn),
            selector = selector || {},
            options = options || {},
            sort = sort || {},
            limit = limit || NaN;

        return new Promise(function (resolve, reject) {
            collection.find(selector, options).sort(sort).limit(limit).toArray(function(err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    },

    /**
     * ### Updates documents.
     * @param cn (string) 鈥� the collection name we wish to update documents.
     * @param selector (object) - the selector for the update operation.
     * @param docs (object) - the update document.
     */
    update : function (cn, selector, docs) {
        var collection = database.collection(cn);

        return new Promise(function (resolve, reject) {
            collection.updateMany(selector, docs, function(err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    },

    /**
     * count collections
     * @param cn
     * @param selector
     * @returns {Promise}
     */
    count : function (cn, selector) {
        var collection = database.collection(cn);
        return new Promise(function (resolve, reject) {
            collection.count(selector, function(err, total) {
                if (err) {
                    return reject(err);
                }
                return resolve(total);
            });
        });
    },

    /**
     * ### close database
     * close database
     * @returns {Promise}
     */
    close : function () {
        return new Promise(function (resolve, reject) {
            database.close(false, function (err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }
}

module.exports = Mongodb;