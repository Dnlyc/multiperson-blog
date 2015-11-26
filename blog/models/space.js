
function getSpace (req, res) {
    var blogger = req.params.name;
    res.render('blog/index', {
        blogger: blogger,
        href : '',
        user : req.session.user
    });
}

module.exports = {
    getSpace : getSpace
};