/**
 * common function
 */

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

module.exports = {
    getTime : getTime
};