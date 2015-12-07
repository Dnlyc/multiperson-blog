/*
 * Logout models
 */

function getLogout (req, res) {
    req.session.user = null;
    req.session.name = null;
    res.redirect('/');
}

function getMainLogout (req, res) {
    req.session.admin = null;
    res.redirect('/main');
}

module.exports =  {
    getLogout : getLogout,
    getMainLogout : getMainLogout
};