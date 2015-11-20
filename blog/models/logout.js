/*
 * Logout models
 */

/**
 * 登出请求
 * @param req
 * @param res
 */
module.exports =  function (req, res) {
    req.session.user = null;
    req.session.name = null;
    res.redirect('/');
};