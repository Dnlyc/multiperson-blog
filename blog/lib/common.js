/**
 * common function
 */
var mongodb = require('../models/db')

function getTime () {
    var now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours(),
        minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(),
        time = {
            data : now,
            year : year,
            month : year + '-' + month,
            day : year + "-" + month + "-" + date,
            minute : year + "-" + month + "-" + date + " " + hours + ":" + minutes
        }

    return time;
}

/**
 * get recent comments
 * @param [name]
 */
function getRecentComments(name) {
    var res = [];
    var c_name,r_name;
    name = name || '';
    if (name === '') {
        c_name = r_name = {}
    } else {
        c_name = {c_name : name};
        r_name = {r_name : name};
    }
    return new Promise(function (resolve, reject) {
        mongodb.find('comments', c_name, {day : -1}, 5).then(function (comments) {
            if (typeof comments !== 'undefined') {
                res = res.concat(comments);
            }
            return mongodb.find('replys', r_name, {day : -1}, 5)
        }).then(function (replys) {
            if (typeof replys !== 'undefined') {
                res = res.concat(replys);
            }
            var r = res.sort(function (lp, rp) {
                return rp.time.data - lp.time.data;
            })
            r = r.slice(0, r.length > 5 ? 4 : r.length);
            return resolve(r);
        }).catch(function (err) {
            console.log(err.message);
            return reject(err);
        })
    })
}

function getBloggers () {
    ;
}

module.exports = {
    getTime : getTime,
    getRecentComments : getRecentComments
};