/*
 * Logout models
 */

module.exports =  function (req, res) {
    res.render('admin/index', {
        href : '',
        name : req.session.admin.alias,
        error : req.flash('error').toString()
    })
};